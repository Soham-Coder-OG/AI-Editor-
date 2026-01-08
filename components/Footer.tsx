import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';

const FaqItem = ({ question, children }: { question: string, children: React.ReactNode }) => (
    <details className="group py-4 border-b border-muted/30 last:border-b-0">
        <summary className="font-semibold text-text cursor-pointer hover:text-primary transition-colors list-none flex justify-between items-center">
            {question}
            <span className="text-primary transform transition-transform duration-300 group-open:rotate-45">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </span>
        </summary>
        <div className="text-subtle mt-3 animate-fade-in">
            {children}
        </div>
    </details>
);

export const Footer = () => {
  const { setMode } = useNavigation();
  const currentYear = new Date().getFullYear();

  const linkClasses = "text-subtle hover:text-primary transition-colors duration-200";

  return (
    <footer className="bg-transparent mt-auto">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto text-left mb-10">
            <h2 className="text-xl font-bold text-text mb-6 text-center">Frequently Asked Questions</h2>
            <div className="text-sm bg-surface/50 border border-muted/30 rounded-lg p-6">
                <FaqItem question="What is AI Editor?">
                    <p>AI Editor is a web-based suite of tools that uses generative AI to help you edit, merge, and create images using simple text prompts.</p>
                </FaqItem>
                <FaqItem question="Is it free to use?">
                     <p>Yes, AI Editor is completely free to use. All features are available without any limits, and no account is required.</p>
                </FaqItem>
                <FaqItem question="What happens to my uploaded images?">
                     <p>We respect your privacy. Your images are processed securely to fulfill your request and are not stored on our servers or used for any other purpose.</p>
                </FaqItem>
            </div>
        </div>
        <div className="flex justify-center gap-6 mb-6">
          <button onClick={() => setMode('terms')} className={linkClasses}>Terms of Service</button>
          <span className="text-muted">|</span>
          <button onClick={() => setMode('privacy')} className={linkClasses}>Privacy Policy</button>
        </div>
        <p className="text-center text-sm text-muted">
          &copy; {currentYear} AI Editor. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};