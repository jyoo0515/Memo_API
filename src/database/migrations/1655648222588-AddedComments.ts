import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedComments1655648222588 implements MigrationInterface {
    name = 'AddedComments1655648222588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "memoId" integer, "createdById" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "memos" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "memos" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_23be6e4dcf34286cafa8a761902" FOREIGN KEY ("memoId") REFERENCES "memos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_cd31cf1f563a06aeeaab821bd1c" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_cd31cf1f563a06aeeaab821bd1c"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_23be6e4dcf34286cafa8a761902"`);
        await queryRunner.query(`ALTER TABLE "memos" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "memos" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
