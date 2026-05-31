import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import CountUp from 'react-countup';
import SourceTooltip from './SourceTooltip';
import { SOURCES } from '../data/sources';

// Quiz question definitions
const QUESTIONS = [
  {
    id: 'age',
    label: 'Your age range',
    type: 'single',
    options: ['18–24', '25–34', '35–44', '45–54', '55+']
  },
  {
    id: 'platforms',
    label: 'Social platforms you actively use',
    type: 'multi',
    options: ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Twitter/X', 'Snapchat', 'YouTube', 'None']
  },
  {
    id: 'shopping',
    label: 'How often do you shop online?',
    type: 'single',
    options: ['Rarely', 'Sometimes', 'Frequently']
  },
  {
    id: 'google',
    label: 'Do you use Google products? (Gmail, Maps, Chrome, Search)',
    type: 'single',
    options: ['Yes, most of them', 'Some', 'No']
  },
  {
    id: 'location',
    label: 'Where do you live?',
    type: 'single',
    options: ['Urban', 'Suburban', 'Rural']
  },
  {
    id: 'income',
    label: 'Income bracket (optional)',
    type: 'single',
    optional: true,
    options: ['Under $30k', '$30–60k', '$60–100k', '$100k+', 'Prefer not to say']
  }
];

// Platform per-user-per-year ad revenue values from public earnings reports
const PLATFORM_VALUES = {
  Facebook:   { value: 62.39, source: SOURCES.facebook },
  Instagram:  { value: 11.96, source: SOURCES.instagram },
  TikTok:     { value: 7.28,  source: SOURCES.tiktok },
  LinkedIn:   { value: 24.50, source: SOURCES.linkedin },
  'Twitter/X':{ value: 5.87,  source: SOURCES.twitter },
  YouTube:    { value: 18.43, source: SOURCES.youtube },
  Snapchat:   { value: 7.12,  source: SOURCES.snapchat }
};

// Real 2023 platform ad revenues for the industry bar chart
const PLATFORM_REVENUE_DATA = [
  { name: 'Alphabet',  revenue: 237.8, color: '#4285F4' },
  { name: 'Meta',      revenue: 131.9, color: '#1877F2' },
  { name: 'TikTok',    revenue: 18.0,  color: '#010101' },
  { name: 'LinkedIn',  revenue: 15.0,  color: '#0A66C2' },
  { name: 'Snap',      revenue: 4.6,   color: '#FFFC00' },
  { name: 'Twitter/X', revenue: 2.5,   color: '#1DA1F2' }
];

const PIE_COLORS = [
  '#E53E3E', '#FC8181', '#FEB2B2',
  '#F6AD55', '#F6E05E', '#68D391',
  '#63B3ED', '#B794F4', '#A0AEC0'
];

