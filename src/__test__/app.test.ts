import App from "../app";
import { prisma } from "../config/prisma";
import request from "supertest";

const appTest = new App().app;

describe("Connection Testing API", () => {
  beforeEach(() => {
    // Menyiapkan program/function yang ingin dijalankan
    // sebelum tiap skenario dieksekusi
  });

  beforeAll(async () => {
    // Menyiapkan program yang ingin dijalankan sebelum seluruh skenario dijalankan
    await prisma.$connect();
  });

  afterEach(() => {
    // Menyiapkan program/function yang ingin dijalankan
    // sesudah tiap skenario dieksekusi
  });

  afterAll(async () => {
    // Menyiapkan program yang ingin dijalankan sesudah seluruh skenario dijalankan
    await prisma.$disconnect();
  });

  // Testing scenario
  // GOOD CASE
  it("Should return welcome message from main route", async () => {
    const response = await request(appTest).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toEqual("<h1>CLASSBASE API</h1>");
  });
  // BAD CASE
  it("Should return NOT FOUND PAGE", async () => {
    const response = await request(appTest).get("/transactions");

    expect(response.status).toBe(404);
  });
});
