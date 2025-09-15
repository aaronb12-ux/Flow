import {createClient} from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supabase = createClient(
    "https://omhpryogsxneelpnpnct.supabase.co", //url
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9taHByeW9nc3huZWVscG5wbmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMjE5NTEsImV4cCI6MjA2NTY5Nzk1MX0.zw3igr6cMpp0EU4K92PPzebuPNuYfMagYCwjXBPAStA", //api
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
        }
    }
);