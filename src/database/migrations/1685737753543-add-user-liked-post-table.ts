import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserLikedPostTable1685737753543 implements MigrationInterface {
    name = 'AddUserLikedPostTable1685737753543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts_liked_by_users" ("postsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_a7f505527555864cb65f929b7c0" PRIMARY KEY ("postsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8d8ecf84ee96d0c6e277837327" ON "posts_liked_by_users" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_21fa2b529fdb8c4bea64069dc8" ON "posts_liked_by_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT array['user']`);
        await queryRunner.query(`ALTER TABLE "posts_liked_by_users" ADD CONSTRAINT "FK_8d8ecf84ee96d0c6e277837327e" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_liked_by_users" ADD CONSTRAINT "FK_21fa2b529fdb8c4bea64069dc87" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts_liked_by_users" DROP CONSTRAINT "FK_21fa2b529fdb8c4bea64069dc87"`);
        await queryRunner.query(`ALTER TABLE "posts_liked_by_users" DROP CONSTRAINT "FK_8d8ecf84ee96d0c6e277837327e"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT ARRAY['user'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21fa2b529fdb8c4bea64069dc8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d8ecf84ee96d0c6e277837327"`);
        await queryRunner.query(`DROP TABLE "posts_liked_by_users"`);
    }

}
