import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAdminAppointmentsService from '@modules/appointments/services/ListAdminAppointmentsService';
import ListTodayAppointmentsService from '@modules/appointments/services/ListTodayAppointmentsService';
import UpdateAppointmentStatusService from '@modules/appointments/services/UpdateAppointmentStatusService';
import GetAdminDashboardStatsService from '@modules/appointments/services/GetAdminDashboardStatsService';

export default class AdminAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { status } = request.query;

    const listAdminAppointments = container.resolve(ListAdminAppointmentsService);

    const appointments = await listAdminAppointments.execute({
      status: status as 'pending' | 'approved' | 'rejected' | 'cancelled' | undefined,
    });

    return response.json(appointments);
  }

  public async today(request: Request, response: Response): Promise<Response> {
    const listTodayAppointments = container.resolve(ListTodayAppointmentsService);

    const result = await listTodayAppointments.execute();

    return response.json(result);
  }

  public async stats(request: Request, response: Response): Promise<Response> {
    const getAdminDashboardStats = container.resolve(GetAdminDashboardStatsService);

    const stats = await getAdminDashboardStats.execute();

    return response.json(stats);
  }

  public async approve(request: Request, response: Response): Promise<Response> {
    const { appointment_id } = request.params;

    const updateAppointmentStatus = container.resolve(UpdateAppointmentStatusService);

    const appointment = await updateAppointmentStatus.execute({
      appointment_id,
      status: 'approved',
    });

    return response.json(appointment);
  }

  public async reject(request: Request, response: Response): Promise<Response> {
    const { appointment_id } = request.params;

    const updateAppointmentStatus = container.resolve(UpdateAppointmentStatusService);

    const appointment = await updateAppointmentStatus.execute({
      appointment_id,
      status: 'rejected',
    });

    return response.json(appointment);
  }
}
