import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAvailableSlotService from '@modules/appointments/services/CreateAvailableSlotService';
import CreateAvailableSlotsBatchService from '@modules/appointments/services/CreateAvailableSlotsBatchService';
import ListAvailableSlotsService from '@modules/appointments/services/ListAvailableSlotsService';
import DeleteAvailableSlotService from '@modules/appointments/services/DeleteAvailableSlotService';

export default class AvailableSlotsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listAvailableSlots = container.resolve(ListAvailableSlotsService);

    const slots = await listAvailableSlots.execute();

    return response.json(slots);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const admin_id = request.user.id;
    const { date, startTime, endTime, intervalMinutes } = request.body;

    // If startTime and endTime are provided, use batch creation
    if (startTime && endTime) {
      const createAvailableSlotsBatch = container.resolve(
        CreateAvailableSlotsBatchService,
      );

      const result = await createAvailableSlotsBatch.execute({
        admin_id,
        date,
        startTime,
        endTime,
        intervalMinutes: intervalMinutes || 20,
      });

      return response.json(result);
    }

    // Otherwise, create a single slot (backward compatibility)
    const createAvailableSlot = container.resolve(CreateAvailableSlotService);

    const slot = await createAvailableSlot.execute({
      admin_id,
      date,
    });

    return response.json(slot);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { slot_id } = request.params;

    const deleteAvailableSlot = container.resolve(DeleteAvailableSlotService);

    await deleteAvailableSlot.execute({
      slot_id,
    });

    return response.status(204).send();
  }
}
