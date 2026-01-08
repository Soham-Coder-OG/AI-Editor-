import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../Spinner';
import { IconUser } from '../icons/IconUser';
import { IconMail } from '../icons/IconMail';
import { IconLock } from '../icons/IconLock';
import { IconEye } from '../icons/IconEye';
import { IconEyeOff } from '../icons/IconEyeOff';

export const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      await signup(username, email, password);
      setMessage("Success! Please check your email for a confirmation link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  if (message) {
    return (
        <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-6 rounded-lg flex flex-col items-center gap-4 animate-fade-in" role="alert">
            <IconMail className="w-10 h-10 text-green-400" />
            <div className="text-center">
                <h3 className="font-bold text-lg text-text">Confirm your email</h3>
                <p className="text-sm text-subtle mt-1">
                    We sent a confirmation link to <br/><span className="font-semibold text-text">{email}</span>.
                </p>
                 <p className="text-sm text-subtle mt-3">
                    Please click the link in the email to complete your registration.
                </p>
            </div>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-center text-sm" role="alert">
          {error}
        </div>
      )}
      <div className="relative">
        <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full bg-background border border-muted rounded-lg p-3 pl-10 text-text placeholder-subtle focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
      </div>
      <div className="relative">
        <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full bg-background border border-muted rounded-lg p-3 pl-10 text-text placeholder-subtle focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
      </div>
      <div className="relative">
        <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle pointer-events-none" />
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (at least 6 characters)"
          required
          className="w-full bg-background border border-muted rounded-lg p-3 pl-10 pr-14 text-text placeholder-subtle focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-0 bottom-0 px-4 flex items-center text-muted hover:text-primary transition-colors duration-200"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
        </button>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 text-white font-semibold rounded-lg text-sm px-6 py-3 text-center transition-all duration-300 ease-in-out bg-gradient-to-r from-primary via-primary to-secondary hover:shadow-glow-primary disabled:from-muted disabled:to-muted/80 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isLoading ? <Spinner /> : 'Create Account'}
      </button>
    </form>
  );
};