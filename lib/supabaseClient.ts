import { createClient, SupabaseClient } from '@supabase/supabase-js';

// User-provided credentials have been hardcoded for immediate functionality.
// In a production environment, it is strongly recommended to use environment variables.
const supabaseUrl = 'https://bpnltziuvhbgntzclbhh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbmx0eml1dmhiZ250emNsYmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDQ0NjYsImV4cCI6MjA3MjY4MDQ2Nn0.ofi3qUdZS4P1OW0Sd0HRZY1z5BMyZ4vo2bkHGRc0yXE';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
const supabaseError: Error | null = null;

export { supabase, supabaseError };