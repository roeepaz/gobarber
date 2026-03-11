import { getRepository, Repository, Between } from 'typeorm';

import IAvailableSlotsRepository from '@modules/appointments/repositories/IAvailableSlotsRepository';
import ICreateAvailableSlotDTO from '@modules/appointments/dtos/ICreateAvailableSlotDTO';

import AvailableSlot from '../entities/AvailableSlot';

class AvailableSlotsRepository implements IAvailableSlotsRepository {
  private ormRepository: Repository<AvailableSlot>;

  constructor() {
    this.ormRepository = getRepository(AvailableSlot);
  }

  public async findById(id: string): Promise<AvailableSlot | undefined> {
    const slot = await this.ormRepository.findOne(id);
    return slot;
  }

  public async findByDate(date: Date): Promise<AvailableSlot | undefined> {
    const findSlot = await this.ormRepository.findOne({
      where: { date },
    });

    return findSlot;
  }

  public async findByDateAndHour(
    date: Date,
    hour: number,
    minute: number,
  ): Promise<AvailableSlot | undefined> {
    const targetDate = new Date(date);
    targetDate.setHours(hour, minute, 0, 0);

    const findSlot = await this.ormRepository.findOne({
      where: { date: targetDate },
    });

    return findSlot;
  }

  public async findAllAvailable(): Promise<AvailableSlot[]> {
    const slots = await this.ormRepository.find({
      where: { is_available: true },
      order: { date: 'ASC' },
    });

    return slots;
  }

  public async findAvailableByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<AvailableSlot[]> {
    const slots = await this.ormRepository.find({
      where: {
        date: Between(startDate, endDate),
        is_available: true,
      },
      order: { date: 'ASC' },
    });

    return slots;
  }

  public async findAllByAdmin(admin_id: string): Promise<AvailableSlot[]> {
    const slots = await this.ormRepository.find({
      where: { admin_id },
      order: { date: 'ASC' },
    });

    return slots;
  }

  public async create({
    admin_id,
    date,
  }: ICreateAvailableSlotDTO): Promise<AvailableSlot> {
    const slot = this.ormRepository.create({
      admin_id,
      date,
      is_available: true,
    });

    await this.ormRepository.save(slot);

    return slot;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(slot: AvailableSlot): Promise<AvailableSlot> {
    return this.ormRepository.save(slot);
  }
}

export default AvailableSlotsRepository;
