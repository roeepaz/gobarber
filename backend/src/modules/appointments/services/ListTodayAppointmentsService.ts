import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IResponse {
  appointments: Appointment[];
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
  };
}

@injectable()
class ListTodayAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(): Promise<IResponse> {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const appointments = await this.appointmentsRepository.findAllInDay(
      day,
      month,
      year,
    );

    const stats = {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      approved: appointments.filter(a => a.status === 'approved').length,
      rejected: appointments.filter(a => a.status === 'rejected').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
    };

    return {
      appointments,
      stats,
    };
  }
}

export default ListTodayAppointmentsService;
