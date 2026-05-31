import React, { useState } from 'react';

export default function HomePage({ onSearch, isLoading }) {
  const [email, setEmail] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputError('');
    const trimmed = email.trim();
    if (!trimmed) { setInputError('Please enter an email address.'); return; }
    if (!trimmed.includes('@') || !trimmed.includes('.')) { setInputError('Please enter a valid email address.'); return; }
    onSearch(trimmed);
  };

  return (
    <div className="card p-8">
      <h2 className="section-heading">Email Breach Checker</h2>
      <p className="text-[#A0AEC0] text-sm mb-6 leading-relaxed">
        Check if your email has appeared in known data breaches. Powered by{' '}
        <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
          HaveIBeenPwned
        </a>
        {' '}— a free, trusted service built by security researcher Troy Hunt.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="email-input" className="sr-only">Email address</label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (inputError) setInputError(''); }}
            placeholder="you@example.com"
            disabled={isLoading}
            className="w-full bg-[#0F0F0F] border border-[#3D3D3D] rounded-lg px-4 py-3 text-white placeholder-[#718096] focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors disabled:opacity-50 text-base"
            autoComplete="email"
            spellCheck={false}
          />
          {inputError && <p className="mt-1.5 text-xs text-red-400">{inputError}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="sm:w-44 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-6 py-3 transition-colors text-base flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Checking...
            </>
          ) : <>Check Breaches</>}
        </button>
      </form>

      <p className="mt-4 text-xs text-[#718096]">
        Your email is never stored. It is sent directly to HIBP's API and discarded immediately.
      </p>
    </div>
  );
}
