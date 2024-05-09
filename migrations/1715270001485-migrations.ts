import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1715270001485 implements MigrationInterface {
    name = 'Migrations1715270001485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "departament" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "parentId" integer,
                CONSTRAINT "PK_421574e32347465bd3d720c55cf" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "departament_closure" (
                "id_ancestor" integer NOT NULL,
                "id_descendant" integer NOT NULL,
                CONSTRAINT "PK_b146e922c821fcad1dbd88ca3a6" PRIMARY KEY ("id_ancestor", "id_descendant")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_c193a01a7fcad8dbd792bebb31" ON "departament_closure" ("id_ancestor")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_298c69f564ff3fd50d3102a7f6" ON "departament_closure" ("id_descendant")
        `);
        await queryRunner.query(`
            ALTER TABLE "departament"
            ADD CONSTRAINT "FK_425d774faacaf1382a033621baf" FOREIGN KEY ("parentId") REFERENCES "departament"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "departament_closure"
            ADD CONSTRAINT "FK_c193a01a7fcad8dbd792bebb314" FOREIGN KEY ("id_ancestor") REFERENCES "departament"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "departament_closure"
            ADD CONSTRAINT "FK_298c69f564ff3fd50d3102a7f60" FOREIGN KEY ("id_descendant") REFERENCES "departament"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "departament_closure" DROP CONSTRAINT "FK_298c69f564ff3fd50d3102a7f60"
        `);
        await queryRunner.query(`
            ALTER TABLE "departament_closure" DROP CONSTRAINT "FK_c193a01a7fcad8dbd792bebb314"
        `);
        await queryRunner.query(`
            ALTER TABLE "departament" DROP CONSTRAINT "FK_425d774faacaf1382a033621baf"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_298c69f564ff3fd50d3102a7f6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_c193a01a7fcad8dbd792bebb31"
        `);
        await queryRunner.query(`
            DROP TABLE "departament_closure"
        `);
        await queryRunner.query(`
            DROP TABLE "departament"
        `);
    }

}
