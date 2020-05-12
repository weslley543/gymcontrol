import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import authmiddleware from './middlewares/authmiddleware';

const routes = new Router();

routes.post('/session', SessionController.index);

routes.use(authmiddleware);

routes.post('/students', StudentsController.store);
routes.get('/students', StudentsController.index);
routes.get('/students/:id', StudentsController.show);
routes.put('/students/:id', StudentsController.update);
routes.delete('/students/:id', StudentsController.destroy);

export default routes;
