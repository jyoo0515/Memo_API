import { MigrationInterface, QueryRunner } from "typeorm";

export class Constraints1655635185343 implements MigrationInterface {
    name = 'Constraints1655635185343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memos" DROP CONSTRAINT "FK_ae3f507545e9d0817f1b9302a51"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character(60) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "memos" ADD CONSTRAINT "FK_ae3f507545e9d0817f1b9302a51" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memos" DROP CONSTRAINT "FK_ae3f507545e9d0817f1b9302a51"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "memos" ADD CONSTRAINT "FK_ae3f507545e9d0817f1b9302a51" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
