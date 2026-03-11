import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findById(id: string): Promise<Appointment | undefined>;
  findByDate(data: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllByUser(user_id: string): Promise<Appointment[]>;
  findAllByUserAndDate(
    user_id: string,
    day: number,
    month: number,
    year: number,
  ): Promise<Appointment[]>;
  findAllByStatus(
    status: 'pending' | 'approved' | 'rejected' | 'cancelled',
  ): Promise<Appointment[]>;
  findAllInDay(
    day: number,
    month: number,
    year: number,
  ): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<Appointment>;
}
