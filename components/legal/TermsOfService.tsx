import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { IconArrowLeft } from '../icons/IconArrowLeft';

export const TermsOfService = () => {
  const { setMode } = useNavigation();

  return (
    <div className="w-full max-w-4xl animate-fade-in text-left">
      <div className="relative mb-10 text-center">
        <button
          onClick={() => setMode('editor')}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-subtle hover:text-primary transition-colors duration-200"
          aria-label="Back to editor"
        >
          <IconArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-4xl md:text-5xl font-extrabold text-text">Terms of Service</h2>
        <p className="text-lg text-subtle mt-4">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-invert prose-lg bg-surface border border-muted/50 rounded-2xl p-8 mx-auto text-subtle">
        <h3>1. Agreement to Terms</h3>
        <p>
          By using our services, you agree to be bound by these Terms. If you don’t agree to be bound by these Terms, do not use the Services.
        </p>

        <h3>2. Your Content</h3>
        <p>
          You are responsible for the content, such as images and text prompts, that you provide to the service. You represent and warrant that you have all necessary rights to your content and that you’re not infringing or violating any third party’s rights by posting it.
        </p>
        
        <h3>3. Prohibited Conduct</h3>
        <p>
          You agree not to misuse the services or help anyone else to do so. This includes, but is not limited to, the following:
        </p>
        <ul>
            <li>Generating content that is unlawful, harmful, threatening, abusive, or otherwise objectionable.</li>
            <li>Attempting to reverse engineer the services or models.</li>
            <li>Using the service for any illegal or unauthorized purpose.</li>
        </ul>

        <h3>4. Termination</h3>
        <p>
            We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
      </div>
    </div>
  );
};