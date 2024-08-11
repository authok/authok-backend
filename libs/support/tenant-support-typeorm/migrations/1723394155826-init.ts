import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1723394155826 implements MigrationInterface {
    name = 'Init1723394155826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dbconnections" ("id" character varying(48) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" character varying NOT NULL, "database" character varying NOT NULL, "host" character varying NOT NULL, "port" integer NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "synchronize" boolean NOT NULL DEFAULT true, "timezone" character varying DEFAULT 'Z', "logging" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0bc5369cf39a5d5c6c7fe874144" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenants" ("id" character varying(48) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "change_password" text, "device_flow" text, "guardian_mfa_page" text, "default_audience" text, "default_connection" text, "error_page" text, "picture" text, "support_email" text, "support_url" text, "allowed_logout_urls" text, "session_lifetime" integer, "idle_session_lifetime" integer, "sandbox_version" character varying, "default_redirection_uri" character varying, "enabled_locales" text, "session_cookie" text, "name" character varying(32) NOT NULL, "display_name" character varying(32), "region" character varying(8) NOT NULL, "environment" character varying, "description" text, "metadata" text, "flags" text, "jwt_configuration" text NOT NULL, "config" text, CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name"), CONSTRAINT "UQ_57fd3da2e1242d9257ffae923c8" UNIQUE ("display_name"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP TABLE "dbconnections"`);
    }

}
