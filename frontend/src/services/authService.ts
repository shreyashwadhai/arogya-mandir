import type { CmoUser, UserRole } from '../types/cmoTypes';
import { StorageService, DEFAULT_CMOS } from './storageService';

const SESSION_KEYS = {
  IS_AUTH: 'arogya_is_auth_v1',
  ACTIVE_USER_ID: 'arogya_active_user_id_v1',
  ACTIVE_ROLE: 'arogya_active_role_v1',
};

export class AuthService {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  static getActiveUser(): CmoUser | null {
    if (!this.isClient()) return DEFAULT_CMOS[0]; // Fallback Super Admin
    const isAuth = sessionStorage.getItem(SESSION_KEYS.IS_AUTH) === 'true';
    if (!isAuth) return null;

    const userId = sessionStorage.getItem(SESSION_KEYS.ACTIVE_USER_ID);
    const cmos = StorageService.getCmos();
    const user = cmos.find((c) => c.id === userId);

    if (user) return user;
    return cmos[0] || DEFAULT_CMOS[0];
  }

  static login(userId: string): CmoUser | null {
    if (!this.isClient()) return null;
    const cmos = StorageService.getCmos();
    const user = cmos.find((c) => c.id === userId);

    if (user) {
      sessionStorage.setItem(SESSION_KEYS.IS_AUTH, 'true');
      sessionStorage.setItem(SESSION_KEYS.ACTIVE_USER_ID, user.id);
      sessionStorage.setItem(SESSION_KEYS.ACTIVE_ROLE, user.role);
      return user;
    }

    return null;
  }

  static loginByEmail(email: string): CmoUser | null {
    if (!this.isClient()) return null;
    const cmos = StorageService.getCmos();
    const trimmedEmail = email.trim().toLowerCase();
    const user = cmos.find((c) => c.email.toLowerCase() === trimmedEmail);

    if (user) {
      sessionStorage.setItem(SESSION_KEYS.IS_AUTH, 'true');
      sessionStorage.setItem(SESSION_KEYS.ACTIVE_USER_ID, user.id);
      sessionStorage.setItem(SESSION_KEYS.ACTIVE_ROLE, user.role);
      return user;
    }

    return null;
  }

  static logout(): void {
    if (this.isClient()) {
      sessionStorage.removeItem(SESSION_KEYS.IS_AUTH);
      sessionStorage.removeItem(SESSION_KEYS.ACTIVE_USER_ID);
      sessionStorage.removeItem(SESSION_KEYS.ACTIVE_ROLE);
    }
  }

  static isAuthenticated(): boolean {
    if (!this.isClient()) return false;
    return sessionStorage.getItem(SESSION_KEYS.IS_AUTH) === 'true';
  }

  static getRole(): UserRole | null {
    const user = this.getActiveUser();
    return user ? user.role : null;
  }

  /**
   * Helper to determine upper CMO targets for escalation
   */
  static getValidUpperCmos(currentCmo: CmoUser): CmoUser[] {
    const cmos = StorageService.getCmos();

    if (currentCmo.role === 'CMO_1') {
      // CMO_1 can escalate to CMO_2 or CMO_3
      return cmos.filter((c) => c.role === 'CMO_2' || c.role === 'CMO_3');
    }
    if (currentCmo.role === 'CMO_2') {
      // CMO_2 can escalate to CMO_3 or Super Admin
      return cmos.filter((c) => c.role === 'CMO_3' || c.role === 'SUPER_ADMIN');
    }
    if (currentCmo.role === 'CMO_3') {
      // CMO_3 can escalate to Super Admin
      return cmos.filter((c) => c.role === 'SUPER_ADMIN');
    }

    return [];
  }
}
