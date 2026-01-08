import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../Spinner';
import { IconMail } from '../icons/IconMail';
import { IconLock } from '../icons/IconLock';
import { IconEye } from '../icons/IconEye';
import { IconEyeOff } from '../icons/IconEyeOff';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
    } else {
        setRememberMe(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-center text-sm" role="alert">
          {error}
        </div>
      )}
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
          placeholder="Password"
          required
          className="w-full bg-background border border-muted rounded-lg p-3 pl-10 pr-12 text-text placeholder-subtle focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-muted hover:text-primary hover:bg-muted/20 transition-all duration-200"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
        </button>
      </div>
       <div className="flex items-center justify-between">
        <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer group">
            <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-muted bg-background text-primary focus:ring-primary focus:ring-offset-background" 
            />
            <span className="text-sm text-subtle group-hover:text-text transition-colors">Remember me</span>
        </label>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 text-white font-semibold rounded-lg text-sm px-6 py-3 text-center transition-all duration-300 ease-in-out bg-gradient-to-r from-primary via-primary to-secondary hover:shadow-glow-primary disabled:from-muted disabled:to-muted/80 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isLoading ? <Spinner /> : 'Log In'}
      </button>
    </form>
  );
};
