import {createClient} from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ftjpqrwtuamrvvgrnxcm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0anBxcnd0dWFtcnZ2Z3JueGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0OTg1NDQsImV4cCI6MjA0NDA3NDU0NH0.6eZ5BjPPSL2LMi_Dqcmcer59T4nhhstjR-ZJwnU2dJY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
