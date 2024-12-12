import { Router } from 'express';
import IndexController from '../controllers/index';

const router = Router();
const indexController = new IndexController();

export const setRoutes = () => {
  router.post('/symptoms', indexController.processSymptoms);
  return router;
};