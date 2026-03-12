import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUserAppointmentsService from '@modules/appointments/services/ListUserAppointmentsService';
import CancelAppointmentService from '@modules/appointments/services/CancelAppointmentService';

export default class UserAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { day, month, year } = request.query;

    const listUserAppointments = container.resolve(ListUserAppointmentsService);

    const appointments = await listUserAppointments.execute({
      user_id,
      day: day ? Number(day) : undefined,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
    });

    return response.json(appointments);
  }

  public async cancel(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { appointment_id } = request.params;

    const cancelAppointment = container.resolve(CancelAppointmentService);

    const appointment = await cancelAppointment.execute({
      appointment_id,
      user_id,
    });

    return response.json(appointment);
  }
}
