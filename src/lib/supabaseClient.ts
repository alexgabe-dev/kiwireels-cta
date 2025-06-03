import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://efgharfzrmpfzlxavauu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZ2hhcmZ6cm1wZnpseGF2YXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDIyMDMsImV4cCI6MjA2NDUxODIwM30.V9ZeyrtyPcQ-bcfmLYmRygtK3Wb0IbzkowtTHkq48cQ';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 