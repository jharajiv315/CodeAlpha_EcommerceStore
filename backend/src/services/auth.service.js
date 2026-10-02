import { query } from '../config/db.js';

class ProfileService {
  /**
   * Retrieves user profile from PostgreSQL
   */
  async getProfile(userId) {
    const result = await query(
      `SELECT id, name, email, joined_date, saved_addresses, created_at FROM profiles WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      const err = new Error('Profile not found.');
      err.statusCode = 404;
      err.errorCode = 'PROFILE_NOT_FOUND';
      throw err;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      joinedDate: row.joined_date,
      savedAddresses: row.saved_addresses || [],
      createdAt: row.created_at,
    };
  }

  /**
   * Updates profile fields in PostgreSQL
   */
  async updateProfile(userId, { name, savedAddresses }) {
    const updates = [];
    const values = [];
    let idx = 1;

    if (name && typeof name === 'string' && name.trim().length >= 2) {
      updates.push(`name = $${idx++}`);
      values.push(name.trim());
    }

    if (savedAddresses && Array.isArray(savedAddresses)) {
      updates.push(`saved_addresses = $${idx++}::jsonb`);
      values.push(JSON.stringify(savedAddresses));
    }

    if (updates.length === 0) {
      return this.getProfile(userId);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const queryText = `
      UPDATE profiles
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING id, name, email, joined_date, saved_addresses
    `;

    const result = await query(queryText, values);
    if (result.rows.length === 0) {
      const err = new Error('Profile not found.');
      err.statusCode = 404;
      throw err;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      joinedDate: row.joined_date,
      savedAddresses: row.saved_addresses || [],
    };
  }

  /**
   * Adds a new saved address to user profile
   */
  async addSavedAddress(userId, address) {
    const profile = await this.getProfile(userId);
    const addresses = Array.isArray(profile.savedAddresses) ? [...profile.savedAddresses] : [];

    const isDup = addresses.some(
      a =>
        a.addressLine?.toLowerCase() === address.addressLine?.toLowerCase() &&
        a.postalCode === address.postalCode
    );

    if (!isDup) {
      addresses.push(address);
      await this.updateProfile(userId, { savedAddresses: addresses });
    }

    return addresses;
  }
}

export const authService = new ProfileService();
