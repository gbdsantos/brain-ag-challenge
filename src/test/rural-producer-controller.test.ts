import { execSync } from 'node:child_process';

import request from "supertest";
import { beforeEach, describe, expect ,it} from "vitest";

import { app } from "../app"

describe("Rural producer routes", () => {
  beforeEach(() => {
    execSync('npx prisma migrate reset -f')
  })

  it("Should be able to create a new rural producer", async () => {
    await request(app).post('/create').send({
      cpf_cnpj: "93191298002",
      producer_name: "Marcos Oliveira",
      farm_name: "Fazenda Oliveira",
      city: "Salvador",
      state: "bahia",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 100,
      planted_crops: ["banana", "laranja"]
    })
    .expect(201);
  });

  it("Should be able to list all rural producers", async () => {
    await request(app)
    .post('/create')
    .send({
      cpf_cnpj: "93191298002",
      producer_name: "Marcos Oliveira",
      farm_name: "Fazenda Oliveira",
      city: "Salvador",
      state: "bahia",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 100,
      planted_crops: ["banana", "laranja"]
    })
    .expect(201);

    const ruralProducersResponse = await request(app)
    .get('/index')
    .expect(200);

    expect(ruralProducersResponse.body).toEqual([
      expect.objectContaining({
        cpf_cnpj: "93191298002",
        producer_name: "Marcos Oliveira",
        farm_name: "Fazenda Oliveira",
        city: "Salvador",
        state: "bahia",
        agricultural_area_hectares: 50,
        vegetation_area_hectares: 50,
        total_area_hectares: 100,
        planted_crops: [
          { "name": "banana" },
          { "name": "laranja" }
        ]
      })
    ])
  });

  it("Should be able to update a rural producer", async () => {
    await request(app).post('/create')
    .send({
      cpf_cnpj: "93191298002",
      producer_name: "Marcos Oliveira",
      farm_name: "Fazenda Oliveira",
      city: "Salvador",
      state: "bahia",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 100,
      planted_crops: ["banana", "laranja"]
    })
    .expect(201);

    const ruralProducersResponse = await request(app)
    .get('/index')
    .expect(200);

    const ruralProducerId = ruralProducersResponse.body[0].id;

    const updatedRuralProducer = await request(app)
    .patch(`/update/${ruralProducerId}`)
    .send({
      cpf_cnpj: "41750330091",
      producer_name: "João Medeiros",
      farm_name: "Fazenda Medeiros",
      city: "Campinas",
      state: "sao_paulo",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 100,
      planted_crops: ["banana", "laranja"]
    })

    expect(updatedRuralProducer.body).toEqual(
      expect.objectContaining({
        cpf_cnpj: "41750330091",
        producer_name: "João Medeiros",
        farm_name: "Fazenda Medeiros",
        city: "Campinas",
        state: "sao_paulo",
        agricultural_area_hectares: 50,
        vegetation_area_hectares: 50,
        total_area_hectares: 100,
        planted_crops: [
          { "name": "banana" },
          { "name": "laranja" }
        ]
      })
    )
  });

  it("Should be able to delete a rural producer", async () => {
    await request(app).post('/create').send({
      cpf_cnpj: "93191298002",
      producer_name: "Marcos Oliveira",
      farm_name: "Fazenda Oliveira",
      city: "Salvador",
      state: "bahia",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 100,
      planted_crops: ["banana", "laranja"]
    })
    .expect(201);

    const ruralProducersResponse = await request(app)
    .get('/index')
    .expect(200);

    const ruralProducerCpfCnpj = ruralProducersResponse.body[0].cpf_cnpj;

    await request(app)
    .delete(`/delete/${ruralProducerCpfCnpj}`)
    .expect(204);
  });
});
