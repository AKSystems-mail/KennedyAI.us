import React from 'react';

const JokeBookPrivacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <header className="border-b border-gray-200 pb-8">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2 mb-4">
             <span className="bg-amber-400 text-black px-1.5 py-0.5 rounded shadow-sm -rotate-2 text-lg">JB</span>
             <span>JOKE BOOK</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-500">Last Updated: January 24, 2026</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="leading-relaxed text-gray-700">
            Welcome to JokeBook ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <p className="leading-relaxed text-gray-700">
            <strong>Personal Data:</strong> We may collect personal information such as your email address if you choose to create an account or contact support.
          </p>
          <p className="leading-relaxed text-gray-700">
            <strong>User Content:</strong> The jokes, bits, sets, and audio recordings you create within the app are stored securely to provide the service. You retain full ownership of your creative content.
          </p>
          <p className="leading-relaxed text-gray-700">
             <strong>Usage Data:</strong> We may collect anonymous usage data to help us improve the app's performance and user experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>To provide and maintain the JokeBook service.</li>
            <li>To manage your account and sync your data across devices.</li>
            <li>To provide customer support.</li>
            <li>To improve the functionality and features of the app.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Data Security</h2>
          <p className="leading-relaxed text-gray-700">
            We implement appropriate technical and organizational security measures to protect your data. However, please be aware that no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Contact Us</h2>
          <p className="leading-relaxed text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at: <br />
            <a href="mailto:aksystems.mail@gmail.com" className="text-amber-600 font-medium hover:underline">
              aksystems.mail@gmail.com
            </a>
          </p>
        </section>

        <footer className="pt-8 border-t border-gray-200 mt-12">
            <a href="/jokebook" className="text-amber-600 font-medium hover:text-amber-700 transition-colors">
                &larr; Back to JokeBook
            </a>
        </footer>

      </div>
    </div>
  );
};

export default JokeBookPrivacy;
