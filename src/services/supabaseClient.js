import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
const supabaseUrl = 'https://wuntakkwdwblabwaalhn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bnRha2t3ZHdibGFid2FhbGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzM0MTYsImV4cCI6MjA2NjcwOTQxNn0.r726cWWKX3dJGiWoTI7uZ7MoiivhvfJFep_5PTnt-FA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;