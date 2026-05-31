import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import BreachResults from './components/BreachResults';
import DataBrokerList from './components/DataBrokerList';
import DataValueEstimator from './components/DataValueEstimator';
import SummaryBanner from './components/SummaryBanner';

const TABS = [
  { id: 'breach', label: 'Breach Check' },
  { id: 'brokers', label: 'Data Brokers' },
  { id: 'value', label: 'Data Value' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('breach');
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
    setActiveTab('breach');
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

  const breachCount = breachData?.breaches?.length ?? 0;
  const showSummary = breachData !== null && estimatedValue > 0;
  const breachDataClasses = breachData?.breaches?.flatMap(b => b.DataClasses) ?? [];

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-gray-900 pb-28">
      {/* Privacy banner */}
      <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-3 px-4 text-center text-sm text-[#6B7280]">
        DataTrace does not store your email address or any personal information.
        Your email is sent directly to HaveIBeenPwned's API and is never saved to any database.
        Opt-out progress is stored locally in your browser only.
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 text-center">
          <h1 className="text-5xl font-black text-[#111827] tracking-tight mb-4">
            Data<span className="text-red-600">Trace</span>
          </h1>
          <p className="text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Understand how your personal data is exposed, which data brokers hold your information,
            and what your digital profile is worth to advertisers.
          </p>
        </div>

        {/* Tab bar */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-[#111827] border-[#111827]'
                    : 'text-[#6B7280] border-transparent hover:text-[#111827]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {activeTab === 'breach' && (
          <>
            <HomePage onSearch={handleSearch} isLoading={isLoading} />
            {(breachData || isLoading) && (
              <BreachResults data={breachData} email={searchedEmail} isLoading={isLoading} />
            )}
          </>
        )}

        {activeTab === 'brokers' && (
          <DataBrokerList
            breachDataClasses={breachDataClasses}
            onOptOutChange={handleOptOutChange}
          />
        )}

        {activeTab === 'value' && (
          <DataValueEstimator onValueChange={setEstimatedValue} />
        )}
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
