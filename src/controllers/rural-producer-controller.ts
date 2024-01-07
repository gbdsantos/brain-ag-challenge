import { Request, Response } from 'express';
import { prisma } from '../database/prisma';

import { z } from "zod";
import { validateCPFCNPJ } from '../utils/validate-cpf-cnpj';

class RuralProducerController {
  public async create(request: Request, response: Response) {
    try {
      const cnpjCpfRegex = RegExp("^(\\d{3})\\.?(\\d{3})\\.?(\\d{3})\\-?(\\d{2}$)$|^(\\d{2})\\.?(\\d{3})\\.?(\\d{3})\\/?([0-1]{4})\\-?(\\d{2})$");

      const ruralProducerBodySchema = z.object({
        cpf_cnpj: z.string({
          required_error: "CNPJ/CPF field is required.",
          invalid_type_error: "CNPJ/CPF field must be a string."
        }).regex(cnpjCpfRegex, { message: "CNPJ/CPF format is invalid."}),
        producer_name: z.string({
          required_error: "Producer name field is required.",
          invalid_type_error: "Producer name field must be a string."
        }),
        farm_name: z.string({
          required_error: "Farm name field is required.",
          invalid_type_error: "Farm name field must be a string."
        }),
        city: z.string({
          required_error: "City field is required.",
          invalid_type_error: "City field must be a string."
        }),
        state: z.string({
          required_error: "State field is required.",
          invalid_type_error: "State field must be a string."
        }),
        agricultural_area_hectares: z.number({
          required_error: "Agricultural area (hectares) field is required.",
          invalid_type_error: "Agricultural area (hectares) field must be a number."
        }),
        vegetation_area_hectares: z.number({
          required_error: "Vegetation area (hectares) field is required.",
          invalid_type_error: "Vegetation area (hectares) field must be a number."
        }),
        total_area_hectares: z.number({
          required_error: "Total area (hectares) field is required.",
          invalid_type_error: "Total area (hectares) field must be a number."
        }),
        planted_crops: z.array(z.string({
            required_error: "Planted crop field is required.",
            invalid_type_error: "Each planted crop element must be a string."
          }
        ).toLowerCase())})
        .required();

      const validationResult = ruralProducerBodySchema.safeParse(request.body);

      if (!validationResult.success) {
        const getErrorMessages = validationResult.error.errors;
        const errorMessages = [] as any;

        getErrorMessages.forEach(item => {
          item.message
          errorMessages.push(item.message)
        });

        return response.status(400).json({
          messages: errorMessages,
          status: "error",
          status_code: 400
        });
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

      const cleanCPF_CNPJ = cpf_cnpj.replace(/[^\d]+/g, '');
      const cnpjOrCpfIsValid = validateCPFCNPJ(cpf_cnpj);

      if (!cnpjOrCpfIsValid) {
        return response.status(400).json({
          message: "CNPJ/CPF number must be valid.",
          status: "error",
          status_code: 400
        });
      }

      const sumHectaresArea = agricultural_area_hectares + vegetation_area_hectares;

      if (sumHectaresArea > total_area_hectares) {
        return response.status(400).json({
          message: "The sum of arable area and vegetation must not be greater than the total area of the farm.",
          status: "error",
          status_code: 400
        });
      }

      const plantedCropsToLowerCase: string[] =  planted_crops.map((item: string) => {
        return item.toLowerCase();
      });

      const hasRuralProducer = await prisma.ruralProducer.findUnique({
        where: {
          cpf_cnpj: cleanCPF_CNPJ
        }
      });

      if (hasRuralProducer) {
        return response.status(409).json({
          message: "Rural producer already exists.",
          status: "error",
          status_code: 409
        });
      }

      const ruralProducer = await prisma.ruralProducer.create({
        data: {
          cpf_cnpj: cleanCPF_CNPJ,
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
          planted_crops: {
            select: {
              name: true
            }
          },
        }
      });

      return response.status(201).json(ruralProducer);
    } catch (error) {
      return response.status(500).json({
        message: "Internal Server Error.",
        status: "error",
        status_code: 500
      });
    }
  }

  public async index(_: Request, response: Response) {
    try {
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
    } catch (error) {
      return response.status(500).json({
        message: "Internal Server Error.",
        status: "error",
        status_code: 500
      });
    }
  }

  public async update(request: Request, response: Response) {
    try {
      const cnpjCpfRegex = RegExp("^(\\d{3})\\.?(\\d{3})\\.?(\\d{3})\\-?(\\d{2}$)$|^(\\d{2})\\.?(\\d{3})\\.?(\\d{3})\\/?([0-1]{4})\\-?(\\d{2})$");

      const ruralProducerBodySchema = z.object({
        cpf_cnpj: z.string({
          required_error: "CNPJ/CPF field is required.",
          invalid_type_error: "CNPJ/CPF field must be a string."
        }).regex(cnpjCpfRegex, { message: "CNPJ/CPF format is invalid."}),
        producer_name: z.string({
          required_error: "Producer name field is required.",
          invalid_type_error: "Producer name field must be a string."
        }),
        farm_name: z.string({
          required_error: "Farm name field is required.",
          invalid_type_error: "Farm name field must be a string."
        }),
        city: z.string({
          required_error: "City field is required.",
          invalid_type_error: "City field must be a string."
        }),
        state: z.string({
          required_error: "State field is required.",
          invalid_type_error: "State field must be a string."
        }),
        agricultural_area_hectares: z.number({
          required_error: "Agricultural area (hectares) field is required.",
          invalid_type_error: "Agricultural area (hectares) field must be a number."
        }),
        vegetation_area_hectares: z.number({
          required_error: "Vegetation area (hectares) field is required.",
          invalid_type_error: "Vegetation area (hectares) field must be a number."
        }),
        total_area_hectares: z.number({
          required_error: "Total area (hectares) field is required.",
          invalid_type_error: "Total area (hectares) field must be a number."
        }),
        planted_crops: z.array(z.string({
            required_error: "Planted crop field is required.",
            invalid_type_error: "Each planted crop element must be a string."
          }
        ).toLowerCase())})
        .required();

      const validationResult = ruralProducerBodySchema.safeParse(request.body);

      if (!validationResult.success) {
        const getErrorMessages = validationResult.error.errors;
        const errorMessages = [] as any;

        getErrorMessages.forEach(item => {
          item.message
          errorMessages.push(item.message)
        });

        return response.status(400).json({
          messages: errorMessages,
          status: "error",
          status_code: 400
        });
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

      const cleanCPF_CNPJ = cpf_cnpj.replace(/[^\d]+/g, '');
      const cnpjOrCpfIsValid = validateCPFCNPJ(cpf_cnpj);

      if (!cnpjOrCpfIsValid) {
        return response.status(400).json({
          message: "CNPJ/CPF number must be valid.",
          status: "error",
          status_code: 400
        });
      }

      const sumHectaresArea = agricultural_area_hectares + vegetation_area_hectares;

      if (sumHectaresArea > total_area_hectares) {
        return response.status(400).json({
          message: "The sum of arable area and vegetation must not be greater than the total area of the farm.",
          status: "error",
          status_code: 400
        });
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
            cpf_cnpj: cleanCPF_CNPJ,
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
          },
          include: {
            planted_crops: {
              select: {
                name: true,
              }
            }
          }
        });

        return response.status(200).json(updatedRuralProducer);
      } else {
        return response.status(404).json({
          message: "Rural producer not found.",
          status: "error",
          status_code: 404
        });
      }
    } catch (error) {
      return response.status(500).json({
        message: "Internal Server Error.",
        status: "error",
        status_code: 500
      });
    }
  }

  public async delete(request: Request, response: Response) {
    try {
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
        return response.status(404).json({
          message: "Rural producer not found.",
          status: "error",
          status_code: 404
        });
      }
    } catch (error) {
      return response.status(500).json({
        message: "Internal Server Error.",
        status: "error",
        status_code: 500
      });
    }
  }
}

export default new RuralProducerController();
