/**
 * Šalje event na /api/capi (server-side Meta CAPI)
 * Poziva se nakon browser fbq() poziva za deduplikaciju.
 */
export async function sendCapiEvent(params: {
  event_name: string;
  event_id: string;
  email?: string;
  custom_data?: Record<string, unknown>;
}) {
  try {
    await fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        url: window.location.href,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
      }),
    });
  } catch {
    // CAPI greška ne smije blokirati UI
  }
}

function getCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((r) => r.startsWith(name + '='))
    ?.split('=')[1];
}
