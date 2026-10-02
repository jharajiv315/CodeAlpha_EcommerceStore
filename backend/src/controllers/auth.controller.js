import { authService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return sendSuccess(res, user, 'Profile retrieved', 200);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, savedAddresses } = req.body;
    const user = await authService.updateProfile(req.user.id, { name, savedAddresses });
    return sendSuccess(res, user, 'Profile updated', 200);
  } catch (err) {
    next(err);
  }
};

export const addSavedAddress = async (req, res, next) => {
  try {
    const address = req.body;
    const addresses = await authService.addSavedAddress(req.user.id, address);
    return sendSuccess(res, addresses, 'Address saved', 200);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  return sendSuccess(res, null, 'Logged out successfully', 200);
};
