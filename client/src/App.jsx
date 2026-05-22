import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import BreachResults from './components/BreachResults';
import DataBrokerList from './components/DataBrokerList';
import DataValueEstimator from './components/DataValueEstimator';
import SummaryBanner from './components/SummaryBanner';

export default function App() {
  // Breach data from HIBP (or mock)
  const [breachData, setBreachData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedEmail, setSearchedEmail] = useState('');

  // Data value from the estimator quiz
  const [estimatedValue, setEstimatedValue] = useState(0);

  // Opt-out progress from localStorage
  const [optedOutCount, setOptedOutCount] = useState(0);

  // Load opt-out count from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('datatrace_optouts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOptedOutCount(Object.values(parsed).filter(Boolean).length);
      } catch {
        // Corrupted localStorage — reset silently
        localStorage.removeItem('datatrace_optouts');
      }
    }
  }, []);

  // Called by DataBrokerList when checkbox state changes
  const handleOptOutChange = (count) => {
    setOptedOutCount(count);
  };

  // Called by HomePage when user submits email
  const handleSearch = async (email) => {
    setIsLoading(true);
    setSearchedEmail(email);
    setBreachData(null);

    try {
      const res = await fetch(`/api/breach/${encodeURIComponent(email)}`);
      const data = await res.json();
      setBreachData(data);
    } catch (err) {
      setBreachData({ error: 'Failed to connect to the server. Make sure the backend is running.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to breach results after search
  useEffect(() => {
    if (breachData && !breachData.error) {
      const el = document.getElementById('breach-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [breachData]);

  const breachCount = breachData?.breaches?.length ?? 0;
  const showSummary = breachData !== null && estimatedValue > 0;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-28">
      {/* Privacy banner — always at top */}
      <div className="bg-[#1A1A1A] border-b border-[#2D2D2D] py-3 px-4 text-center text-sm text-[#A0AEC0]">
        🔒 DataTrace does not store your email address or any personal information.
        Your email is sent directly to HaveIBeenPwned's encrypted API and is never saved to any database.
        Opt-out progress is stored locally in your browser only.
      </div>

      {/* Main page header */}
      <header className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-red-950 border border-red-800 text-red-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
          Business Ethics Project
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight mb-3">
          Data<span className="text-red-500">Trace</span>
        </h1>
        <p className="text-lg text-[#A0AEC0] max-w-xl mx-auto leading-relaxed">
          See how your personal data is exposed, which data brokers hold your information,
          and what your digital profile is worth to advertisers.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 space-y-16">
        {/* Feature 1: Email Breach Checker */}
        <section id="breach-checker">
          <HomePage onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Breach results — shown after search */}
        {(breachData || isLoading) && (
          <section id="breach-results">
            <BreachResults
              data={breachData}
              email={searchedEmail}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* Feature 2: Data Broker List */}
        <section id="brokers">
          <DataBrokerList
            breachDataClasses={breachData?.breaches?.flatMap(b => b.DataClasses) ?? []}
            onOptOutChange={handleOptOutChange}
          />
        </section>

        {/* Feature 3: Data Value Estimator */}
        <section id="estimator">
          <DataValueEstimator onValueChange={setEstimatedValue} />
        </section>
      </main>

      {/* Fixed summary banner at bottom */}
      {showSummary && (
        <SummaryBanner
          breachCount={breachCount}
          optedOutCount={optedOutCount}
          estimatedValue={estimatedValue}
          breachList={breachData?.breaches ?? []}
          email={searchedEmail}
          isMockMode={breachData?.mockMode ?? false}
        />
      )}
    </div>
  );
}
