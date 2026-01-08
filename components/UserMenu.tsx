import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IconUser } from './icons/IconUser';
import { IconCredit } from './icons/IconCredit';
import { IconCrown } from './icons/IconCrown';
import { IconLogout } from './icons/IconLogout';
import { useNavigation } from '../contexts/NavigationContext';
import { useToast } from '../contexts/ToastContext';

export const UserMenu = () => {
    const { currentUser, profile, logout } = useAuth();
    const { setMode } = useNavigation();
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        try {
            await logout();
            showToast('You have been logged out.', 'success');
        } catch (error) {
            console.error('Failed to log out', error);
            showToast('Failed to log out.', 'error');
        }
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getCreditsText = () => {
        if (profile?.subscription_tier === 'unlimited') {
            return "Unlimited Credits";
        }
        if (profile?.subscription_tier === 'pro') {
            return "100 Credits/Month";
        }
        return `${profile?.image_credits ?? 0} Credits Remaining`;
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full bg-surface border border-muted/50 flex items-center justify-center hover:border-primary transition-colors">
                <IconUser className="w-5 h-5 text-subtle" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface border border-muted/50 rounded-xl shadow-2xl shadow-background/50 animate-fade-in origin-top-right z-20">
                    <div className="p-4 border-b border-muted/50">
                        <p className="text-sm font-semibold text-text truncate">{profile?.username || currentUser?.email}</p>
                        <p className="text-xs text-subtle capitalize">{profile?.subscription_tier} Plan</p>
                    </div>
                    <div className="p-2">
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-subtle">
                           <IconCredit className="w-5 h-5"/>
                           <span>{getCreditsText()}</span>
                        </div>
                        <button onClick={() => { setMode('account'); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-subtle rounded-md hover:bg-muted/30 hover:text-primary transition-colors">
                           <IconUser className="w-5 h-5"/>
                           <span>My Account</span>
                        </button>
                        {profile?.subscription_tier === 'free' && (
                             <button onClick={() => { setMode('pricing'); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-subtle rounded-md hover:bg-muted/30 hover:text-primary transition-colors">
                                <IconCrown className="w-5 h-5"/>
                                <span>Upgrade Plan</span>
                             </button>
                        )}
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-subtle rounded-md hover:bg-muted/30 hover:text-red-400 transition-colors">
                            <IconLogout className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};