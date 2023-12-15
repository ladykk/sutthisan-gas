import { createClient } from "@supabase/supabase-js";

export const NEXT_PUBLIC_SUPABASE_URL =
  "https://grjhfphydwzaaaknttny.supabase.co";
export const NEXT_PUBLIC_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyamhmcGh5ZHd6YWFha250dG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4NDI1NzksImV4cCI6MjAxNzQxODU3OX0.f4h8T2wrDJdiLH5CV1EmzpRtTS-gnI0gZssUfHxSS-I";

export const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const storage = supabase.storage;
