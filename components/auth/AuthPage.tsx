import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { IconLogo } from '../icons/IconLogo';
import { IconGoogle } from '../icons/IconGoogle';
import { useAuth } from '../../contexts/AuthContext';
import { RedirectUriModal } from '../RedirectUriModal';
import { ConnectionErrorModal } from '../ConnectionErrorModal';

type AuthMode = 'login' | 'signup';

export const AuthPage = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [error, setError] = useState<string | null>(null);
    const [showRedirectModal, setShowRedirectModal] = useState(false);
    const [showConnectionErrorModal, setShowConnectionErrorModal] = useState(false);
    const { loginWithGoogle } = useAuth();

    const toggleMode = () => {
        setError(null);
        setMode(prev => prev === 'login' ? 'signup' : 'login');
    };
    
    const handleGoogleLogin = async () => {
        setError(null);
        setShowRedirectModal(false);
        setShowConnectionErrorModal(false);
        try {
            await loginWithGoogle();
        } catch (err) {
            console.error("Google Login Failed:", err);
            const errorMessage = err instanceof Error ? err.message.toLowerCase() : '';

            if (errorMessage.includes('redirect_uri') || errorMessage.includes('redirect') || errorMessage.includes('origin')) {
                setShowRedirectModal(true);
            } else if (errorMessage.includes('failed to fetch')) {
                setShowConnectionErrorModal(true);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred during Google sign-in.');
            }
        }
    };

    return (
        <>
            <RedirectUriModal isOpen={showRedirectModal} onClose={() => setShowRedirectModal(false)} />
            <ConnectionErrorModal isOpen={showConnectionErrorModal} onClose={() => setShowConnectionErrorModal(false)} />
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 animate-fade-in">
                <div className="w-full max-w-md">
                    <div className="flex flex-col items-center mb-8">
                        <IconLogo className="h-14 w-14 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight text-text bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mt-2">
                            AI Editor
                        </h1>
                        <p className="text-subtle mt-2">
                            {mode === 'login' ? 'Welcome back! Please log in.' : 'Create an account to get started.'}
                        </p>
                    </div>
                    
                    <div className="bg-surface border border-muted/50 rounded-2xl shadow-2xl shadow-background/50 p-8">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-center text-sm mb-6" role="alert">
                                {error}
                            </div>
                        )}

                        {mode === 'login' ? <LoginForm /> : <SignupForm />}

                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-muted/50"></div>
                            <span className="flex-shrink mx-4 text-xs text-subtle uppercase">Or</span>
                            <div className="flex-grow border-t border-muted/50"></div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex justify-center items-center gap-3 bg-background/80 border border-muted/80 hover:border-text/80 text-text font-semibold rounded-lg text-sm px-6 py-3 text-center transition-colors duration-200"
                        >
                            <IconGoogle className="w-5 h-5" />
                            <span>Sign in with Google</span>
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <button onClick={toggleMode} className="text-sm font-medium text-subtle hover:text-primary transition-colors duration-200">
                            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
