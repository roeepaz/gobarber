import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  appointment_id: string;
  status: 'approved' | 'rejected';
}

@injectable()
class UpdateAppointmentStatusService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    appointment_id,
    status,
  }: IRequest): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(
      appointment_id,
    );

    if (!appointment) {
      throw new AppError('Appointment not found');
    }

    if (appointment.status !== 'pending') {
      throw new AppError('Only pending appointments can be updated');
    }

    appointment.status = status;

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default UpdateAppointmentStatusService;
