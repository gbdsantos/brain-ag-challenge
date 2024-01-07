import { execSync } from 'node:child_process';

import request from "supertest";
import { beforeEach, describe, expect ,it} from "vitest";

import { app } from "../app"

describe("Rural producer routes", () => {
  beforeEach(() => {
    execSync('npx prisma migrate reset -f');
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

  it("Should not be able register rural producer if sum of arable area and vegetation be greater than the total area of the farm", async() => {
    await request(app).post('/create').send({
      cpf_cnpj: "93191298002",
      producer_name: "Marcos Oliveira",
      farm_name: "Fazenda Oliveira",
      city: "Salvador",
      state: "bahia",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 50,
      planted_crops: ["banana", "laranja"]
    })
    .expect(400);
  });

  it("Should not be able register rural producer if CPF or CNPJ be not valid", async () => {
    await request(app).post('/create').send({
      cpf_cnpj: "11111111111",
      producer_name: "Marcos Oliveira",
      farm_name: "Fazenda Oliveira",
      city: "Salvador",
      state: "bahia",
      agricultural_area_hectares: 50,
      vegetation_area_hectares: 50,
      total_area_hectares: 50,
      planted_crops: ["banana", "laranja"]
    })
    .expect(400);
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

describe("Dashboard routes", () => {
  beforeEach(() => {
    execSync('npx prisma migrate reset -f');
  });

  it("Should be able to list a total: number of farms, by state and planted crops", async () => {
    const totals = await request(app)
      .get('/totals')
      .expect(200);

    expect(totals.body).toEqual(
      expect.objectContaining({
        totals: {
          farms: 0,
          area_hectares: 0,
          agricultural_area: 0,
          vegetation_area: 0,
          by_state: [],
          by_planted_crop: []
        }
      })
    )
  });
});
