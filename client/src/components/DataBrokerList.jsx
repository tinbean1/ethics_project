import React, { useState, useEffect } from 'react';
import { BROKERS, CATEGORY_INFO, DATA_CLASS_TO_CATEGORY } from '../data/brokers';

const STORAGE_KEY = 'datatrace_optouts';
const CATEGORY_ORDER = ['Identity', 'Financial', 'Behavioral', 'Location', 'Purchase'];

const CATEGORY_ICONS = {
  Identity:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700' },
  Financial:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700' },
  Behavioral: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  Location:   { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  Purchase:   { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700' },
};

function CategoryIcon({ category, className }) {
  const cls = className || 'w-5 h-5';
  if (category === 'Identity') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M7 16h10"/>
      </svg>
    );
  }
  if (category === 'Financial') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
      </svg>
    );
  }
  if (category === 'Behavioral') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    );
  }
  if (category === 'Location') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
      </svg>
    );
  }
  if (category === 'Purchase') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    );
  }
  return null;
}

function loadOptOuts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function BrokerCard({ broker, isOptedOut, onToggle }) {
  const initial = broker.name[0].toUpperCase();
  return (
    <div className={`flex items-start gap-4 p-5 rounded-xl border transition-colors ${
      isOptedOut ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      {/* Logo */}
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
        {broker.logo ? (
          <>
            <img
              src={broker.logo}
              alt={broker.name}
              className="w-6 h-6 object-contain"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <span style={{display:'none'}} className="w-full h-full bg-gray-100 items-center justify-center font-bold text-gray-500 text-sm flex">
              {initial}
            </span>
          </>
        ) : (
          <span className="font-bold text-gray-500 text-sm">{initial}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <label
            htmlFor={`optout-${broker.id}`}
            className={`font-semibold text-base cursor-pointer ${isOptedOut ? 'line-through text-gray-400' : 'text-gray-900'}`}
          >
            {broker.name}
          </label>
          {isOptedOut && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              removal requested
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{broker.description}</p>
        <a
          href={broker.optOut}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { if (!isOptedOut) onToggle(broker.id); }}
          className="inline-flex items-center gap-1 mt-2 text-sm text-red-600 hover:underline font-medium"
        >
          Request removal
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5.5M9.5 2.5V6.5"/>
          </svg>
        </a>
      </div>

      <input
        type="checkbox"
        id={`optout-${broker.id}`}
        checked={isOptedOut}
        onChange={() => onToggle(broker.id)}
        className="w-4 h-4 rounded border-gray-300 accent-gray-900 cursor-pointer flex-shrink-0 mt-1"
      />
    </div>
  );
}

export default function DataBrokerList({ breachDataClasses, onOptOutChange }) {
  const [optOuts, setOptOuts] = useState(loadOptOuts);
  const [selectedCategory, setSelectedCategory] = useState('Identity');

  const atRiskCategories = new Set(
    (breachDataClasses ?? []).flatMap(dc => DATA_CLASS_TO_CATEGORY[dc] ?? [])
  );

  useEffect(() => {
    const count = Object.values(optOuts).filter(Boolean).length;
    onOptOutChange?.(count);
  }, [optOuts, onOptOutChange]);

  const handleToggle = (brokerId) => {
    setOptOuts(prev => {
      const updated = { ...prev, [brokerId]: !prev[brokerId] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const totalOptedOut = Object.values(optOuts).filter(Boolean).length;
  const progressPercent = Math.round((totalOptedOut / BROKERS.length) * 100);

  const info = CATEGORY_INFO[selectedCategory];
  const categoryBrokers = BROKERS.filter(b => b.category === selectedCategory);
  const optedOutInCategory = categoryBrokers.filter(b => optOuts[b.id]).length;
  const style = CATEGORY_ICONS[selectedCategory];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Data Brokers Holding Your Information</h2>
        <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
          These are real companies that likely have a file on you — even though you've never heard of most of them.
          Select a category to learn what they do and how to request removal of your data.
        </p>
        <p className="text-xs text-gray-400">
          Sourced from the{' '}
          <a href="https://www.eff.org/issues/privacy" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">EFF</a>
          {' '}and{' '}
          <a href="https://www.ftc.gov/reports/data-brokers" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">FTC Data Broker Report</a>.
          {' '}Opt-out progress is saved in your browser only.
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900">Removal Requests Submitted</p>
          <p className="text-sm text-gray-500">{totalOptedOut} / {BROKERS.length} brokers</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gray-900 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {totalOptedOut === 0
            ? 'Click "Request removal" on any broker to open their official opt-out page.'
            : `${progressPercent}% complete — removals typically take 30–45 days to process.`}
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-8 items-start">

        {/* Left panel — category tiles */}
        <div className="hidden lg:block w-56 flex-shrink-0 sticky top-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Browse by category
          </p>
          <div className="space-y-2">
            {CATEGORY_ORDER.map(cat => {
              const s = CATEGORY_ICONS[cat];
              const brokers = BROKERS.filter(b => b.category === cat);
              const opted = brokers.filter(b => optOuts[b.id]).length;
              const isSelected = cat === selectedCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    isSelected
                      ? `${s.bg} ${s.border} ${s.text}`
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={cat} className="w-5 h-5" />
                    <span className="font-semibold text-sm">{cat}</span>
                  </div>
                  <p className="text-xs mt-0.5 opacity-70">{opted}/{brokers.length} removed</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile category selector */}
        <div className="lg:hidden w-full">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORY_ORDER.map(cat => {
              const s = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                    cat === selectedCategory
                      ? `${s.bg} ${s.border} ${s.text}`
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  <CategoryIcon category={cat} className="w-4 h-4" />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel — category detail */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Category header — always visible */}
          <div className={`${style.bg} ${style.border} border rounded-xl p-6`}>
            <div className="flex items-center gap-3 mb-3">
              <CategoryIcon category={selectedCategory} className="w-6 h-6" />
              <h3 className={`text-xl font-bold ${style.text}`}>{info.title}</h3>
              <span className="ml-auto text-sm text-gray-500">{optedOutInCategory}/{categoryBrokers.length} removed</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">{info.description}</p>
            <div className="bg-white bg-opacity-60 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">How they get your data</p>
              <p className="text-sm text-gray-600 leading-relaxed">{info.howTheyGetData}</p>
            </div>
          </div>

          {/* Broker list */}
          <div className="space-y-2">
            {categoryBrokers.map(broker => (
              <BrokerCard
                key={broker.id}
                broker={broker}
                isOptedOut={!!optOuts[broker.id]}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
