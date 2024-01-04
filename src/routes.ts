import express from 'express';

import RuralProducerController from './controllers/rural-producer-controller';
import DashboardController from './controllers/dashboard-controller';

const routes = express.Router();

routes.get('/ping',  (_, response) => {
  return response.status(200).json({ message: 'Server is running.' });
});

routes.post('/create', RuralProducerController.create);
routes.get('/index', RuralProducerController.index);
routes.patch('/update/:id', RuralProducerController.update);
routes.delete('/delete/:cpf_cnpj', RuralProducerController.delete);

routes.get('/totals', DashboardController.index);

export default routes;
