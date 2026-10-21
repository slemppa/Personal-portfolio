import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."posts" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "payload"."posts" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "payload"."_posts_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "payload"."_posts_v" ADD COLUMN "version_meta_description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."posts" DROP COLUMN "meta_title";
  ALTER TABLE "payload"."posts" DROP COLUMN "meta_description";
  ALTER TABLE "payload"."_posts_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "payload"."_posts_v" DROP COLUMN "version_meta_description";`)
}
