import { injectable, inject } from 'tsyringe';

import IAvailableSlotsRepository from '../repositories/IAvailableSlotsRepository';

import AvailableSlot from '../infra/typeorm/entities/AvailableSlot';

@injectable()
class ListAvailableSlotsService {
  constructor(
    @inject('AvailableSlotsRepository')
    private availableSlotsRepository: IAvailableSlotsRepository,
  ) {}

  public async execute(): Promise<AvailableSlot[]> {
    const slots = await this.availableSlotsRepository.findAllAvailable();

    return slots;
  }
}

export default ListAvailableSlotsService;
