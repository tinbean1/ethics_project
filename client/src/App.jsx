import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import BreachResults from './components/BreachResults';
import DataBrokerList from './components/DataBrokerList';
import DataValueEstimator from './components/DataValueEstimator';
import SummaryBanner from './components/SummaryBanner';

export default function App() {
  const [breachData, setBreachData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedEmail, setSearchedEmail] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [optedOutCount, setOptedOutCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('datatrace_optouts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOptedOutCount(Object.values(parsed).filter(Boolean).length);
      } catch {
        localStorage.removeItem('datatrace_optouts');
      }
    }
  }, []);

  const handleOptOutChange = (count) => setOptedOutCount(count);

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
      <div className="bg-[#1A1A1A] border-b border-[#2D2D2D] py-3 px-4 text-center text-sm text-[#718096]">
        DataTrace does not store your email address or any personal information.
        Your email is sent directly to HaveIBeenPwned's API and is never saved to any database.
        Opt-out progress is stored locally in your browser only.
      </div>

      <header className="max-w-4xl mx-auto px-4 pt-14 pb-8 text-center">
        <h1 className="text-5xl font-black text-white tracking-tight mb-4">
          Data<span className="text-red-500">Trace</span>
        </h1>
        <p className="text-lg text-[#A0AEC0] max-w-xl mx-auto leading-relaxed">
          Understand how your personal data is exposed, which data brokers hold your information,
          and what your digital profile is worth to advertisers.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="max-w-4xl mx-auto">
          <section id="breach-checker">
            <HomePage onSearch={handleSearch} isLoading={isLoading} />
          </section>
        </div>

        {(breachData || isLoading) ? (
          <section id="breach-results">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="lg:sticky lg:top-6">
                <BreachResults data={breachData} email={searchedEmail} isLoading={isLoading} />
              </div>
              <div>
                <DataBrokerList
                  breachDataClasses={breachData?.breaches?.flatMap(b => b.DataClasses) ?? []}
                  onOptOutChange={handleOptOutChange}
                />
              </div>
            </div>
          </section>
        ) : (
          <section id="brokers">
            <div className="max-w-4xl mx-auto">
              <DataBrokerList
                breachDataClasses={[]}
                onOptOutChange={handleOptOutChange}
              />
            </div>
          </section>
        )}

        <section id="estimator">
          <div className="max-w-4xl mx-auto">
            <DataValueEstimator onValueChange={setEstimatedValue} />
          </div>
        </section>
      </main>

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
