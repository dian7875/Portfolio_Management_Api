import { createClient } from '@supabase/supabase-js';
import { envs } from 'src/config/envs.conf';

export const SupabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: () => {
    return createClient(envs.supabase_url!, envs.supabase_service_role_key);
  },
};
