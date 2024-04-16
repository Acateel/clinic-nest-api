import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1713294673299 implements MigrationInterface {
    name = 'Migrations1713294673299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "doctor_schedule" (
                "id" SERIAL NOT NULL,
                "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
                "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "doctorId" integer,
                CONSTRAINT "PK_d62f5f6abeb14328ea2ad19a54a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "doctor" (
                "id" SERIAL NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "specialty" character varying NOT NULL DEFAULT 'general',
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ee6bf6c8de78803212c548fcb94" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "patient" (
                "id" SERIAL NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "phoneNumber" character varying(15),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_b0a6674ba522877c04e98ff9e33" UNIQUE ("phoneNumber"),
                CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "appointment" (
                "id" SERIAL NOT NULL,
                "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
                "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "patientId" integer,
                "doctorId" integer,
                CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('doctor', 'patient', 'admin')
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "email" character varying,
                "phoneNumber" character varying(15),
                "password" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'patient',
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "authcode" (
                "id" SERIAL NOT NULL,
                "code" character varying NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "userId" integer,
                CONSTRAINT "PK_6899b85c69eb68d8938e8a417e6" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor_schedule"
            ADD CONSTRAINT "FK_d3dff35a2653acdd68e9db631e7" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "appointment"
            ADD CONSTRAINT "FK_5ce4c3130796367c93cd817948e" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "appointment"
            ADD CONSTRAINT "FK_514bcc3fb1b8140f85bf1cde6e2" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "authcode"
            ADD CONSTRAINT "FK_f2e1af51989de3410efea56a6e1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "authcode" DROP CONSTRAINT "FK_f2e1af51989de3410efea56a6e1"
        `);
        await queryRunner.query(`
            ALTER TABLE "appointment" DROP CONSTRAINT "FK_514bcc3fb1b8140f85bf1cde6e2"
        `);
        await queryRunner.query(`
            ALTER TABLE "appointment" DROP CONSTRAINT "FK_5ce4c3130796367c93cd817948e"
        `);
        await queryRunner.query(`
            ALTER TABLE "doctor_schedule" DROP CONSTRAINT "FK_d3dff35a2653acdd68e9db631e7"
        `);
        await queryRunner.query(`
            DROP TABLE "authcode"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "appointment"
        `);
        await queryRunner.query(`
            DROP TABLE "patient"
        `);
        await queryRunner.query(`
            DROP TABLE "doctor"
        `);
        await queryRunner.query(`
            DROP TABLE "doctor_schedule"
        `);
    }

}
