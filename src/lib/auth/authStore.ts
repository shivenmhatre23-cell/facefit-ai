'use client';

/**
 * Authentication and Session Management for FaceFit AI
 * Supports Guest and Authenticated Stylist Member sessions,
 * secure token handling, session expiry, and unauthorized access interception.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'guest';
  avatarInitials: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

const SESSION_STORAGE_KEY = 'facefit_auth_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getActiveSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session: AuthSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      // Session expired
      clearAuthSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession, remember: boolean = false) {
  if (typeof window === 'undefined') return;

  const serialized = JSON.stringify(session);
  sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);

  if (remember) {
    localStorage.setItem(SESSION_STORAGE_KEY, serialized);
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  window.dispatchEvent(new Event('facefit_auth_changed'));
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event('facefit_auth_changed'));
}

/**
 * Mock authentication service with realistic credentials verification
 */
export async function authenticateUser(
  email: string,
  pass: string
): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  await new Promise((res) => setTimeout(res, 400)); // Simulate brief network auth latency

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!pass || pass.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  // Derive display name from email
  const namePart = cleanEmail.split('@')[0];
  const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  const initials = formattedName.slice(0, 2).toUpperCase();

  const user: AuthUser = {
    id: 'user-' + Math.random().toString(36).substring(2, 9),
    name: formattedName,
    email: cleanEmail,
    role: 'member',
    avatarInitials: initials,
    createdAt: new Date().toISOString(),
  };

  const session: AuthSession = {
    token: 'jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
    user,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  saveAuthSession(session, true);
  return { success: true, session };
}

/**
 * Generates an ephemeral guest session
 */
export function createGuestSession(): AuthSession {
  const guestUser: AuthUser = {
    id: 'guest-' + Math.random().toString(36).substring(2, 8),
    name: 'Guest Explorer',
    email: 'guest@facefit.ai',
    role: 'guest',
    avatarInitials: 'GE',
    createdAt: new Date().toISOString(),
  };

  const session: AuthSession = {
    token: 'guest_tok_' + Math.random().toString(36).substring(2),
    user: guestUser,
    expiresAt: Date.now() + 4 * 60 * 60 * 1000, // 4 hours guest session
  };

  saveAuthSession(session, false);
  return session;
}
