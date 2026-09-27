-- Drop FK from freights -> applications
ALTER TABLE "freights" DROP CONSTRAINT IF EXISTS "freights_selected_application_id_fkey";

-- Drop unique index on freights.selected_application_id
DROP INDEX IF EXISTS "freights_selected_application_id_key";

-- Drop column selected_application_id
ALTER TABLE "freights" DROP COLUMN IF EXISTS "selected_application_id";

-- Drop applications table (cascades drop FKs and indexes)
DROP TABLE IF EXISTS "applications";

-- Drop enum
DROP TYPE IF EXISTS "ApplicationStatus";
