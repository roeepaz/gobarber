import { isEqual, isAfter, isBefore } from 'date-fns';

import IAvailableSlotsRepository from '@modules/appointments/repositories/IAvailableSlotsRepository';
import ICreateAvailableSlotDTO from '@modules/appointments/dtos/ICreateAvailableSlotDTO';

import AvailableSlot from '../../infra/typeorm/entities/AvailableSlot';

class FakeAvailableSlotsRepository implements IAvailableSlotsRepository {
  private slots: AvailableSlot[] = [];

  public async findById(id: string): Promise<AvailableSlot | undefined> {
    return this.slots.find(slot => slot.id === id);
  }

  public async findByDate(date: Date): Promise<AvailableSlot | undefined> {
    return this.slots.find(slot => isEqual(slot.date, date));
  }

  public async findByDateAndHour(
    date: Date,
    hour: number,
    minute: number,
  ): Promise<AvailableSlot | undefined> {
    const targetDate = new Date(date);
    targetDate.setHours(hour, minute, 0, 0);

    return this.slots.find(slot => isEqual(slot.date, targetDate));
  }

  public async findAllAvailable(): Promise<AvailableSlot[]> {
    return this.slots.filter(slot => slot.is_available);
  }

  public async findAvailableByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<AvailableSlot[]> {
    return this.slots.filter(
      slot =>
        slot.is_available &&
        (isAfter(slot.date, startDate) || isEqual(slot.date, startDate)) &&
        (isBefore(slot.date, endDate) || isEqual(slot.date, endDate)),
    );
  }

  public async findAllByAdmin(admin_id: string): Promise<AvailableSlot[]> {
    return this.slots.filter(slot => slot.admin_id === admin_id);
  }

  public async create({
    admin_id,
    date,
  }: ICreateAvailableSlotDTO): Promise<AvailableSlot> {
    const slot = new AvailableSlot();

    Object.assign(slot, {
      id: 'uuid',
      admin_id,
      date,
      is_available: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.slots.push(slot);

    return slot;
  }

  public async delete(id: string): Promise<void> {
    const index = this.slots.findIndex(slot => slot.id === id);
    if (index !== -1) {
      this.slots.splice(index, 1);
    }
  }

  public async save(slot: AvailableSlot): Promise<AvailableSlot> {
    const index = this.slots.findIndex(s => s.id === slot.id);
    if (index !== -1) {
      this.slots[index] = slot;
    } else {
      this.slots.push(slot);
    }
    return slot;
  }
}

export default FakeAvailableSlotsRepository;
