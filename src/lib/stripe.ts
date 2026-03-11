import { supabase } from '@/lib/supabase';

const CHECKOUT_TIMEOUT_MS = 15000;

function shouldShowFunctionsHint(message: string) {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('failed to fetch')
    || lowerMessage.includes('functionsfetcherror')
    || lowerMessage.includes('network')
    || lowerMessage.includes('non-2xx')
    || lowerMessage.includes('edge function returned')
    || lowerMessage.includes('worker_error');
}

function withTimeout<T>(promise: Promise<T>, message: string) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(message));
    }, CHECKOUT_TIMEOUT_MS);

    promise
      .then((value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export async function getInvokeErrorMessage(error: { message: string; context?: Response }) {
  if (error.context) {
    try {
      const errorBody = await error.context.json();
      if (errorBody && typeof errorBody.error === 'string' && errorBody.error.length > 0) {
        return errorBody.error;
      }
    } catch {
      // Fall back to the top-level function error message.
    }
  }

  if (import.meta.env.DEV && shouldShowFunctionsHint(error.message)) {
    return 'Unable to reach the local Supabase Edge Functions. Start `npm run supabase:functions:serve` and try again.';
  }

  return error.message;
}

export async function redirectToCheckout(courseIds: string[]) {
  if (courseIds.length === 0) {
    throw new Error('Your cart is empty.');
  }

  const { data: { session }, error: sessionError } = await withTimeout(
    supabase.auth.getSession(),
    'Checking your session took too long. Please try again.'
  );

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await withTimeout(
    supabase.functions.invoke('create-checkout-session', {
      body: { courseIds },
    }),
    'Checkout is taking too long. Verify your Stripe and Supabase function setup, then try again.'
  );

  if (response.error) {
    throw new Error(await getInvokeErrorMessage(response.error));
  }

  const { url } = response.data;
  if (url) {
    window.location.assign(url);
  } else {
    throw new Error('No checkout URL returned');
  }
}
