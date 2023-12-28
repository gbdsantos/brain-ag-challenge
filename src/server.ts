import express from 'express';
import { prisma } from './database/prisma';

const app = express();

app.use(express.json());

app.get('/ping',  (request, response) => {
  return response.status(200).send('Server is running.');
});

app.post('/create', async (request, response) => {
  const {
    cpf_cnpj,
    producer_name,
    farm_name,
    city,
    state,
    agricultural_area_hectares,
    vegetation_area_hectares,
    total_area_hectares,
    planted_crops
  } = request.body;

  const ruralProducer = await prisma.ruralProducer.create({
    data: {
      cpf_cnpj,
      producer_name,
      farm_name,
      city,
      state,
      agricultural_area_hectares,
      vegetation_area_hectares,
      total_area_hectares,
      planted_crops
    }
  });

  return response.status(201).json(ruralProducer);

});

app.listen(3333, () => {
  console.log('🚀 HTTP Server Running!');
});
