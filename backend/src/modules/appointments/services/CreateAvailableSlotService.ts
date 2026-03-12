import { startOfHour, isBefore } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAvailableSlotsRepository from '../repositories/IAvailableSlotsRepository';

import AvailableSlot from '../infra/typeorm/entities/AvailableSlot';

interface IRequest {
  admin_id: string;
  date: Date;
}

@injectable()
class CreateAvailableSlotService {
  constructor(
    @inject('AvailableSlotsRepository')
    private availableSlotsRepository: IAvailableSlotsRepository,
  ) {}

  public async execute({ admin_id, date }: IRequest): Promise<AvailableSlot> {
    const slotDate = startOfHour(date);

    if (isBefore(slotDate, Date.now())) {
      throw new AppError("You can't create an available slot in the past");
    }

    const existingSlot = await this.availableSlotsRepository.findByDate(
      slotDate,
    );

    if (existingSlot) {
      throw new AppError('This time slot is already available');
    }

    const slot = await this.availableSlotsRepository.create({
      admin_id,
      date: slotDate,
    });

    return slot;
  }
}

export default CreateAvailableSlotService;
