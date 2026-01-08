import React from 'react';
import { IconCheck } from './icons/IconCheck';
import { IconSparkles } from './icons/IconSparkles';

const FeatureList = ({ features }: { features: string[] }) => (
  <ul className="space-y-4 text-left">
    {features.map((feature, index) => (
      <li key={index} className="flex items-center gap-3">
        <IconCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
        <span className="text-subtle">{feature}</span>
      </li>
    ))}
  </ul>
);

export const PricingPage = () => {
  const features = [
    "Unlimited image edits, merges, and generations",
    "High-resolution image outputs",
    "Access to all creative tools (Editor, Merger, Generator)",
    "No watermarks on your creations",
    "No account or sign-up required",
    "Privacy-focused: we don't store your images"
  ];

  return (
    <div className="w-full max-w-4xl animate-fade-in text-center">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <IconSparkles className="w-4 h-4" />
            <span>Completely Free</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-text">Unleash Your Creativity, For Free</h2>
        <p className="text-lg text-subtle mt-4 max-w-2xl mx-auto">
          We believe everyone should have access to powerful creative tools. That's why AI Editor is completely free to use, with no hidden fees or subscriptions.
        </p>
      </div>

      <div className="bg-surface border border-primary/30 rounded-2xl p-8 sm:p-12 shadow-glow-primary flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-text text-left">All Features Included</h3>
          <div className="mt-8">
              <FeatureList features={features} />
          </div>
        </div>
        <div className="flex-shrink-0 text-center p-8 bg-background/50 border border-muted/30 rounded-xl">
            <span className="text-6xl font-extrabold text-text">$0</span>
            <span className="text-subtle ml-2 text-lg">/ forever</span>
            <p className="text-sm text-muted mt-2">No credit card, no sign up.<br/>Just create.</p>
        </div>
      </div>
    </div>
  );
};
