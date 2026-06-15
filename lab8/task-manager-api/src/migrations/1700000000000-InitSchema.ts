import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tags" (
        "id" SERIAL NOT NULL,
        "name" character varying(50) NOT NULL,
        CONSTRAINT "UQ_tags_name" UNIQUE ("name"),
        CONSTRAINT "PK_tags" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" SERIAL NOT NULL,
        "title" character varying(100) NOT NULL,
        "description" text,
        "status" character varying NOT NULL DEFAULT 'pending',
        "priority" character varying NOT NULL DEFAULT 'medium',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "task_tags" (
        "tasksId" integer NOT NULL,
        "tagsId" integer NOT NULL,
        CONSTRAINT "PK_task_tags" PRIMARY KEY ("tasksId", "tagsId")
      )
    `);
    await queryRunner.query(`ALTER TABLE "task_tags" ADD CONSTRAINT "FK_task_tags_task" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "task_tags" ADD CONSTRAINT "FK_task_tags_tag" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_tags" DROP CONSTRAINT "FK_task_tags_tag"`);
    await queryRunner.query(`ALTER TABLE "task_tags" DROP CONSTRAINT "FK_task_tags_task"`);
    await queryRunner.query(`DROP TABLE "task_tags"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}