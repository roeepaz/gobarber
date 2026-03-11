import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

@injectable()
class ListAdminAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ status }: IRequest): Promise<Appointment[]> {
    let appointments: Appointment[];

    if (status) {
      appointments = await this.appointmentsRepository.findAllByStatus(status);
    } else {
      // If no status filter, get all appointments
      const pending = await this.appointmentsRepository.findAllByStatus(
        'pending',
      );
      const approved = await this.appointmentsRepository.findAllByStatus(
        'approved',
      );
      const rejected = await this.appointmentsRepository.findAllByStatus(
        'rejected',
      );
      const cancelled = await this.appointmentsRepository.findAllByStatus(
        'cancelled',
      );
      appointments = [...pending, ...approved, ...rejected, ...cancelled];
    }

    return appointments;
  }
}

export default ListAdminAppointmentsService;
