import { injectable, inject } from 'tsyringe';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { getRepository, Between } from 'typeorm';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';
import AvailableSlot from '../infra/typeorm/entities/AvailableSlot';

interface IResponse {
  totalAppointments: number;
  pendingAppointments: number;
  approvedAppointments: number;
  rejectedAppointments: number;
  cancelledAppointments: number;
  todayStats: {
    total: number;
    pending: number;
    approved: number;
  };
  weekStats: {
    total: number;
    pending: number;
    approved: number;
  };
  monthStats: {
    total: number;
    pending: number;
    approved: number;
  };
  slotUtilization: {
    totalSlots: number;
    availableSlots: number;
    bookedSlots: number;
    utilizationRate: number;
  };
}

@injectable()
class GetAdminDashboardStatsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(): Promise<IResponse> {
    const now = new Date();

    const appointmentsRepository = getRepository(Appointment);
    const slotsRepository = getRepository(AvailableSlot);

    // Use COUNT queries for better performance with large datasets
    const [
      pendingAppointments,
      approvedAppointments,
      rejectedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      appointmentsRepository.count({ where: { status: 'pending' } }),
      appointmentsRepository.count({ where: { status: 'approved' } }),
      appointmentsRepository.count({ where: { status: 'rejected' } }),
      appointmentsRepository.count({ where: { status: 'cancelled' } }),
    ]);

    const totalAppointments = pendingAppointments + approvedAppointments + rejectedAppointments + cancelledAppointments;

    // Today's stats - use COUNT with date range
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const [todayPending, todayApproved] = await Promise.all([
      appointmentsRepository.count({
        where: {
          status: 'pending',
          date: Between(todayStart, todayEnd),
        },
      }),
      appointmentsRepository.count({
        where: {
          status: 'approved',
          date: Between(todayStart, todayEnd),
        },
      }),
    ]);

    // Week stats - use COUNT with date range
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const [weekPending, weekApproved] = await Promise.all([
      appointmentsRepository.count({
        where: {
          status: 'pending',
          date: Between(weekStart, weekEnd),
        },
      }),
      appointmentsRepository.count({
        where: {
          status: 'approved',
          date: Between(weekStart, weekEnd),
        },
      }),
    ]);

    // Month stats - use COUNT with date range
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const [monthPending, monthApproved] = await Promise.all([
      appointmentsRepository.count({
        where: {
          status: 'pending',
          date: Between(monthStart, monthEnd),
        },
      }),
      appointmentsRepository.count({
        where: {
          status: 'approved',
          date: Between(monthStart, monthEnd),
        },
      }),
    ]);

    // Slot utilization - use COUNT for efficiency
    const [totalSlots, availableSlots] = await Promise.all([
      slotsRepository.count(),
      slotsRepository.count({ where: { is_available: true } }),
    ]);

    const bookedSlots = totalSlots - availableSlots;
    const utilizationRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;

    return {
      totalAppointments,
      pendingAppointments,
      approvedAppointments,
      rejectedAppointments,
      cancelledAppointments,
      todayStats: {
        total: todayPending + todayApproved,
        pending: todayPending,
        approved: todayApproved,
      },
      weekStats: {
        total: weekPending + weekApproved,
        pending: weekPending,
        approved: weekApproved,
      },
      monthStats: {
        total: monthPending + monthApproved,
        pending: monthPending,
        approved: monthApproved,
      },
      slotUtilization: {
        totalSlots,
        availableSlots,
        bookedSlots,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
      },
    };
  }
}

export default GetAdminDashboardStatsService;
