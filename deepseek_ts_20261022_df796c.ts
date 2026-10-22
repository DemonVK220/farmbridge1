// ─── Add these at the end ─────────────────────────────────
export interface AppNotification {
  id: string;
  type: 'order' | 'verification' | 'group' | 'subscription' | 'surplus' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionView?: string;
  actionId?: string;
  actionLabel?: string;
}

export interface LoggedInUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
  preferredLanguage: 'en' | 'ta' | 'hi';
  notificationsEnabled: boolean;
  smsAlertsEnabled: boolean;
  whatsappAlertsEnabled: boolean;
  joinedDate: string;
}

export interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  essential: true;
  decidedAt: string;
}

export interface AccessibilityPreferences {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
}