function QuestionCard({ question, answers, onAnswer }) {
  const current = answers[question.id];

  const handleClick = (option) => {
    if (question.type === 'multi') {
      const existing = Array.isArray(current) ? current : [];
      if (option === 'None') {
        // "None" clears all other selections
        onAnswer(question.id, existing.includes('None') ? [] : ['None']);
        return;
      }
      const withoutNone = existing.filter(o => o !== 'None');
      const updated = withoutNone.includes(option)
        ? withoutNone.filter(o => o !== option)
        : [...withoutNone, option];
      onAnswer(question.id, updated);
    } else {
      onAnswer(question.id, current === option ? null : option);
    }
  };

  const isSelected = (option) => {
    if (question.type === 'multi') {
      return Array.isArray(current) && current.includes(option);
    }
    return current === option;
  };

  return (
    <div className="card p-6">
      <p className="font-semibold text-white mb-1">{question.label}</p>
      {question.optional && (
        <p className="text-xs text-[#718096] mb-3">Optional — skip if you prefer</p>
      )}
      {question.type === 'multi' && (
        <p className="text-xs text-[#718096] mb-3">Select all that apply</p>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        {question.options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => handleClick(opt)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              isSelected(opt)
                ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/30'
                : 'bg-[#0F0F0F] border-[#3D3D3D] text-[#A0AEC0] hover:border-[#718096] hover:text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function computeValue(answers) {
  let total = 35; // Base value
  const breakdown = [{ name: 'Base profile', value: 35 }];

  const platforms = Array.isArray(answers.platforms) ? answers.platforms : [];
  platforms.forEach(platform => {
    const pv = PLATFORM_VALUES[platform];
    if (pv) {
      total += pv.value;
      breakdown.push({ name: platform, value: pv.value });
    }
  });

  if (answers.shopping === 'Frequently') {
    total += 22;
    breakdown.push({ name: 'Frequent shopper', value: 22 });
  } else if (answers.shopping === 'Sometimes') {
    total += 11;
    breakdown.push({ name: 'Online shopper', value: 11 });
  }

  if (answers.google === 'Yes, most of them') {
    total += 41.60;
    breakdown.push({ name: 'Google ecosystem', value: 41.60 });
  } else if (answers.google === 'Some') {
    total += 20;
    breakdown.push({ name: 'Partial Google use', value: 20 });
  }

  if (answers.location === 'Urban') {
    total += 14;
    breakdown.push({ name: 'Urban location', value: 14 });
  }

  if (['25–34', '35–44'].includes(answers.age)) {
    total += 18;
    breakdown.push({ name: 'Prime age demo', value: 18 });
  }

  if (['$60–100k', '$100k+'].includes(answers.income)) {
    total += 23;
    breakdown.push({ name: 'Higher income', value: 23 });
  }

  return { total: Math.round(total * 100) / 100, breakdown };
}

const NETFLIX_MONTHLY = 15.49;
const STARBUCKS_LATTE = 6.50;
const FEDERAL_MIN_WAGE = 7.25;

// Custom tooltip for pie chart
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg px-3 py-2 text-sm">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-red-400">${payload[0].value.toFixed(2)}/year</p>
        <p className="text-[#718096] text-xs">
          {Math.round((payload[0].value / payload[0].payload.total) * 100)}% of total
        </p>
      </div>
    );
  }
  return null;
}

// Custom tooltip for bar chart
function CustomBarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg px-3 py-2 text-sm">
        <p className="text-white font-semibold">{label}</p>
        <p className="text-red-400">${payload[0].value}B ad revenue (2023)</p>
      </div>
    );
  }
  return null;
}

