import { createClient } from './supabase';

export interface Profile {
  fullName: string;
  phone: string;
}

export async function fetchProfile(userId: string): Promise<Profile> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return { fullName: data?.full_name ?? '', phone: data?.phone ?? '' };
}

export async function updateProfile(userId: string, input: Profile): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, full_name: input.fullName, phone: input.phone });

  if (error) throw error;
}
