import React, { useState } from 'react';
import { User as UserIcon, Lock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'sonner';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [address, setAddress] = useState(user?.address || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      const res = await api.put('/auth/profile', {
        fullName,
        phoneNumber,
        companyName,
        address,
      });
      if (res.data.success) {
        toast.success('Profile details updated.');
        refreshUser();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        toast.success('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">User Profile & Security Settings</h2>
        <p className="text-sm text-slate-500 font-medium">
          Manage your personal details, contact information, and security password.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <UserIcon className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Personal & Organization Info</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Email Address (Read Only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full mt-1 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Organization / Company</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Address / Location</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save Profile Details</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security & Password Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Lock className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">Change Password</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

