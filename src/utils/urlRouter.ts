/**
 * Utility to manage separate portal URLs for Peserta (Kepala Sekolah) and Admin (Fasilitator)
 */

export type PortalRole = 'peserta' | 'admin' | null;

/**
 * Detect the intended role from the current browser URL
 * Supports query params (?role=peserta, ?role=admin), hash (#peserta, #admin),
 * or path (/peserta, /admin).
 */
export function detectPortalRole(): PortalRole {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Check Query Parameters
    const searchParams = new URLSearchParams(window.location.search);
    const roleParam = (
      searchParams.get('role') ||
      searchParams.get('portal') ||
      searchParams.get('mode')
    )?.toLowerCase();

    if (roleParam === 'admin' || roleParam === 'fasilitator') return 'admin';
    if (roleParam === 'peserta' || roleParam === 'participant' || roleParam === 'kepsek') return 'peserta';

    // 2. Check URL Hash
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('admin') || hash.includes('fasilitator')) return 'admin';
    if (hash.includes('peserta') || hash.includes('participant') || hash.includes('kepsek')) return 'peserta';

    // 3. Check URL Pathname
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.endsWith('/admin') || pathname.includes('/admin/')) return 'admin';
    if (pathname.endsWith('/peserta') || pathname.includes('/peserta/')) return 'peserta';
  } catch (err) {
    console.error('Error detecting portal role from URL:', err);
  }

  return null;
}

/**
 * Generate full shareable URL for a specific role
 */
export function getPortalUrl(role: 'peserta' | 'admin'): string {
  if (typeof window === 'undefined') return `?role=${role}`;
  try {
    const origin = window.location.origin;
    let pathname = window.location.pathname;
    // Normalize path if previously visited /admin or /peserta
    if (pathname.endsWith('/admin') || pathname.endsWith('/peserta')) {
      pathname = pathname.replace(/\/(admin|peserta)$/, '');
    }
    if (!pathname) pathname = '/';

    return `${origin}${pathname}?role=${role}`;
  } catch {
    return `?role=${role}`;
  }
}

/**
 * Synchronize the current browser URL with the selected role
 */
export function updatePortalUrl(role: PortalRole) {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (role) {
      url.searchParams.set('role', role);
      url.searchParams.delete('portal');
      url.searchParams.delete('mode');
    } else {
      url.searchParams.delete('role');
      url.searchParams.delete('portal');
      url.searchParams.delete('mode');
    }
    window.history.replaceState({}, '', url.toString());
  } catch (err) {
    console.error('Failed to update portal URL:', err);
  }
}

/**
 * Copy text to clipboard safely
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers or iframes without clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
}
