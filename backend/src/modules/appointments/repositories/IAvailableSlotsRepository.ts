import AvailableSlot from '../infra/typeorm/entities/AvailableSlot';
import ICreateAvailableSlotDTO from '../dtos/ICreateAvailableSlotDTO';

export default interface IAvailableSlotsRepository {
  create(data: ICreateAvailableSlotDTO): Promise<AvailableSlot>;
  findById(id: string): Promise<AvailableSlot | undefined>;
  findByDate(date: Date): Promise<AvailableSlot | undefined>;
  findAllAvailable(): Promise<AvailableSlot[]>;
  findAllByAdmin(admin_id: string): Promise<AvailableSlot[]>;
  findAvailableByDateRange(startDate: Date, endDate: Date): Promise<AvailableSlot[]>;
  findByDateAndHour(date: Date, hour: number, minute: number): Promise<AvailableSlot | undefined>;
  delete(id: string): Promise<void>;
  save(slot: AvailableSlot): Promise<AvailableSlot>;
}
