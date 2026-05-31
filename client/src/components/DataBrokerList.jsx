import React, { useState, useEffect } from 'react';
import { BROKERS, CATEGORY_INFO, DATA_CLASS_TO_CATEGORY } from '../data/brokers';

const STORAGE_KEY = 'datatrace_optouts';
const CATEGORY_ORDER = ['Identity', 'Financial', 'Behavioral', 'Location', 'Purchase'];

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

function BrokerCard({ broker, isOptedOut, isAtRisk, onToggle }) {
  return (
    <div className={`flex items-start gap-4 p-5 rounded-xl border transition-colors ${
      isOptedOut
        ? 'bg-gray-50 border-gray-200'
        : isAtRisk
          ? 'bg-red-50 border-red-200 hover:border-red-300'
          : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <input
        type="checkbox"
        id={`optout-${broker.id}`}
        checked={isOptedOut}
        onChange={() => onToggle(broker.id)}
        className="w-4 h-4 rounded border-gray-300 accent-gray-900 cursor-pointer flex-shrink-0 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <label
            htmlFor={`optout-${broker.id}`}
            className={`font-semibold text-base cursor-pointer ${isOptedOut ? 'line-through text-gray-400' : 'text-gray-900'}`}
          >
            {broker.name}
          </label>
          {isAtRisk && !isOptedOut && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              matches your breach data
            </span>
          )}
          {isOptedOut && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              removal requested
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{broker.description}</p>
      </div>
      <a
        href={broker.optOut}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { if (!isOptedOut) onToggle(broker.id); }}
        className="text-sm text-red-600 hover:underline font-medium whitespace-nowrap transition-colors flex items-center gap-1 flex-shrink-0 mt-0.5"
        title={`Request removal from ${broker.name}`}
      >
        Request removal
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5.5M9.5 2.5V6.5"/>
        </svg>
      </a>
    </div>
  );
}

function CategorySection({ category, brokers, optOuts, atRiskCategories, onToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const info = CATEGORY_INFO[category];
  const isAtRisk = atRiskCategories.has(category);
  const categoryBrokers = brokers.filter(b => b.category === category);
  const optedOutInCategory = categoryBrokers.filter(b => optOuts[b.id]).length;

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${
      isAtRisk ? 'border-red-200' : 'border-gray-200'
    }`}>
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors ${
          isAtRisk ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900 text-base">{info.title}</span>
          {isAtRisk && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              at risk from your breaches
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-gray-500">
            {optedOutInCategory}/{categoryBrokers.length} removed
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 bg-white border-t border-gray-200">
          <p className="text-sm text-gray-600 leading-relaxed pt-5 mb-3">{info.description}</p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">How they get your data</p>
            <p className="text-xs text-gray-600 leading-relaxed">{info.howTheyGetData}</p>
          </div>
          <div className="space-y-2">
            {categoryBrokers.map(broker => (
              <BrokerCard
                key={broker.id}
                broker={broker}
                isOptedOut={!!optOuts[broker.id]}
                isAtRisk={atRiskCategories.has(broker.category)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DataBrokerList({ breachDataClasses, onOptOutChange }) {
  const [optOuts, setOptOuts] = useState(loadOptOuts);

  const atRiskCategories = new Set(
    breachDataClasses.flatMap(dc => DATA_CLASS_TO_CATEGORY[dc] ?? [])
  );

  useEffect(() => {
    const count = Object.values(optOuts).filter(Boolean).length;
    onOptOutChange(count);
  }, [optOuts, onOptOutChange]);

  const handleToggle = (brokerId) => {
    setOptOuts(prev => {
      const updated = { ...prev, [brokerId]: !prev[brokerId] };
      saveOptOuts(updated);
      return updated;
    });
  };

  const totalOptedOut = Object.values(optOuts).filter(Boolean).length;
  const progressPercent = Math.round((totalOptedOut / BROKERS.length) * 100);

  return (
    <div className="card p-8">
      <h2 className="section-heading mb-8">Known Data Brokers</h2>

      <div className="source-disclaimer mb-8">
        <strong className="text-gray-900">About this list:</strong> The following data brokers are
        real companies documented by the{' '}
        <a href="https://www.eff.org/issues/privacy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
          Electronic Frontier Foundation (EFF)
        </a>
        {' '}and{' '}
        <a href="https://www.ftc.gov/reports/data-brokers" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
          Federal Trade Commission (FTC)
        </a>
        . We cannot confirm which specific brokers have <em>your</em> data —
        this is the known industry landscape. Opt-out processes vary by company and
        may take days to weeks to process.
      </div>

      {/* Progress tracker */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900">Removal Requests</p>
          <p className="text-sm text-gray-600">
            <span className="text-gray-900 font-bold">{totalOptedOut}</span>
            {' '}/{' '}
            <span>{BROKERS.length}</span> removals requested
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-gray-900 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          {totalOptedOut === 0
            ? 'Click "Request removal" on each broker to open their opt-out page.'
            : totalOptedOut === BROKERS.length
              ? 'You have requested removal from all 40 known data brokers.'
              : `${progressPercent}% complete — ${BROKERS.length - totalOptedOut} remaining`}
        </p>
      </div>

      {atRiskCategories.size > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-red-600 flex-shrink-0 text-base">!</span>
          <div>
            <p className="text-red-700 font-semibold text-sm">Breach-correlated categories</p>
            <p className="text-red-600 text-xs mt-0.5">
              Your breach results exposed:{' '}
              <strong className="text-red-700">{[...atRiskCategories].join(', ')}</strong> data.
              Brokers in these categories are flagged — consider prioritizing them.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {CATEGORY_ORDER.map(category => (
          <CategorySection
            key={category}
            category={category}
            brokers={BROKERS}
            optOuts={optOuts}
            atRiskCategories={atRiskCategories}
            onToggle={handleToggle}
          />
        ))}
      </div>

      <p className="mt-6 text-xs text-gray-400 border-t border-gray-200 pt-4">
        Sources: EFF's{' '}
        <a href="https://www.eff.org/issues/privacy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
          Privacy Issues
        </a>
        {' '}pages and the FTC's{' '}
        <a href="https://www.ftc.gov/reports/data-brokers" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
          Data Broker Report (2014)
        </a>
        . Your opt-out progress is saved in this browser only and is never uploaded anywhere.
      </p>
    </div>
  );
}
