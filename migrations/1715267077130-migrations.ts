import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1715267077130 implements MigrationInterface {
    name = 'Migrations1715267077130'

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
            ALTER TABLE "departament"
            ADD CONSTRAINT "FK_425d774faacaf1382a033621baf" FOREIGN KEY ("parentId") REFERENCES "departament"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "departament" DROP CONSTRAINT "FK_425d774faacaf1382a033621baf"
        `);
        await queryRunner.query(`
            DROP TABLE "departament"
        `);
    }

}
