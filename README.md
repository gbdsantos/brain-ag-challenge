<div align="center">
  <h1 align="center">
  Brain Agriculture
  </h1>
</div>

<p align="center">
  <a href="https://github.com/gbdsantos/brain-ag-challenge/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/gbdsantos/brain-ag-challenge.svg">
  </a>

  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/gbdsantos/brain-ag-challenge.svg">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/gbdsantos/brain-ag-challenge.svg">

  <img src="https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white" alt="Node.js logo" />

  <img src="https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white" alt="Prisma logo" />

  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-&logo=postgresql&logoColor=white" alt="CSS logo" />

  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript logo" />
</p>

## 🚀 Getting Started

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Brain%20Agriculture&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fgbdsantos%2Fbrain-ag-challenge%2Fmaster%2Finsomnia-collection.json)


```bash
# Install dependencies
npm install

# Create a new Docker environment
docker compose up -d

# Run Prisma migrations [OPTIONAL]
npx prisma migrate dev

# Run seeds
npm run seed

# Run tests [OPTIONAL]
npm test
```

## 💡 About

This test aims to assess the candidate's skills in some problem-solving related the programming logic, business rules and object-oriented.

In summary, it involves registering rural producers with the following data:

1. CPF or CNPJ
2. Producer name
3. Farm Name
4. City
5. State
6. Total area of the farm in hectares
7. Arable area in hectares
8. Vegetation area in hectares
9. Planted crops (Soybeans, Corn, Cotton, Coffee, Sugarcane)


## Business requirements

- [x] The user must be able to register, edit, and exclude rural producers.
- [x] The system must validate incorrectly entered CPF and CNPJ  .
- [x] The sum of arable area and vegetation must not exceed the total farm area
- [x] Each producer can cultivate more than one crop on their Farm.
- [x] The platform must include a Dashboard that shows:
- [x] Total number of farms
- [x] Total farms in hectares (total area)
  - [x] Pie chart by state.
  - [x] Pie chart by crop type.
  - [x] Pie chart by land use (Agricultural area and vegetation)

## Technical requirements

- [x] Save the data in a Postgres database using Node.js as a backend layer, and deliver the endpoints to **register**, **edit**, and **delete rural producers**, in addition to the endpoint that returns the **totals to the dashboard**.
- [x] The creation of "mocked" data structures is part of the evaluation.

## Extra mile

- [x] Implements automated tests (unit tests)
- [x] Accept CPF or CNJP masked

---
Made with ❤️ by 🧑‍🚀 Guilherme Bezerra 👋 [Get in touch!](https://www.linkedin.com/in/gbdsantos/)
