import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAvailableSlotsRepository from '../repositories/IAvailableSlotsRepository';

interface IRequest {
  slot_id: string;
}

@injectable()
class DeleteAvailableSlotService {
  constructor(
    @inject('AvailableSlotsRepository')
    private availableSlotsRepository: IAvailableSlotsRepository,
  ) {}

  public async execute({ slot_id }: IRequest): Promise<void> {
    const slot = await this.availableSlotsRepository.findById(slot_id);

    if (!slot) {
      throw new AppError('Slot not found');
    }

    if (!slot.is_available) {
      throw new AppError('Cannot delete a booked slot');
    }

    await this.availableSlotsRepository.delete(slot_id);
  }
}

export default DeleteAvailableSlotService;
