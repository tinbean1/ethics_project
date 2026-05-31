import React, { useState, useEffect } from 'react';
import DataBrokerList from './components/DataBrokerList';
import DataValueEstimator from './components/DataValueEstimator';
import TermsComparison from './components/TermsComparison';

const TABS = [
  { id: 'value', label: 'Data Value' },
  { id: 'brokers', label: 'Data Brokers' },
  { id: 'terms', label: 'Terms & Conditions' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('value');
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

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-gray-900 pb-28">
      {/* Privacy banner */}
      <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-3 px-4 text-center text-sm text-[#6B7280]">
        DataTrace does not store your email address or any personal information.
        Opt-out progress is stored locally in your browser only.
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-6 text-center">
          <h1 className="text-5xl font-black text-[#111827] tracking-tight mb-4">
            Data<span className="text-red-600">Trace</span>
          </h1>
          <p className="text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Understand how your personal data is exposed, which data brokers hold your information,
            and what your digital profile is worth to advertisers.
          </p>
        </div>

        {/* Tab bar */}
        <div className="max-w-6xl mx-auto px-4">
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

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {activeTab === 'value' && (
          <DataValueEstimator onValueChange={setEstimatedValue} />
        )}

        {activeTab === 'brokers' && (
          <DataBrokerList
            breachDataClasses={[]}
            onOptOutChange={handleOptOutChange}
          />
        )}

        {activeTab === 'terms' && (
          <TermsComparison />
        )}
      </main>
    </div>
  );
}
