import { Request, Response } from 'express';
import { prisma } from '../database/prisma';

import { z } from "zod";
import { validateCPFCNPJ } from '../utils/validate-cpf-cnpj';

class RuralProducerController {
  async create(request: Request, response: Response) {
    const cnpjCpfRegex = RegExp("^(\\d{3})\\.?(\\d{3})\\.?(\\d{3})\\-?(\\d{2}$)$|^(\\d{2})\\.?(\\d{3})\\.?(\\d{3})\\/?([0-1]{4})\\-?(\\d{2})$");

    const ruralProducerBodySchema = z.object({
      cpf_cnpj: z.string({
        required_error: "CNPJ/CPF is required.",
        invalid_type_error: "CNPJ/CPF must be a string."
      }).regex(cnpjCpfRegex, { message: "CNPJ/CPF is invalid."}),
      producer_name: z.string(),
      farm_name: z.string(),
      city: z.string(),
      state: z.string(),
      agricultural_area_hectares: z.number(),
      vegetation_area_hectares: z.number(),
      total_area_hectares: z.number(),
      planted_crops: z.array(z.string().toLowerCase())
    }).required();

    const validationResult = ruralProducerBodySchema.safeParse(request.body);

    if (!validationResult.success) {
      const getErrorMessages = validationResult.error.errors;
      const errorMessages = [] as any;

      getErrorMessages.forEach(item => {
        item.message
        errorMessages.push(item.message)
      });

      return response.status(400).json({ error_messages: errorMessages });
    }

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

    const cnpjOrCpfIsValid = validateCPFCNPJ(cpf_cnpj);

    if (!cnpjOrCpfIsValid) {
      return response.status(400).json({ error: "CNPJ/CPF number must be valid."});
    }

    const sumHectaresArea = agricultural_area_hectares + vegetation_area_hectares;

    if (sumHectaresArea > total_area_hectares) {
      return response.status(400).json({ error: "A soma de área agrícultável e vegetação, não deverá ser maior que a área total da fazenda."});
    }

    const plantedCropsToLowerCase: string[] =  planted_crops.map((item: string) => {
      return item.toLowerCase();
    });

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
        planted_crops: {
          create: plantedCropsToLowerCase.map(planted_crop => {
            return {
              name: planted_crop
            };
          }),
        }
      },
      include: {
        planted_crops: true,
      }
    });

    return response.status(201).json(ruralProducer);
  }

  async index(request: Request, response: Response) {
    const ruralProducers = await prisma.ruralProducer.findMany({
      include: {
        planted_crops: {
          select: {
            name: true,
          }
        },
      },

    });

    return response.status(200).json(ruralProducers);
  }

  async update(request: Request, response: Response) {
    const cnpjCpfRegex = RegExp("^(\\d{3})\\.?(\\d{3})\\.?(\\d{3})\\-?(\\d{2}$)$|^(\\d{2})\\.?(\\d{3})\\.?(\\d{3})\\/?([0-1]{4})\\-?(\\d{2})$");

    const ruralProducerBodySchema = z.object({
      cpf_cnpj: z.string({
        required_error: "CNPJ/CPF is required.",
        invalid_type_error: "CNPJ/CPF must be a string."
      }).regex(cnpjCpfRegex, { message: "CNPJ/CPF is invalid." }),
      producer_name: z.string(),
      farm_name: z.string(),
      city: z.string(),
      state: z.string(),
      agricultural_area_hectares: z.number(),
      vegetation_area_hectares: z.number(),
      total_area_hectares: z.number(),
      planted_crops: z.array(z.string())
    }).required();

    const validationResult = ruralProducerBodySchema.safeParse(request.body);

    if (!validationResult.success) {
      const getErrorMessages = validationResult.error.errors;
      const errorMessages = [] as any;

      getErrorMessages.forEach(item => {
        item.message
        errorMessages.push(item.message)
      });

      return response.status(400).json({ error_messages: errorMessages });
    }

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

    const cnpjOrCpfIsValid = validateCPFCNPJ(cpf_cnpj);

    if (!cnpjOrCpfIsValid) {
      return response.status(400).json({ error: "CNPJ/CPF number must be valid." });
    }

    const sumHectaresArea = agricultural_area_hectares + vegetation_area_hectares;

    if (sumHectaresArea > total_area_hectares) {
      return response.status(400).json({ message: "A soma de área agrícultável e vegetação, não deverá ser maior que a área total da fazenda." });
    }

    const plantedCropsToLowerCase: string[] = planted_crops.map((item: string) => {
      return item.toLowerCase();
    });

    let ruralProducer = await prisma.ruralProducer.findUnique({
      where: {
        id
      }
    });

    if (ruralProducer) {
      await prisma.plantedCrop.deleteMany({
        where: {
          rural_producer_id: id
        }
      });

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
          planted_crops: {
            create: plantedCropsToLowerCase.map((planted_crop: string) => {
              return {
                name: planted_crop
              };
            }),
          }
        }
      });

      return response.status(200).json(updatedRuralProducer);
    } else {
      return response.status(404).json({ message: "Rural producer not found." });
    }
  }

  async delete(request: Request, response: Response) {
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
  }
}

export default new RuralProducerController();
