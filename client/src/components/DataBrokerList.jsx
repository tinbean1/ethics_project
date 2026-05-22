import React, { useState, useEffect } from 'react';
import { BROKERS, DATA_CLASS_TO_CATEGORY } from '../data/brokers';

/**
 * Feature 2 — Data Broker List.
 * Shows 40 real data brokers documented by the EFF and FTC.
 * Lets users track their opt-out progress (stored in localStorage).
 * Highlights brokers that deal in data categories exposed in the user's breaches.
 */

const FILTER_TABS = ['All', 'Financial', 'Identity', 'Behavioral', 'Location', 'Purchase'];

const CATEGORY_COLORS = {
  Financial:  'bg-yellow-950 text-yellow-300 border-yellow-800',
  Identity:   'bg-blue-950 text-blue-300 border-blue-800',
  Behavioral: 'bg-purple-950 text-purple-300 border-purple-800',
  Location:   'bg-green-950 text-green-300 border-green-800',
  Purchase:   'bg-orange-950 text-orange-300 border-orange-800'
};

const STORAGE_KEY = 'datatrace_optouts';

function loadOptOuts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOptOuts(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function DataBrokerList({ breachDataClasses, onOptOutChange }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [optOuts, setOptOuts] = useState(loadOptOuts);

  // Figure out which categories are "at risk" based on breach data classes
  const atRiskCategories = new Set(
    breachDataClasses.flatMap(dc => DATA_CLASS_TO_CATEGORY[dc] ?? [])
  );

  // Notify parent whenever optout count changes
  useEffect(() => {
    const count = Object.values(optOuts).filter(Boolean).length;
    onOptOutChange(count);
  }, [optOuts, onOptOutChange]);

  const handleOptOutToggle = (brokerId) => {
    setOptOuts(prev => {
      const updated = { ...prev, [brokerId]: !prev[brokerId] };
      saveOptOuts(updated);
      return updated;
    });
  };

  // Filter brokers by active tab
  const filteredBrokers = activeFilter === 'All'
    ? BROKERS
    : BROKERS.filter(b => b.category === activeFilter);

  const totalOptedOut = Object.values(optOuts).filter(Boolean).length;
  const progressPercent = Math.round((totalOptedOut / BROKERS.length) * 100);

  return (
    <div className="card p-8">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-orange-400 text-xl">🗄️</span>
        <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest">
          Feature 2
        </span>
      </div>

      <h2 className="section-heading">Known Data Brokers</h2>

      {/* Honest framing disclaimer — required by project spec */}
      <div className="source-disclaimer">
        <strong className="text-white">About this list:</strong> The following data brokers are
        real companies documented by the{' '}
        <a href="https://www.eff.org/issues/privacy" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
          Electronic Frontier Foundation (EFF)
        </a>
        {' '}and{' '}
        <a href="https://www.ftc.gov/reports/data-brokers" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
          Federal Trade Commission (FTC)
        </a>
        . We cannot confirm which specific brokers have <em>your</em> data —
        this is the known industry landscape. Opt-out processes vary by company and
        may take days to weeks to process.
      </div>

      {/* Opt-out progress bar */}
      <div className="bg-[#0F0F0F] border border-[#2D2D2D] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-white">Your Opt-Out Progress</p>
          <p className="text-sm text-[#A0AEC0]">
            <span className="text-white font-bold">{totalOptedOut}</span>
            {' '}/{' '}
            <span>{BROKERS.length}</span> opted out
          </p>
        </div>
        <div className="w-full bg-[#2D2D2D] rounded-full h-2.5">
          <div
            className="bg-red-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-[#718096] mt-1.5">
          {totalOptedOut === 0
            ? 'Visit each broker\'s opt-out page and check the box when complete.'
            : totalOptedOut === BROKERS.length
              ? '✅ You\'ve opted out of all 40 known brokers!'
              : `${progressPercent}% complete — keep going!`}
        </p>
      </div>

      {/* At-risk alert — shown only when breach data exposes relevant categories */}
      {atRiskCategories.size > 0 && (
        <div className="bg-red-950 border border-red-800 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="text-red-300 font-semibold text-sm">Breach-correlated risk</p>
            <p className="text-red-600 text-xs mt-0.5">
              Your breach results exposed:{' '}
              <strong className="text-red-400">{[...atRiskCategories].join(', ')}</strong> data.
              Brokers in these categories are flagged below — consider prioritizing them.
            </p>
          </div>
        </div>
      )}

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors font-medium ${
              activeFilter === tab
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-[#1A1A1A] border-[#3D3D3D] text-[#A0AEC0] hover:border-[#718096]'
            }`}
          >
            {tab}
            {tab !== 'All' && (
              <span className="ml-1.5 text-xs opacity-60">
                ({BROKERS.filter(b => b.category === tab).length})
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#718096] self-center">
          {BROKERS.length} known data brokers in this industry
        </span>
      </div>

      {/* Broker rows */}
      <div className="space-y-2">
        {filteredBrokers.map(broker => {
          const isOptedOut = !!optOuts[broker.id];
          const isAtRisk = atRiskCategories.has(broker.category);

          return (
            <div
              key={broker.id}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
                isOptedOut
                  ? 'bg-[#0F0F0F] border-[#2D2D2D] opacity-60'
                  : isAtRisk
                    ? 'bg-red-950/30 border-red-900/50 hover:border-red-800/70'
                    : 'bg-[#0F0F0F] border-[#2D2D2D] hover:border-[#3D3D3D]'
              }`}
            >
              {/* Opt-out checkbox */}
              <input
                type="checkbox"
                id={`optout-${broker.id}`}
                checked={isOptedOut}
                onChange={() => handleOptOutToggle(broker.id)}
                className="w-4 h-4 rounded border-[#3D3D3D] bg-[#0F0F0F] accent-red-500 cursor-pointer flex-shrink-0"
              />

              {/* Broker name */}
              <label
                htmlFor={`optout-${broker.id}`}
                className={`font-medium text-sm flex-1 cursor-pointer ${
                  isOptedOut ? 'line-through text-[#718096]' : 'text-white'
                }`}
              >
                {broker.name}
                {isAtRisk && !isOptedOut && (
                  <span className="ml-2 text-xs text-red-400 font-normal">⚠️ matched breach data</span>
                )}
              </label>

              {/* Category badge */}
              <span className={`text-xs px-2 py-0.5 rounded-full border hidden sm:inline-flex ${CATEGORY_COLORS[broker.category]}`}>
                {broker.category}
              </span>

              {/* Opt-out link */}
              <a
                href={broker.optOut}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Auto-check the box when user clicks opt-out (convenience)
                  if (!isOptedOut) handleOptOutToggle(broker.id);
                }}
                className="text-xs text-red-400 hover:text-red-300 font-medium whitespace-nowrap transition-colors flex items-center gap-1"
                title={`Opt out from ${broker.name}`}
              >
                Opt out
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5.5M9.5 2.5V6.5"/>
                </svg>
              </a>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <p className="mt-6 text-xs text-[#718096] border-t border-[#2D2D2D] pt-4">
        Sources: EFF's{' '}
        <a href="https://www.eff.org/issues/privacy" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
          Privacy Issues
        </a>
        {' '}pages and the FTC's{' '}
        <a href="https://www.ftc.gov/reports/data-brokers" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
          Data Broker Report (2014)
        </a>
        . Your opt-out progress is saved in this browser only and is never uploaded anywhere.
      </p>
    </div>
  );
}