export default function DataValueEstimator({ onValueChange }) {
  const [answers, setAnswers] = useState({});
  const [prevTotal, setPrevTotal] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Check if enough questions are answered to show results
  const answeredRequired = QUESTIONS
    .filter(q => !q.optional)
    .every(q => {
      const a = answers[q.id];
      if (q.type === 'multi') return Array.isArray(a) && a.length > 0;
      return a !== null && a !== undefined;
    });

  const { total, breakdown } = computeValue(answers);

  useEffect(() => {
    if (answeredRequired) {
      setPrevTotal(v => v);
      setShowResults(true);
      onValueChange(total);
    }
  }, [answers, answeredRequired, total, onValueChange]);

  // Enrich breakdown items for tooltip
  const enrichedBreakdown = breakdown.map(item => ({ ...item, total }));

  const netflixMonths = (total / NETFLIX_MONTHLY).toFixed(1);
  const lattesCount = Math.round(total / STARBUCKS_LATTE);
  const workHours = (total / FEDERAL_MIN_WAGE).toFixed(1);

  return (
    <div className="card p-8">
      <h2 className="section-heading">What Is Your Data Worth?</h2>

      <div className="source-disclaimer mb-6">
        <strong className="text-white">These are estimates</strong> based on publicly available data from
        Meta, Alphabet, and TikTok quarterly earnings reports, and academic research from
        Vanderbilt University and the Financial Times.
        Your actual value to advertisers may vary. Hover the{' '}
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#3D3D3D] text-[#A0AEC0] text-[10px] font-bold">i</span>
        {' '}icons for exact sources.
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-8">
        {QUESTIONS.map(q => (
          <QuestionCard
            key={q.id}
            question={q}
            answers={answers}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

      {/* Results — shown only when required questions answered */}
      {showResults && (
        <div className="space-y-8">
          {/* Animated total */}
          <div className="bg-[#0F0F0F] border border-[#2D2D2D] rounded-xl p-8 text-center">
            <p className="text-[#A0AEC0] text-sm mb-2">
              Estimated annual value of your data to advertisers
            </p>
            <p className="text-6xl font-black text-white mb-1">
              $<CountUp
                start={prevTotal}
                end={total}
                decimals={2}
                duration={1.5}
                separator=","
              />
            </p>
            <p className="text-[#718096] text-xs">per year — estimated based on published earnings reports</p>
          </div>

          {/* Comparisons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0F0F0F] border border-[#2D2D2D] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{netflixMonths}</p>
              <p className="text-xs text-[#A0AEC0] mt-1">months of Netflix</p>
              <p className="text-xs text-[#718096]">($15.49/month)</p>
            </div>
            <div className="bg-[#0F0F0F] border border-[#2D2D2D] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{lattesCount}</p>
              <p className="text-xs text-[#A0AEC0] mt-1">Starbucks lattes</p>
              <p className="text-xs text-[#718096]">($6.50 each)</p>
            </div>
            <div className="bg-[#0F0F0F] border border-[#2D2D2D] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{workHours}</p>
              <p className="text-xs text-[#A0AEC0] mt-1">hours of min-wage work</p>
              <p className="text-xs text-[#718096]">($7.25 federal minimum)</p>
            </div>
          </div>

          {/* Breakdown pie chart */}
          <div>
            <h3 className="font-semibold text-white mb-1">Where your value comes from</h3>
            <p className="text-xs text-[#718096] mb-4">
              Estimated — based on platform ARPU figures from public earnings disclosures
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enrichedBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : null
                    }
                    labelLine={true}
                  >
                    {enrichedBreakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown itemized list with source citations */}
          <div>
            <h3 className="font-semibold text-white mb-3">Detailed breakdown</h3>
            <div className="space-y-2">
              {breakdown.map((item, i) => {
                const sourceKey = Object.keys(SOURCES).find(k =>
                  SOURCES[k].label.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
                );
                const source = sourceKey ? SOURCES[sourceKey] : null;

                return (
                  <div key={item.name} className="flex items-center gap-3 px-4 py-2.5 bg-[#0F0F0F] border border-[#2D2D2D] rounded-lg">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    ></span>
                    <span className="flex-1 text-sm text-[#A0AEC0]">
                      {source ? (
                        <SourceTooltip citation={source.citation} label={source.label}>
                          <span>{item.name}</span>
                        </SourceTooltip>
                      ) : (
                        item.name
                      )}
                    </span>
                    <span className="font-mono text-sm text-white font-semibold">
                      +${item.value.toFixed(2)}/yr
                    </span>
                  </div>
                );
              })}

              {/* Total row */}
              <div className="flex items-center gap-3 px-4 py-3 bg-red-950 border border-red-800 rounded-lg mt-2">
                <span className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0"></span>
                <span className="flex-1 text-sm font-bold text-white">Total (estimated)</span>
                <span className="font-mono text-lg text-red-400 font-black">${total.toFixed(2)}/yr</span>
              </div>
            </div>
          </div>

          {/* Industry revenue bar chart */}
          <div>
            <h3 className="font-semibold text-white mb-1">
              Where this money actually goes
              <SourceTooltip citation={SOURCES.platformRevenue.citation} label="Platform Revenue Sources">
                <span></span>
              </SourceTooltip>
            </h3>
            <p className="text-xs text-[#718096] mb-4">
              Total platform advertising revenue, 2023 (billions USD) — from public earnings reports
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PLATFORM_REVENUE_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                  <XAxis dataKey="name" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: '#A0AEC0', fontSize: 12 }}
                    tickFormatter={v => `$${v}B`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {PLATFORM_REVENUE_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color === '#010101' ? '#E53E3E' : '#E53E3E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* The key ethical statement */}
            <div className="mt-4 bg-[#0F0F0F] border border-[#3D3D3D] rounded-xl p-5 text-center">
              <p className="text-white font-semibold text-lg leading-snug">
                You will never receive this money.
              </p>
              <p className="text-[#A0AEC0] text-sm mt-1">
                This is the business model.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prompt to complete quiz if not done */}
      {!showResults && (
        <div className="text-center py-8 text-[#718096]">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-sm">Answer the questions above to see your estimated data value.</p>
          <p className="text-xs mt-1">All non-optional questions must be answered.</p>
        </div>
      )}
    </div>
  );
}
