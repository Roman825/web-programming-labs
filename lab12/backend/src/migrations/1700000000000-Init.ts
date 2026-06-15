import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1700000000000 implements MigrationInterface {
  name = 'Init1700000000000';
  async up(q: QueryRunner) {
    await q.query(`CREATE TABLE "users" ("id" SERIAL PRIMARY KEY, "email" varchar UNIQUE NOT NULL, "password" varchar NOT NULL, "createdAt" TIMESTAMP DEFAULT now())`);
    await q.query(`CREATE TABLE "tasks" ("id" SERIAL PRIMARY KEY, "title" varchar(100) NOT NULL, "description" text, "status" varchar DEFAULT 'pending', "priority" varchar DEFAULT 'medium', "createdAt" TIMESTAMP DEFAULT now())`);
  }
  async down(q: QueryRunner) {
    await q.query(`DROP TABLE "tasks"`);
    await q.query(`DROP TABLE "users"`);
  }
}
