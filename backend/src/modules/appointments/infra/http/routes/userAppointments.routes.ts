import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UserAppointmentsController from '../controllers/UserAppointmentsController';

const userAppointmentsRouter = Router();
const userAppointmentsController = new UserAppointmentsController();

userAppointmentsRouter.use(ensureAuthenticated);

// List user's appointments
userAppointmentsRouter.get('/', userAppointmentsController.index);

// Cancel user's appointment
userAppointmentsRouter.delete(
  '/:appointment_id',
  celebrate({
    [Segments.PARAMS]: {
      appointment_id: Joi.string().uuid().required(),
    },
  }),
  userAppointmentsController.cancel,
);

export default userAppointmentsRouter;
