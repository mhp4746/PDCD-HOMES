import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://crinihlzalhwwjhtvvyd.supabase.co'
const supabaseKey = 'sb_publishable_fd7SxxE_Ps3rNNcfwF3fEg_L1LluPhK'

export const supabase = createClient(supabaseUrl, supabaseKey)
