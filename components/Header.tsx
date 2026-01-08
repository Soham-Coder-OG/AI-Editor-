import React from 'react';
import { IconLogo } from './icons/IconLogo';
import { useNavigation } from '../contexts/NavigationContext';

export const Header = () => {
  const { mode, setMode } = useNavigation();

  const navButtonClasses = "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75";
  const activeClasses = "text-white";
  const inactiveClasses = "text-subtle hover:text-text";

  const mainNav = (
    <>
      <button onClick={() => setMode('editor')} className={`${navButtonClasses} ${mode === 'editor' ? activeClasses : inactiveClasses}`}>
          {mode === 'editor' && <span className="absolute inset-0 bg-primary/20 rounded-lg -z-10" />}
          Photo Editor
      </button>
      <button onClick={() => setMode('merger')} className={`${navButtonClasses} ${mode === 'merger' ? activeClasses : inactiveClasses}`}>
          {mode === 'merger' && <span className="absolute inset-0 bg-primary/20 rounded-lg -z-10" />}
          AI Merger
      </button>
      <button onClick={() => setMode('generator')} className={`${navButtonClasses} ${mode === 'generator' ? activeClasses : inactiveClasses}`}>
          {mode === 'generator' && <span className="absolute inset-0 bg-primary/20 rounded-lg -z-10" />}
          AI Generator
      </button>
    </>
  );

  const mobileNav = (
    <>
        <button onClick={() => setMode('editor')} className={`${navButtonClasses} ${mode === 'editor' ? activeClasses : inactiveClasses} flex-1 justify-center`}>
            {mode === 'editor' && <span className="absolute inset-0 bg-primary/20 rounded-lg -z-10" />}
            Editor
        </button>
        <button onClick={() => setMode('merger')} className={`${navButtonClasses} ${mode === 'merger' ? activeClasses : inactiveClasses} flex-1 justify-center`}>
            {mode === 'merger' && <span className="absolute inset-0 bg-primary/20 rounded-lg -z-10" />}
            Merger
        </button>
        <button onClick={() => setMode('generator')} className={`${navButtonClasses} ${mode === 'generator' ? activeClasses : inactiveClasses} flex-1 justify-center`}>
            {mode === 'generator' && <span className="absolute inset-0 bg-primary/20 rounded-lg -z-10" />}
            Generator
        </button>
        <button onClick={() => setMode('pricing')} className={`${navButtonClasses} ${mode === 'pricing' ? activeClasses : inactiveClasses} flex-1 justify-center`}>
            {mode === 'pricing' && <span className="absolute inset-0 bg-primary/20 rounded-lg -z-10" />}
            Pricing
        </button>
    </>
  );
  
  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-muted/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 sm:gap-8">
            <a href="/" onClick={(e) => { e.preventDefault(); setMode('editor'); }} className="flex items-center gap-3" aria-label="AI Editor Home">
              <IconLogo className="h-9 w-9 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight text-text bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                AI Editor
              </h1>
            </a>
              <nav className="hidden md:flex items-center gap-2 p-1 bg-surface rounded-xl border border-muted/50">
                {mainNav}
              </nav>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <button onClick={() => setMode('pricing')} className="font-semibold text-sm bg-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition-colors">
                Pricing
            </button>
          </div>
        </div>
        <nav className="flex md:hidden items-center justify-center gap-2 p-1 bg-surface rounded-xl border border-muted/50 my-2 sm:mt-0">
            {mobileNav}
        </nav>
      </div>
    </header>
  );
};
