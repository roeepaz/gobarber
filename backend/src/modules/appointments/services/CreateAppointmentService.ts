import { isBefore, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { getRepository, getManager } from 'typeorm';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IAvailableSlotsRepository from '@modules/appointments/repositories/IAvailableSlotsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import AvailableSlot from '../infra/typeorm/entities/AvailableSlot';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('AvailableSlotsRepository')
    private availableSlotsRepository: IAvailableSlotsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = date;

    const checkProviderExists = await this.usersRepository.findById(
      provider_id,
    );

    if (!checkProviderExists) throw new AppError('Provider not found');

    if (isBefore(appointmentDate, Date.now()))
      throw new AppError("You can't create an appointment on a past Date");

    if (user_id === provider_id)
      throw new AppError("You can't create an appointment with yourself");

    // Use transaction with pessimistic locking to prevent race conditions
    const appointment = await getManager().transaction(async transactionalEntityManager => {
      const slotsRepository = transactionalEntityManager.getRepository(AvailableSlot);
      const appointmentsRepository = transactionalEntityManager.getRepository(Appointment);

      // Lock the available slot row for update to prevent concurrent bookings
      const availableSlot = await slotsRepository.findOne({
        where: { date: appointmentDate },
        lock: { mode: 'pessimistic_write' },
      });

      if (!availableSlot || !availableSlot.is_available) {
        throw new AppError('This time slot is not available for booking');
      }

      // Check for existing appointment within the transaction
      const existingAppointment = await appointmentsRepository.findOne({
        where: { date: appointmentDate, provider_id },
      });

      if (existingAppointment) {
        throw new AppError('This appointment is already booked');
      }

      // Create appointment
      const newAppointment = appointmentsRepository.create({
        provider_id,
        user_id,
        date: appointmentDate,
        status: 'pending',
      });

      await appointmentsRepository.save(newAppointment);

      // Mark slot as unavailable
      availableSlot.is_available = false;
      await slotsRepository.save(availableSlot);

      return newAppointment;
    });

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${formattedDate}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
