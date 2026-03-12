import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  user_id: string;
  day?: number;
  month?: number;
  year?: number;
}

@injectable()
class ListUserAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    user_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    let appointments: Appointment[];

    if (day && month && year) {
      appointments = await this.appointmentsRepository.findAllByUserAndDate(
        user_id,
        day,
        month,
        year,
      );
    } else {
      appointments = await this.appointmentsRepository.findAllByUser(user_id);
    }

    return appointments;
  }
}

export default ListUserAppointmentsService;
