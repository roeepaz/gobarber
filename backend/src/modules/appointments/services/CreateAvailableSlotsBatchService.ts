import { setHours, setMinutes, setSeconds, isBefore, addMinutes, startOfDay } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAvailableSlotsRepository from '../repositories/IAvailableSlotsRepository';

import AvailableSlot from '../infra/typeorm/entities/AvailableSlot';

interface IRequest {
  admin_id: string;
  date: Date;
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm"
  intervalMinutes?: number; // Default: 20
}

interface IResponse {
  slots: AvailableSlot[];
  count: number;
}

@injectable()
class CreateAvailableSlotsBatchService {
  constructor(
    @inject('AvailableSlotsRepository')
    private availableSlotsRepository: IAvailableSlotsRepository,
  ) {}

  public async execute({
    admin_id,
    date,
    startTime,
    endTime,
    intervalMinutes = 20,
  }: IRequest): Promise<IResponse> {
    // Parse start and end times
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    if (
      isNaN(startHour) ||
      isNaN(startMinute) ||
      isNaN(endHour) ||
      isNaN(endMinute)
    ) {
      throw new AppError('Invalid time format. Use HH:mm');
    }

    // Validate time range
    if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
      throw new AppError('End time must be after start time');
    }

    // Create base date (without time)
    const baseDate = startOfDay(date);

    // Build slot times
    const slotsToCreate: Date[] = [];
    let currentSlot = setMinutes(setHours(baseDate, startHour), startMinute);
    const endSlotTime = setMinutes(setHours(baseDate, endHour), endMinute);

    // Check if date is in the past
    const lastSlotTime = addMinutes(endSlotTime, -intervalMinutes);
    if (isBefore(lastSlotTime, Date.now())) {
      throw new AppError("You can't create available slots in the past");
    }

    // Generate all slot times
    while (isBefore(currentSlot, endSlotTime) || currentSlot.getTime() === endSlotTime.getTime()) {
      // Skip slots in the past
      if (!isBefore(currentSlot, Date.now())) {
        slotsToCreate.push(new Date(currentSlot));
      }
      currentSlot = addMinutes(currentSlot, intervalMinutes);
    }

    if (slotsToCreate.length === 0) {
      throw new AppError('No valid slots to create in the given time range');
    }

    // Check for existing slots and create new ones
    const createdSlots: AvailableSlot[] = [];
    const skippedSlots: Date[] = [];

    for (const slotDate of slotsToCreate) {
      const existingSlot = await this.availableSlotsRepository.findByDate(slotDate);

      if (existingSlot) {
        skippedSlots.push(slotDate);
        continue;
      }

      const slot = await this.availableSlotsRepository.create({
        admin_id,
        date: slotDate,
      });

      createdSlots.push(slot);
    }

    return {
      slots: createdSlots,
      count: createdSlots.length,
    };
  }
}

export default CreateAvailableSlotsBatchService;
