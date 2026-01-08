import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { IconArrowLeft } from '../icons/IconArrowLeft';

export const PrivacyPolicy = () => {
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
        <h2 className="text-4xl md:text-5xl font-extrabold text-text">Privacy Policy</h2>
        <p className="text-lg text-subtle mt-4">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-invert prose-lg bg-surface border border-muted/50 rounded-2xl p-8 mx-auto text-subtle">
        <h3>1. Introduction</h3>
        <p>
          Welcome to AI Editor. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
        </p>

        <h3>2. Collection of Your Information</h3>
        <p>
          We may collect information about you in a variety of ways. The information we may collect via the Application includes:
        </p>
        <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the Application.</li>
            <li><strong>Uploaded Images:</strong> Images you upload for processing are sent to our AI service provider to fulfill your request. We do not store your images on our servers after the request is completed.</li>
        </ul>
        
        <h3>3. Use of Your Information</h3>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
        </p>
        <ul>
            <li>Create and manage your account.</li>
            <li>Email you regarding your account or order.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
        </ul>

        <h3>4. Security of Your Information</h3>
        <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>
      </div>
    </div>
  );
};