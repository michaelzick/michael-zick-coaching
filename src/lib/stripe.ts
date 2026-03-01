import { supabase } from '@/lib/supabase';

export async function redirectToCheckout(courseIds: string[]) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await supabase.functions.invoke('create-checkout-session', {
    body: { courseIds },
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  const { url } = response.data;
  if (url) {
    window.location.href = url;
  } else {
    throw new Error('No checkout URL returned');
  }
}
