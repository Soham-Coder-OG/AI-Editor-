import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IconUser } from '../icons/IconUser';
import { IconCredit } from '../icons/IconCredit';
import { IconCrown } from '../icons/IconCrown';

export const AccountPage = () => {
  const { profile } = useAuth();

  if (!profile) {
    return <div>Loading account details...</div>;
  }

  const getCreditsText = () => {
    if (profile.subscription_tier === 'unlimited') return 'Unlimited';
    if (profile.subscription_tier === 'pro') return '100 / month';
    return profile.image_credits;
  };
  
  return (
    <div className="w-full max-w-4xl animate-fade-in text-left">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-text">My Account</h2>
        <p className="text-lg text-subtle mt-4 max-w-2xl mx-auto">
          Manage your profile information and subscription details.
        </p>
      </div>

      <div className="bg-surface border border-muted/50 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Section */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-text">Profile</h3>
            <p className="text-sm text-subtle mt-1">Your personal information.</p>
          </div>
          <div className="md:col-span-2 bg-background/50 border border-muted/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-4">
                <IconUser className="w-6 h-6 text-subtle" />
                <div>
                    <label className="text-xs text-subtle">Username</label>
                    <p className="text-text font-semibold">{profile.username}</p>
                </div>
            </div>
          </div>
          
          <div className="col-span-full border-t border-muted/50 my-2"></div>

          {/* Subscription Section */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-text">Subscription</h3>
            <p className="text-sm text-subtle mt-1">Your current plan and usage.</p>
          </div>
          <div className="md:col-span-2 bg-background/50 border border-muted/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-4">
                <IconCrown className="w-6 h-6 text-subtle" />
                <div>
                    <label className="text-xs text-subtle">Current Plan</label>
                    <p className="text-text font-semibold capitalize">{profile.subscription_tier}</p>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <IconCredit className="w-6 h-6 text-subtle" />
                <div>
                    <label className="text-xs text-subtle">Image Credits</label>
                    <p className="text-text font-semibold">{getCreditsText()}</p>
                </div>
            </div>
             <button disabled className="w-full md:w-auto text-sm font-semibold bg-muted/50 text-subtle px-5 py-2.5 rounded-lg cursor-not-allowed">
                Manage Subscription
            </button>
            <p className="text-xs text-muted">Subscription management coming soon.</p>
          </div>

        </div>
      </div>
    </div>
  );
};