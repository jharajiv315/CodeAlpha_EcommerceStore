import { ShippingAddress, User } from '../types';

const AUTH_USER_KEY = 'nexora_auth_user_v1';
const REGISTERED_USERS_KEY = 'nexora_registered_users_v1';

interface StoredAccount {
  user: User;
  passwordHash: string; // Simulated hash for prototype
}

const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    user: {
      id: 'usr_alex_01',
      name: 'Alex Morgan',
      email: 'alex@nexora.design',
      joinedDate: 'January 2026',
      savedAddresses: [
        {
          fullName: 'Alex Morgan',
          email: 'alex@nexora.design',
          phone: '+91 98765 43210',
          addressLine: 'Flat 402, Signature Pavilion, 12th Main Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
        }
      ]
    },
    passwordHash: 'password123',
  },
  {
    user: {
      id: 'usr_priya_02',
      name: 'Priya Sharma',
      email: 'priya@nexora.design',
      joinedDate: 'February 2026',
      savedAddresses: [
        {
          fullName: 'Priya Sharma',
          email: 'priya@nexora.design',
          phone: '+91 98111 22334',
          addressLine: 'Apt 12B, Ocean Crest, Perry Cross Rd, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
        }
      ]
    },
    passwordHash: 'password123',
  }
];

class AuthService {
  private loadAccounts(): StoredAccount[] {
    try {
      const data = localStorage.getItem(REGISTERED_USERS_KEY);
      if (!data) {
        this.saveAccounts(DEFAULT_ACCOUNTS);
        return [...DEFAULT_ACCOUNTS];
      }
      return JSON.parse(data);
    } catch {
      return [...DEFAULT_ACCOUNTS];
    }
  }

  private saveAccounts(accounts: StoredAccount[]): void {
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Retrieves active authenticated user session
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      if (!data) return Promise.resolve(null);
      return Promise.resolve(JSON.parse(data));
    } catch {
      return Promise.resolve(null);
    }
  }

  /**
   * Authenticates user credentials
   */
  async login(credentials: { email: string; password: string }): Promise<User> {
    const emailNorm = credentials.email.trim().toLowerCase();
    const accounts = this.loadAccounts();

    const account = accounts.find(a => a.user.email.toLowerCase() === emailNorm);

    if (!account) {
      throw new Error('No Nexora account found with this email address.');
    }

    if (account.passwordHash !== credentials.password) {
      throw new Error('Invalid password. Please verify your credentials.');
    }

    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(account.user));
    } catch {
      // Storage unavailable
    }

    return Promise.resolve({ ...account.user });
  }

  /**
   * Registers a new user account
   */
  async register(data: { name: string; email: string; password: string }): Promise<User> {
    const emailNorm = data.email.trim().toLowerCase();
    const accounts = this.loadAccounts();

    if (accounts.some(a => a.user.email.toLowerCase() === emailNorm)) {
      throw new Error('An account with this email address already exists. Please sign in.');
    }

    if (!data.name.trim() || data.name.trim().length < 2) {
      throw new Error('Please enter your full name (minimum 2 characters).');
    }

    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: emailNorm,
      joinedDate: new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date()),
      savedAddresses: [],
    };

    accounts.push({
      user: newUser,
      passwordHash: data.password,
    });

    this.saveAccounts(accounts);

    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    } catch {
      // Storage unavailable
    }

    return Promise.resolve({ ...newUser });
  }

  /**
   * Destroys active user session
   */
  async logout(): Promise<void> {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // Storage unavailable
    }
    return Promise.resolve();
  }

  /**
   * Updates user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = await this.getCurrentUser();
    if (!current) {
      throw new Error('Not authenticated.');
    }

    const updatedUser: User = {
      ...current,
      ...updates,
    };

    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
      const accounts = this.loadAccounts();
      const idx = accounts.findIndex(a => a.user.id === current.id);
      if (idx !== -1) {
        accounts[idx].user = updatedUser;
        this.saveAccounts(accounts);
      }
    } catch {
      // Storage unavailable
    }

    return Promise.resolve(updatedUser);
  }

  /**
   * Retrieves saved addresses for current user
   */
  async getSavedAddresses(): Promise<ShippingAddress[]> {
    const user = await this.getCurrentUser();
    return Promise.resolve(user?.savedAddresses || []);
  }

  /**
   * Saves a new address to user profile
   */
  async addSavedAddress(address: ShippingAddress): Promise<ShippingAddress[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const addresses = user.savedAddresses ? [...user.savedAddresses] : [];
    // Avoid duplicate addresses
    const isDup = addresses.some(a => a.addressLine.toLowerCase() === address.addressLine.toLowerCase() && a.postalCode === address.postalCode);
    if (!isDup) {
      addresses.push(address);
      await this.updateProfile({ savedAddresses: addresses });
    }

    return addresses;
  }
}

export const authService = new AuthService();
