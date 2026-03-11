import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureAdmin from '@modules/users/infra/http/middlewares/ensureAdmin';
import AvailableSlotsController from '../controllers/AvailableSlotsController';

const availableSlotsRouter = Router();
const availableSlotsController = new AvailableSlotsController();

availableSlotsRouter.use(ensureAuthenticated);

// Public endpoint to list available slots
availableSlotsRouter.get('/', availableSlotsController.index);

// Admin only endpoint to create available slots (single or batch)
availableSlotsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      date: Joi.date().required(),
      startTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:mm format
      endTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),   // HH:mm format
      intervalMinutes: Joi.number().integer().min(5).max(60).default(20),
    },
  }),
  ensureAdmin,
  availableSlotsController.create,
);

// Admin only endpoint to delete an available slot
availableSlotsRouter.delete(
  '/:slot_id',
  celebrate({
    [Segments.PARAMS]: {
      slot_id: Joi.string().uuid().required(),
    },
  }),
  ensureAdmin,
  availableSlotsController.delete,
);

export default availableSlotsRouter;
