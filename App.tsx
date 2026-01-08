import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PhotoEditor } from './components/PhotoEditor';
import { ImageMerger } from './components/ImageMerger';
import { ImageGenerator } from './components/ImageGenerator';
import { PricingPage } from './components/PricingPage';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
// FIX: Import AccountPage to render the account view.
import { AccountPage } from './components/account/AccountPage';

const seoConfig = {
  editor: {
    title: 'AI Photo Editor | Free AI Image Editing',
    description: 'Effortlessly edit photos with text prompts. Use masking tools for precise changes and let our free AI bring your creative vision to life in seconds.',
  },
  merger: {
    title: 'AI Image Merger | Combine Photos with AI',
    description: 'Merge two images into a unique, AI-generated creation for free. Describe how you want to blend them and witness a stunning, one-of-a-kind result.',
  },
  generator: {
    title: 'Free AI Image Generator | Create Art from Text',
    description: 'Generate stunning, unique images from scratch with a simple text prompt. Choose your aspect ratio and let our advanced AI create original art for you, completely free.',
  },
  pricing: {
    title: 'Pricing | AI Editor Suite',
    description: 'Explore the features of our completely free AI creative suite. No hidden costs, no subscriptions needed.',
  },
  privacy: {
    title: 'Privacy Policy | AI Editor Suite',
    description: 'Read our Privacy Policy to understand how we handle your data.',
  },
  terms: {
    title: 'Terms of Service | AI Editor Suite',
    description: 'Read our Terms of Service before using the AI Editor Suite.',
  },
  // FIX: Add SEO configuration for the new 'account' mode.
  account: {
    title: 'My Account | AI Editor Suite',
    description: 'Manage your profile and subscription details.',
  },
};

const MainApp = () => {
  const { mode } = useNavigation();

  useEffect(() => {
    const currentSeo = seoConfig[mode as keyof typeof seoConfig];
    if (currentSeo) {
      document.title = currentSeo.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', currentSeo.description);
      }
    }
  }, [mode]);

  const renderContent = () => {
    switch (mode) {
      case 'editor':
        return <PhotoEditor />;
      case 'merger':
        return <ImageMerger />;
      case 'generator':
        return <ImageGenerator />;
      case 'pricing':
        return <PricingPage />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      // FIX: Add a case to render the AccountPage when the mode is 'account'.
      case 'account':
        return <AccountPage />;
      default:
        return <PhotoEditor />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <NavigationProvider>
    <ToastProvider>
      <MainApp />
      <ToastContainer />
    </ToastProvider>
  </NavigationProvider>
);

export default App;
