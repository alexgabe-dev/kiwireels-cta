-- Create a table for carousel images
CREATE TABLE "public"."carousel_images" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    src text NOT NULL,
    alt text,
    sort_order integer,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION "public"."set_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "update_carousel_images_updated_at"
BEFORE UPDATE ON "public"."carousel_images"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_updated_at"();

-- Enable Row Level Security (RLS)
ALTER TABLE "public"."carousel_images" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access
CREATE POLICY "Allow public read access" ON "public"."carousel_images" FOR SELECT USING (true);

-- Allow authenticated insert/update/delete access
CREATE POLICY "Allow authenticated write access" ON "public"."carousel_images" FOR ALL USING (auth.role() = 'authenticated');

-- Optional: Insert initial data if needed, but for admin management, we'll leave it empty initially. 