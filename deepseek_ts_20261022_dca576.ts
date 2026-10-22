const TOKEN_KEY = 'farmbridge.token';
const EXPIRY_KEY = 'farmbridge.tokenExpiresAt';
const USER_KEY = 'farmbridge.tokenUser';

export interface StoredUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'farmer' | 'customer' | 'business' | 'fpo' | 'delivery' | 'admin';
}

export const tokenStore = {
  get(): string | null { try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set(token: string, expiresAt: string, user?: StoredUser) {
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(EXPIRY_KEY, expiresAt);
      if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {}
  },
  getUser(): StoredUser | null {
    try { const raw = sessionStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) as StoredUser : null; } catch { return null; }
  },
  clear() {
    try { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(EXPIRY_KEY); sessionStorage.removeItem(USER_KEY); } catch {}
  },
  isValid(): boolean {
    const token = this.get();
    if (!token) return false;
    try {
      const exp = sessionStorage.getItem(EXPIRY_KEY);
      if (!exp) return true;
      return new Date(exp).getTime() > Date.now();
    } catch { return false; }
  },
  expiresAt(): string | null { try { return sessionStorage.getItem(EXPIRY_KEY); } catch { return null; } },
};