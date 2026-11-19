-- Ensure default city exists so legacy users with NULL city_id can be backfilled
INSERT INTO "cities" ("id", "name", "state")
VALUES (gen_random_uuid(), 'Guarapuava', 'Paraná')
ON CONFLICT ("name", "state") DO NOTHING;

-- Backfill users that have no city assigned yet
UPDATE "users"
SET "city_id" = (
    SELECT "id" FROM "cities" WHERE "name" = 'Guarapuava' AND "state" = 'Paraná'
)
WHERE "city_id" IS NULL;

-- Replace the old SetNull FK with a Restrict FK and make the column NOT NULL
ALTER TABLE "users" DROP CONSTRAINT "users_city_id_fkey";

ALTER TABLE "users" ALTER COLUMN "city_id" SET NOT NULL;

ALTER TABLE "users" ADD CONSTRAINT "users_city_id_fkey"
    FOREIGN KEY ("city_id") REFERENCES "cities"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Index to support listing freights by client ordered by recency
CREATE INDEX "freights_client_id_created_at_idx"
    ON "freights" ("client_id", "created_at" DESC);
