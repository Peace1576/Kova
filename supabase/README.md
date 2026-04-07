# Supabase Migrations

This repo now keeps the SQL schema as a Supabase migration.

## Run it locally

1. Install the Supabase CLI.
2. Log in:
   `supabase login`
3. Link this repo to your project:
   `supabase link --project-ref olsakfvdbrqallpdloaa`
4. Push the migrations:
   `supabase db push`

## Files

- `migrations/20260407_093000_kova_events.sql` creates the Kova event tables.
- `config.toml` holds local CLI defaults for this project.

## Notes

- If you already applied `supabase/schema.sql` manually, the migration is idempotent and safe to run.
- The app mirrors events into `kova_legal_events`, `kova_ai_events`, and `kova_flow_events`.
