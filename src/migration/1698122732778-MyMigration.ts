import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1698122732778 implements MigrationInterface {
    name = 'MyMigration1698122732778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "profile_picture" character varying, "profile_description" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "threads" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "threads" ADD CONSTRAINT "FK_256dd2e4946d6768c5583caa072" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "threads" DROP CONSTRAINT "FK_256dd2e4946d6768c5583caa072"`);
        await queryRunner.query(`ALTER TABLE "threads" DROP COLUMN "userId"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
