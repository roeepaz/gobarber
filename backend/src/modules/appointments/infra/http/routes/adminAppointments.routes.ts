import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureAdmin from '@modules/users/infra/http/middlewares/ensureAdmin';
import AdminAppointmentsController from '../controllers/AdminAppointmentsController';

const adminAppointmentsRouter = Router();
const adminAppointmentsController = new AdminAppointmentsController();

adminAppointmentsRouter.use(ensureAuthenticated, ensureAdmin);

// List all appointments (with optional status filter)
adminAppointmentsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      status: Joi.string().valid('pending', 'approved', 'rejected', 'cancelled'),
    },
  }),
  adminAppointmentsController.index,
);

// Get dashboard statistics
adminAppointmentsRouter.get(
  '/stats',
  adminAppointmentsController.stats,
);

// Get today's appointments
adminAppointmentsRouter.get(
  '/today',
  adminAppointmentsController.today,
);

// Approve an appointment
adminAppointmentsRouter.patch(
  '/:appointment_id/approve',
  celebrate({
    [Segments.PARAMS]: {
      appointment_id: Joi.string().uuid().required(),
    },
  }),
  adminAppointmentsController.approve,
);

// Reject an appointment
adminAppointmentsRouter.patch(
  '/:appointment_id/reject',
  celebrate({
    [Segments.PARAMS]: {
      appointment_id: Joi.string().uuid().required(),
    },
  }),
  adminAppointmentsController.reject,
);

export default adminAppointmentsRouter;
