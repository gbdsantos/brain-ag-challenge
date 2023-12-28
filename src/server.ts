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

app.patch('/update/:id', async (request, response) => {
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

  const { id } = request.params;

  let ruralProducer = await prisma.ruralProducer.findUnique({
    where: {
      id
    }
  });

  if (ruralProducer) {
    const updatedRuralProducer = await prisma.ruralProducer.update({
      where: {
        id: id
      },
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

    return response.status(200).json(updatedRuralProducer);
  } else {
    return response.status(404).json({ message: "Rural producer not found."});
  }
});

app.delete('/delete/:cpf_cnpj', async (request, response) => {
  const { cpf_cnpj } = request.params;

  let ruralProducer = await prisma.ruralProducer.findUnique({
    where: {
      cpf_cnpj
    }
  });

  if (ruralProducer) {
    await prisma.ruralProducer.delete({
      where: {
        cpf_cnpj
      }
    });

    return response.status(204).send();
  } else {
    return response.status(404).json({ message: "Rural producer not found."});
  }
});

app.listen(3333, () => {
  console.log('🚀 HTTP Server Running!');
});
