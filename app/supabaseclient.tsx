import {createClient} from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const apikey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY || ""

if (!url || !apikey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(

    url, //url
    apikey, //api

    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
        }
    }
);
