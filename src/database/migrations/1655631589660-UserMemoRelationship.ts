import { MigrationInterface, QueryRunner } from "typeorm";

export class UserMemoRelationship1655631589660 implements MigrationInterface {
    name = 'UserMemoRelationship1655631589660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memos" ADD "createdById" integer`);
        await queryRunner.query(`ALTER TABLE "memos" ADD CONSTRAINT "FK_ae3f507545e9d0817f1b9302a51" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memos" DROP CONSTRAINT "FK_ae3f507545e9d0817f1b9302a51"`);
        await queryRunner.query(`ALTER TABLE "memos" DROP COLUMN "createdById"`);
    }

}
