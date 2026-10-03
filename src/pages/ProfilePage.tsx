import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ShippingAddress } from '../types';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Plus,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface ProfilePageProps {
  onNavigateHome: () => void;
  onNavigateOrders: () => void;
  onNavigateWishlist: () => void;
  onNavigateShop: () => void;
  onLoggedOut: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateHome,
  onNavigateOrders,
  onNavigateWishlist,
  onNavigateShop,
  onLoggedOut,
}) => {
  const { user, logout, wishlist, updateProfile } = useAuth();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<ShippingAddress>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.addressLine || !newAddr.city || !newAddr.postalCode) return;

    const currentAddresses = user?.savedAddresses ? [...user.savedAddresses] : [];
    currentAddresses.push(newAddr);
    await updateProfile({ savedAddresses: currentAddresses });
    setIsAddingAddress(false);
    setNewAddr({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      addressLine: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    });
  };

  const handleLogout = async () => {
    await logout();
    onLoggedOut();
  };

  const breadcrumbs = [
    { label: 'Home', onClick: onNavigateHome },
    { label: 'Account Profile', active: true },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={breadcrumbs} />

      {/* Account Overview Header */}
      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#123C35] text-[#FFFFFF] text-xl font-bold flex items-center justify-center shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#171A19]">
                {user.name}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#EDE4D2] text-[#123C35]">
                Verified Client
              </span>
            </div>
            <p className="text-xs text-[#666B67] mt-0.5">{user.email}</p>
            <p className="text-[11px] text-[#666B67] mt-1">
              Member since {user.joinedDate}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 border border-[#E4E1DA] hover:border-[#A94747] hover:text-[#A94747] text-[#666B67] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={onNavigateOrders}
          className="bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#123C35] p-5 rounded-xl text-left transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between h-32"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666B67]">
              Order Tracking
            </span>
            <Package className="w-4 h-4 text-[#123C35]" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-[#171A19]">My Orders</h4>
            <span className="text-xs text-[#123C35] font-medium">View fulfillment status →</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onNavigateWishlist}
          className="bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#123C35] p-5 rounded-xl text-left transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between h-32"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666B67]">
              Saved Gear
            </span>
            <Heart className="w-4 h-4 text-[#123C35]" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-[#171A19]">Wishlist ({wishlist.length})</h4>
            <span className="text-xs text-[#123C35] font-medium">Browse saved items →</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onNavigateShop}
          className="bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#123C35] p-5 rounded-xl text-left transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between h-32"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666B67]">
              Catalog
            </span>
            <ShieldCheck className="w-4 h-4 text-[#123C35]" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-[#171A19]">Explore Gear</h4>
            <span className="text-xs text-[#123C35] font-medium">New arrivals & electronics →</span>
          </div>
        </button>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E4E1DA]">
          <div>
            <h3 className="text-base font-semibold text-[#171A19] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#123C35]" />
              <span>Saved Shipping Destinations</span>
            </h3>
            <p className="text-xs text-[#666B67] mt-0.5">
              Addresses automatically populate during express checkout.
            </p>
          </div>
          {!isAddingAddress && (
            <button
              type="button"
              onClick={() => setIsAddingAddress(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE4D2] hover:bg-[#E4D5BC] text-[#123C35] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Address</span>
            </button>
          )}
        </div>

        {/* Add Address Form */}
        {isAddingAddress && (
          <form onSubmit={handleSaveAddress} className="bg-[#F7F5F0] border border-[#E4E1DA] rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#123C35]">
              New Shipping Destination
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#666B67] mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-[#666B67] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#666B67] mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddr.addressLine}
                  onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                  placeholder="Flat/House No., Street, Landmark"
                  className="w-full bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-[#666B67] mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-[#666B67] mb-1">State & PIN</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    placeholder="State"
                    className="w-full bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    placeholder="PIN Code"
                    className="w-full bg-[#FFFFFF] border border-[#E4E1DA] rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="px-4 py-2 border border-[#E4E1DA] text-xs font-medium rounded-lg text-[#666B67]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#123C35] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-lg"
              >
                Save Destination
              </button>
            </div>
          </form>
        )}

        {/* Address Cards */}
        {user.savedAddresses && user.savedAddresses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.savedAddresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#F7F5F0] border border-[#E4E1DA] rounded-xl text-xs space-y-1 relative"
              >
                {idx === 0 && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#EDE4D2] text-[#123C35] rounded">
                    Default
                  </span>
                )}
                <p className="font-semibold text-sm text-[#171A19]">{addr.fullName}</p>
                <p className="text-[#666B67]">{addr.addressLine}</p>
                <p className="text-[#666B67]">
                  {addr.city}, {addr.state} — {addr.postalCode}
                </p>
                <p className="text-[#666B67] pt-1">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#666B67]">
            No saved addresses on file. Add one to accelerate your checkout process.
          </p>
        )}
      </div>
    </div>
  );
};
