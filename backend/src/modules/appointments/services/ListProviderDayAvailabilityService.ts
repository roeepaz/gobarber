import { injectable, inject } from 'tsyringe';
import { getHours, getMinutes, isAfter, startOfDay, endOfDay } from 'date-fns';

import IAvailableSlotsRepository from '@modules/appointments/repositories/IAvailableSlotsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  minute: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AvailableSlotsRepository')
    private availableSlotsRepository: IAvailableSlotsRepository,
  ) {}

  public async execute({
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    // Get start and end of the selected day
    const startDate = startOfDay(new Date(year, month - 1, day));
    const endDate = endOfDay(new Date(year, month - 1, day));

    // Get all available slots for this day from the available_slots table
    const availableSlots = await this.availableSlotsRepository.findAvailableByDateRange(
      startDate,
      endDate,
    );

    const currentDate = new Date(Date.now());

    // Map the available slots to the response format
    const availability = availableSlots.map(slot => {
      const hour = getHours(slot.date);
      const minute = getMinutes(slot.date);
      const compareDate = new Date(year, month - 1, day, hour, minute);

      return {
        hour,
        minute,
        available: isAfter(compareDate, currentDate),
      };
    });

    // Sort by hour and minute
    availability.sort((a, b) => {
      if (a.hour !== b.hour) {
        return a.hour - b.hour;
      }
      return a.minute - b.minute;
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
