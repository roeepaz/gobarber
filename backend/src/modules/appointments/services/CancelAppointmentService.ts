import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  appointment_id: string;
  user_id: string;
}

@injectable()
class CancelAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    appointment_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(
      appointment_id,
    );

    if (!appointment) {
      throw new AppError('Appointment not found');
    }

    if (appointment.user_id !== user_id) {
      throw new AppError('You can only cancel your own appointments');
    }

    if (appointment.status !== 'pending') {
      throw new AppError('You can only cancel pending appointments');
    }

    appointment.status = 'cancelled';

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CancelAppointmentService;
