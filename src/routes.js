import express from 'express';
import subjectsController from './controllers/subjectsController.js';
import usersController from './controllers/userController.js';
import coursesController from './controllers/coursesController.js';
import locationController from './controllers/locationController.js';
import localTypeController from './controllers/localTypeController.js'
import buildingsController from './controllers/buildingsController.js'
import fileController from './controllers/fileController.js'
import classController from './controllers/classInfoController.js'
import periodsController from './controllers/periodsController.js'
import routingController from './controllers/routingController.js'

const routes = express();

routes.use('/subjects', subjectsController);
routes.use('/users', usersController);
routes.use('/courses', coursesController);
routes.use('/locations', locationController);
routes.use('/local-type', localTypeController);
routes.use('/buildings', buildingsController);
routes.use('/files', fileController);
routes.use('/classes', classController);
routes.use('/periods', periodsController);
routes.use('/routing', routingController);

export default routes;