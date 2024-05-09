import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1715272473709 implements MigrationInterface {
    name = 'Migrations1715272473709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "departament_doctors_doctor" (
                "departamentId" integer NOT NULL,
                "doctorId" integer NOT NULL,
                CONSTRAINT "PK_12a45cfe1f2dbb1ad585122837a" PRIMARY KEY ("departamentId", "doctorId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ca8d87178dae625dcd9c26d51f" ON "departament_doctors_doctor" ("departamentId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_51ff2bb2a9ea4cb3948b91a480" ON "departament_doctors_doctor" ("doctorId")
        `);
        await queryRunner.query(`
            ALTER TABLE "departament_doctors_doctor"
            ADD CONSTRAINT "FK_ca8d87178dae625dcd9c26d51f1" FOREIGN KEY ("departamentId") REFERENCES "departament"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "departament_doctors_doctor"
            ADD CONSTRAINT "FK_51ff2bb2a9ea4cb3948b91a4806" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "departament_doctors_doctor" DROP CONSTRAINT "FK_51ff2bb2a9ea4cb3948b91a4806"
        `);
        await queryRunner.query(`
            ALTER TABLE "departament_doctors_doctor" DROP CONSTRAINT "FK_ca8d87178dae625dcd9c26d51f1"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_51ff2bb2a9ea4cb3948b91a480"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ca8d87178dae625dcd9c26d51f"
        `);
        await queryRunner.query(`
            DROP TABLE "departament_doctors_doctor"
        `);
    }

}
