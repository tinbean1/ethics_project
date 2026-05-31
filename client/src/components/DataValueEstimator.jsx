import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import CountUp from 'react-countup';

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
    id: 'google',
    label: 'Do you use Google products? (Gmail, Maps, Chrome, Search)',
    type: 'single',
    options: ['Yes, most of them', 'Some', 'No']
  },
  {
    id: 'shopping',
    label: 'How often do you shop online?',
    type: 'single',
    options: ['Rarely', 'Sometimes', 'Frequently']
  },
  {
    id: 'streaming',
    label: 'Streaming services you subscribe to',
    type: 'multi',
    options: ['Netflix', 'Spotify', 'Hulu', 'Disney+', 'Apple TV+', 'YouTube Premium', 'None']
  },
  {
    id: 'healthApps',
    label: 'Do you use health or fitness apps? (Apple Health, Fitbit, MyFitnessPal, etc.)',
    type: 'single',
    options: ['Yes regularly', 'Occasionally', 'No']
  },
  {
    id: 'smartHome',
    label: 'Do you have smart home devices? (Alexa, Google Home, smart TV, etc.)',
    type: 'single',
    options: ['Yes several', 'One or two', 'No']
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

const PLATFORM_VALUES = {
  Facebook:    { value: 62.39, note: 'Meta Q4 2023 earnings: $54.90 ARPU US/Canada annualized' },
  Instagram:   { value: 11.96, note: 'Estimated from Bernstein Research analysis of Meta segment revenue' },
  TikTok:      { value: 7.28,  note: 'Based on TikTok global ad revenue per MAU (FT/Bloomberg estimates, 2023)' },
  LinkedIn:    { value: 24.50, note: 'Microsoft FY2023 LinkedIn segment revenue divided by MAU base' },
  'Twitter/X': { value: 5.87,  note: 'Twitter 2022 annual report ARPU prior to acquisition; 2023 estimates lower' },
  YouTube:     { value: 18.43, note: 'Alphabet Q4 2023: YouTube ads revenue $9.2B / estimated MAU' },
  Snapchat:    { value: 7.12,  note: 'Snap Q4 2023 earnings: ARPU North America annualized' }
};

const STREAMING_VALUES = {
  Netflix:          { value: 4.80,  note: 'Netflix ad-supported tier CPM data; subscriber profiling value estimate' },
  Spotify:          { value: 6.20,  note: 'Spotify Audience Network CPM rates and listener behavioral data value' },
  Hulu:             { value: 3.90,  note: 'Disney/Hulu ad-supported subscriber data monetization estimate' },
  'Disney+':        { value: 3.40,  note: 'Disney+ ad tier launch CPM data and household profiling estimates' },
  'Apple TV+':      { value: 3.20,  note: 'Apple ad ecosystem value; limited third-party data sharing' },
  'YouTube Premium':{ value: 5.10,  note: 'Google cross-platform audience graph contribution for YouTube subscribers' }
};

const PLATFORM_REVENUE_DATA = [
  { name: 'Alphabet',  revenue: 237.8 },
  { name: 'Meta',      revenue: 131.9 },
  { name: 'TikTok',    revenue: 18.0  },
  { name: 'LinkedIn',  revenue: 15.0  },
  { name: 'Snap',      revenue: 4.6   },
  { name: 'Twitter/X', revenue: 2.5   }
];

const PIE_COLORS = [
  '#E53E3E', '#FC8181', '#FEB2B2',
  '#F6AD55', '#F6E05E', '#68D391',
  '#63B3ED', '#B794F4', '#A0AEC0', '#F687B3'
];

function computeValue(answers) {
  const factors = [];
  let total = 35;
  factors.push({ name: 'Base profile value', value: 35, note: 'Every internet user has a baseline value from IP, device fingerprint, and browsing patterns alone.' });

  const platforms = Array.isArray(answers.platforms) ? answers.platforms : [];
  platforms.forEach(platform => {
    const pv = PLATFORM_VALUES[platform];
    if (pv) {
      total += pv.value;
      factors.push({ name: platform, value: pv.value, note: pv.note });
    }
  });

  const streaming = Array.isArray(answers.streaming) ? answers.streaming : [];
  streaming.forEach(service => {
    const sv = STREAMING_VALUES[service];
    if (sv) {
      total += sv.value;
      factors.push({ name: service + ' (streaming)', value: sv.value, note: sv.note });
    }
  });

  if (answers.google === 'Yes, most of them') {
    total += 41.60;
    factors.push({ name: 'Google ecosystem', value: 41.60, note: 'Alphabet 2023 ARPU for US users ($237.8B revenue / ~143M US MAU). Gmail, Maps, Search, and Chrome together form one of the most detailed behavioral profiles in existence.' });
  } else if (answers.google === 'Some') {
    total += 20;
    factors.push({ name: 'Partial Google use', value: 20, note: 'Partial Google product use still contributes substantial cross-service tracking and profile data.' });
  }

  if (answers.shopping === 'Frequently') {
    total += 22;
    factors.push({ name: 'Frequent online shopper', value: 22, note: 'Purchase intent data is among the most valuable to advertisers. Frequent shoppers generate rich transaction histories sold to data brokers.' });
  } else if (answers.shopping === 'Sometimes') {
    total += 11;
    factors.push({ name: 'Online shopper', value: 11, note: 'Occasional online shopping still generates purchase intent signals valued by retail advertisers.' });
  }

  if (answers.healthApps === 'Yes regularly') {
    total += 15;
    factors.push({ name: 'Health app user (regular)', value: 15, note: 'Health and fitness data is among the most sensitive and highest-value data categories. Used to infer insurance risk, fertility, and mental health status.' });
  } else if (answers.healthApps === 'Occasionally') {
    total += 7;
    factors.push({ name: 'Health app user (occasional)', value: 7, note: 'Even occasional health app use contributes sensitive behavioral signals to data broker profiles.' });
  }

  if (answers.smartHome === 'Yes several') {
    total += 18;
    factors.push({ name: 'Smart home (several devices)', value: 18, note: 'Smart home devices capture ambient household activity — conversations, routines, consumption patterns — that greatly enhance advertiser profile depth.' });
  } else if (answers.smartHome === 'One or two') {
    total += 9;
    factors.push({ name: 'Smart home (one or two)', value: 9, note: 'Even one smart device adds persistent household-level behavioral data to your profile.' });
  }

  if (answers.location === 'Urban') {
    total += 14;
    factors.push({ name: 'Urban location', value: 14, note: 'Urban users command higher ad CPMs due to greater purchasing power density and more competitive local advertising markets.' });
  } else if (answers.location === 'Suburban') {
    total += 6;
    factors.push({ name: 'Suburban location', value: 6, note: 'Suburban users have moderately higher value than rural users due to purchasing power and retail access.' });
  }

  if (['25–34', '35–44'].includes(answers.age)) {
    total += 18;
    factors.push({ name: 'Prime advertising demographic', value: 18, note: 'Adults 25–44 are the most targeted advertising demographic — peak earning years, active buyers, and primary household decision-makers.' });
  } else if (answers.age === '18–24') {
    total += 10;
    factors.push({ name: 'Young adult demographic', value: 10, note: 'Gen Z and young millennials are highly valuable for brand loyalty building and trend influence.' });
  }

  if (['$60–100k', '$100k+'].includes(answers.income)) {
    total += 23;
    factors.push({ name: 'Higher income bracket', value: 23, note: 'Higher-income consumers generate significantly more ad revenue due to greater spending capacity and access to premium advertiser categories (finance, travel, luxury).' });
  } else if (answers.income === '$30–60k') {
    total += 8;
    factors.push({ name: 'Middle income bracket', value: 8, note: 'Middle-income consumers are valuable across a broad range of everyday product categories.' });
  }

  return { total: Math.round(total * 100) / 100, factors };
}

const NETFLIX_MONTHLY = 15.49;
const STARBUCKS_LATTE = 6.50;
const FEDERAL_MIN_WAGE = 7.25;
const LIVING_WAGE = 17.00;

function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm max-w-xs shadow-sm">
        <p className="text-gray-900 font-semibold">{item.name}</p>
        <p className="text-red-600">${item.value.toFixed(2)}/year</p>
      </div>
    );
  }
  return null;
}

function CustomBarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm">
        <p className="text-gray-900 font-semibold">{label}</p>
        <p className="text-red-600">${payload[0].value}B ad revenue (2023)</p>
      </div>
    );
  }
  return null;
}

function QuestionCard({ question, answers, onAnswer }) {
  const current = answers[question.id];

  const handleClick = (option) => {
    if (question.type === 'multi') {
      const existing = Array.isArray(current) ? current : [];
      if (option === 'None') {
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
    if (question.type === 'multi') return Array.isArray(current) && current.includes(option);
    return current === option;
  };

  return (
    <div className="card p-6">
      <p className="font-semibold text-gray-900 mb-1">{question.label}</p>
      {question.optional && <p className="text-xs text-gray-400 mb-3">Optional — skip if you prefer</p>}
      {question.type === 'multi' && <p className="text-xs text-gray-400 mb-3">Select all that apply</p>}
      <div className="flex flex-wrap gap-2 mt-3">
        {question.options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => handleClick(opt)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              isSelected(opt)
                ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-500 hover:text-gray-900'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DataValueEstimator({ onValueChange }) {
  const [answers, setAnswers] = useState({});
  const [prevTotal, setPrevTotal] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const requiredQuestions = QUESTIONS.filter(q => !q.optional);
  const answeredCount = requiredQuestions.filter(q => {
    const a = answers[q.id];
    if (q.type === 'multi') return Array.isArray(a) && a.length > 0;
    return a !== null && a !== undefined;
  }).length;
  const answeredRequired = answeredCount === requiredQuestions.length;

  const { total, factors } = computeValue(answers);

  useEffect(() => {
    if (answeredRequired) {
      setPrevTotal(prev => prev);
      setShowResults(true);
      onValueChange(total);
    }
  }, [answers, answeredRequired, total, onValueChange]);

  const netflixMonths = (total / NETFLIX_MONTHLY).toFixed(1);
  const lattesCount = Math.round(total / STARBUCKS_LATTE);
  const fedMinHours = (total / FEDERAL_MIN_WAGE).toFixed(1);
  const livingWageHours = (total / LIVING_WAGE).toFixed(1);

  return (
    <div className="card p-8">
      <h2 className="section-heading">What Is Your Data Worth?</h2>

      <div className="source-disclaimer mb-6">
        <strong className="text-gray-900">These are estimates</strong> based on publicly available data from
        Meta, Alphabet, and TikTok quarterly earnings reports, and academic research.
        Platforms sell access to your attention and behavioral profile — not your data directly.
        Your actual value to advertisers may vary. All figures are annualized estimates in USD.
      </div>

      {/* Progress bar */}
      {!answeredRequired && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Questions answered</p>
            <p className="text-sm font-semibold text-gray-900">{answeredCount}/{requiredQuestions.length}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gray-900 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(answeredCount / requiredQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {QUESTIONS.map(q => (
          <QuestionCard key={q.id} question={q} answers={answers} onAnswer={handleAnswer} />
        ))}
      </div>

      {showResults && (
        <div className="space-y-8">
          {/* Animated total */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Estimated annual value of your data to advertisers
            </p>
            <p className="text-6xl font-black text-gray-900 mb-1">
              $<CountUp
                start={prevTotal}
                end={total}
                decimals={2}
                duration={1.5}
                separator=","
              />
            </p>
            <p className="text-gray-400 text-xs">per year — estimated from published platform earnings reports</p>
          </div>

          {/* 4-column comparison grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{netflixMonths}</p>
              <p className="text-xs text-gray-600 mt-1">months of Netflix</p>
              <p className="text-xs text-gray-400">($15.49/mo)</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{lattesCount}</p>
              <p className="text-xs text-gray-600 mt-1">Starbucks lattes</p>
              <p className="text-xs text-gray-400">($6.50 each)</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{fedMinHours}</p>
              <p className="text-xs text-gray-600 mt-1">federal min wage hours</p>
              <p className="text-xs text-gray-400">($7.25/hr)</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{livingWageHours}</p>
              <p className="text-xs text-gray-600 mt-1">living wage hours</p>
              <p className="text-xs text-gray-400">($17.00/hr)</p>
            </div>
          </div>

          {/* How we calculated this — itemized breakdown */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">How we calculated this</h3>
            <div className="space-y-2">
              {factors.map((item, i) => (
                <div key={item.name} className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    ></span>
                    <span className="flex-1 text-sm text-gray-900 font-medium">{item.name}</span>
                    <span className="font-mono text-sm text-gray-900 font-semibold">+${item.value.toFixed(2)}/yr</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6 leading-relaxed">{item.note}</p>
                </div>
              ))}
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></span>
                <span className="flex-1 text-sm font-bold text-gray-900">Total (estimated)</span>
                <span className="font-mono text-lg text-red-600 font-black">${total.toFixed(2)}/yr</span>
              </div>
            </div>
          </div>

          {/* Pie chart */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Where your value comes from</h3>
            <p className="text-xs text-gray-400 mb-4">
              Estimated — based on platform ARPU figures from public earnings disclosures
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={factors}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      percent > 0.05 ? `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)` : null
                    }
                    labelLine={true}
                  >
                    {factors.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Industry bar chart */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Where this money actually goes</h3>
            <p className="text-xs text-gray-400 mb-4">
              Total platform advertising revenue, 2023 (billions USD) — from public earnings reports
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PLATFORM_REVENUE_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={v => `$${v}B`} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="#E53E3E" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
              <p className="text-gray-900 font-semibold text-lg leading-snug">
                You will never receive this money.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                This is the business model.
              </p>
            </div>
          </div>
        </div>
      )}

      {!showResults && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">Answer the questions above to see your estimated data value.</p>
          <p className="text-xs mt-1">All non-optional questions must be answered.</p>
        </div>
      )}
    </div>
  );
}
