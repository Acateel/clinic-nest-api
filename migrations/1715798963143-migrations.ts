import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1715798963143 implements MigrationInterface {
    name = 'Migrations1715798963143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE VIEW "doctor_appointments_summary" AS
            SELECT ROW_NUMBER() OVER(PARTITION BY 1)::integer as "summaryId",
                "doctor"."id" as "doctorId",
                doctor."firstName" || ' ' || doctor."lastName" as "fullName",
                ARRAY_AGG(distinct departament."departamentId") as "departamentIds",
                (
                    COUNT(*) / ARRAY_LENGTH(
                        ARRAY_AGG(distinct departament."departamentId"),
                        1
                    )
                )::integer as "appointmentCount",
                EXTRACT (
                    week
                    FROM appointment."startTime"
                )::integer as "weekNumber",
                MIN(appointment."startTime") as "weekMinDate"
            FROM "doctor" "doctor"
                INNER JOIN "departament_doctors_doctor" "departament" ON departament."doctorId" = "doctor"."id"
                INNER JOIN "appointment" "appointment" ON appointment."doctorId" = "doctor"."id"
            GROUP BY "doctor"."id",
                "weekNumber"
            ORDER BY "weekNumber" ASC
        `);
        await queryRunner.query(`
            INSERT INTO "typeorm_metadata"(
                    "database",
                    "schema",
                    "table",
                    "type",
                    "name",
                    "value"
                )
            VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)
        `, ["public","VIEW","doctor_appointments_summary","SELECT ROW_NUMBER() OVER(PARTITION BY 1)::integer as \"summaryId\", \"doctor\".\"id\" as \"doctorId\", doctor.\"firstName\" || ' ' || doctor.\"lastName\" as \"fullName\", ARRAY_AGG(distinct departament.\"departamentId\") as \"departamentIds\", (COUNT(*) / ARRAY_LENGTH(ARRAY_AGG(distinct departament.\"departamentId\"),1))::integer as \"appointmentCount\", EXTRACT (week FROM appointment.\"startTime\")::integer as \"weekNumber\", MIN(appointment.\"startTime\") as \"weekMinDate\" FROM \"doctor\" \"doctor\" INNER JOIN \"departament_doctors_doctor\" \"departament\" ON departament.\"doctorId\" = \"doctor\".\"id\"  INNER JOIN \"appointment\" \"appointment\" ON appointment.\"doctorId\" = \"doctor\".\"id\" GROUP BY \"doctor\".\"id\", \"weekNumber\" ORDER BY \"weekNumber\" ASC"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "typeorm_metadata"
            WHERE "type" = $1
                AND "name" = $2
                AND "schema" = $3
        `, ["VIEW","doctor_appointments_summary","public"]);
        await queryRunner.query(`
            DROP VIEW "doctor_appointments_summary"
        `);
    }

}
