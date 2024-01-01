import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const cultures = ["milho", "café"];
  const cultures2 = ["laranja", "alface"]
  const cultures3 = ["tomate"]

  const guilherme = await prisma.ruralProducer.create({
    data: {
      cpf_cnpj: "12345678909",
      producer_name: "Guilherme Bezerra",
      farm_name: "Fazenda Bezerra",
      city: "Uberlândia",
      state: "minas_gerais",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 100,
      planted_crops: {
        create: cultures.map(culture => {
          return {
            name: culture
          };
        })
      }
    }
  });

  const maria = await prisma.ruralProducer.create({
    data: {
      cpf_cnpj: "98765432101",
      producer_name: "Maria Santos",
      farm_name: "Fazenda Santos",
      city: "Campinas",
      state: "sao_paulo",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 100,
      planted_crops: {
        create: cultures2.map(culture => {
          return {
            name: culture
          };
        })
      }
    }
  });

  const joao = await prisma.ruralProducer.create({
    data: {
      cpf_cnpj: "55566677788",
      producer_name: "João Silva",
      farm_name: "Fazenda Silva",
      city: "São Paulo",
      state: "sao_paulo",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 100,
      planted_crops: {
        create: cultures2.map(culture => {
          return {
            name: culture
          };
        })
      }
    }
  });

  const sofia = await prisma.ruralProducer.create({
    data: {
      cpf_cnpj: "98765432000121",
      producer_name: "Sofia Oliveira",
      farm_name: "Fazenda Oliveira",
      city: "São Paulo",
      state: "sao_paulo",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 100,
      planted_crops: {
        create: cultures3.map(culture => {
          return {
            name: culture
          };
        })
      }
    }
  });

  const lucas = await prisma.ruralProducer.create({
    data: {
      cpf_cnpj: "12345678000190",
      producer_name: "Lucas Santos",
      farm_name: "Fazenda Santos",
      city: "São Paulo",
      state: "sao_paulo",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 100,
      planted_crops: {
        create: cultures3.map(culture => {
          return {
            name: culture
          };
        })
      }
    }
  });

  // console.log('[seeds]: \n', { guilherme, maria, joao, sofia, lucas });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
