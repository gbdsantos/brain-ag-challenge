import { Request, Response } from 'express';
import { prisma } from '../database/prisma';

class DashboardController {
  async index(_: Request, response: Response) {
    const countedFarm = await prisma.ruralProducer.count();

    const allRuralProducers = await prisma.ruralProducer.findMany({
      select: {
        agricultural_area_hectares: true,
        vegetation_area_hectares: true,
        total_area_hectares: true
      }
    });

    const totalAreaHectares = allRuralProducers.reduce((total, item) =>
      total + item.total_area_hectares, 0
    );

    const totalAgriculturalAreaHectares = allRuralProducers.reduce((total, item) =>
      total + item.agricultural_area_hectares, 0
    );

    const totalVegetationAreaHectares = allRuralProducers.reduce((total, item) =>
      total + item.vegetation_area_hectares, 0
    );

    const groupByState = await prisma.ruralProducer.groupBy({
      by: ['state'],
      _count: {
        state: true,
      },
    });

    const formattedByState = groupByState.map(item => {
      return {
        state_name: item.state,
        quantity: item._count.state
      }
    });

    const groupByPlantedCrops = await prisma.plantedCrop.groupBy({
      by: ['name'],
      _count: {
        name: true,
      },
    });

    const formattedByPlantedCrops = groupByPlantedCrops.map(item => {
      return {
        planted_crop_name: item.name,
        quantity: item._count.name
      }
    });

    const totals = {
      "farms": countedFarm,
      "area_hectares": totalAreaHectares,
      "agricultural_area": totalAgriculturalAreaHectares,
      "vegetation_area": totalVegetationAreaHectares,
      "by_state": formattedByState,
      "by_planted_crop": formattedByPlantedCrops
    }

    return response.status(200).json({ totals });
  }
}

export default new DashboardController();
