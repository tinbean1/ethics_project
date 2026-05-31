import React, { useState } from 'react';

const PLATFORMS = [
  {
    name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    rating: 'Aggressive',
    color: 'red-600',
    summary:
      'Google builds detailed profiles from your searches, location, YouTube history, and Gmail to serve targeted ads across its vast network of products and partner sites.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: true,
      canDeleteData: true,
      dataRetention: 'Varies by product; some data kept indefinitely',
      notableClause:
        'Google\'s license to your content is "worldwide, royalty-free" and survives even after you delete it if others have already shared it.',
    },
  },
  {
    name: 'Meta (Facebook)',
    logo: 'https://logo.clearbit.com/facebook.com',
    rating: 'Aggressive',
    color: 'red-600',
    summary:
      'Meta does not technically "sell" your data but shares it extensively with advertisers and uses the Facebook Pixel to track you across millions of third-party websites.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: true,
      canDeleteData: true,
      dataRetention: '90 days after account deletion',
      notableClause:
        'Meta announced in 2024 that user posts and public content would be used to train its AI models, with opt-out limited and unavailable in some regions.',
    },
  },
  {
    name: 'Instagram',
    logo: 'https://logo.clearbit.com/instagram.com',
    rating: 'Aggressive',
    color: 'red-600',
    summary:
      'Owned by Meta, Instagram shares the same advertising infrastructure and data-sharing practices, tracking your activity on and off the app to serve targeted ads.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: true,
      canDeleteData: true,
      dataRetention: '90 days after account deletion',
      notableClause:
        'Instagram can use your username, profile photo, and activity in ads shown to your followers without additional compensation or consent.',
    },
  },
  {
    name: 'TikTok',
    logo: 'https://logo.clearbit.com/tiktok.com',
    rating: 'Aggressive',
    color: 'red-600',
    summary:
      'TikTok collects an unusually broad set of device and behavioral data, including biometric identifiers, and its parent company ByteDance is subject to Chinese data laws.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: true,
      canDeleteData: true,
      dataRetention: 'Up to 30 days after deletion; some data retained longer',
      notableClause:
        'TikTok\'s policy explicitly permits collection of "faceprints and voiceprints" — biometric identifiers — from user content.',
    },
  },
  {
    name: 'X (Twitter)',
    logo: 'https://logo.clearbit.com/twitter.com',
    rating: 'Aggressive',
    color: 'red-600',
    summary:
      'Since Elon Musk\'s acquisition, X updated its privacy policy to use public posts and interactions to train its Grok AI model, with opt-out buried in settings.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: true,
      canDeleteData: true,
      dataRetention: '30 days after account deactivation',
      notableClause:
        'X uses your public posts, likes, and interactions to train its Grok AI; the opt-out setting is not available in all regions.',
    },
  },
  {
    name: 'Snapchat',
    logo: 'https://logo.clearbit.com/snapchat.com',
    rating: 'Moderate',
    color: 'yellow-600',
    summary:
      'Snapchat collects location and device data for ad targeting and uses your content to improve its AI and AR features, but messages between users are encrypted in transit.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: false,
      canDeleteData: true,
      dataRetention: 'Snaps deleted after viewing; account data 30 days post-deletion',
      notableClause:
        'Snapchat grants itself a broad license to use your Snaps, Stories, and other content to develop and improve its AI and augmented-reality products.',
    },
  },
  {
    name: 'LinkedIn',
    logo: 'https://logo.clearbit.com/linkedin.com',
    rating: 'Moderate',
    color: 'yellow-600',
    summary:
      'LinkedIn uses your professional profile, connections, and activity to serve job and B2B ads, and it shares data with its parent company Microsoft for cross-product use.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: true,
      canDeleteData: true,
      dataRetention: '30 days after account deletion',
      notableClause:
        'LinkedIn\'s 2024 policy update enabled AI training on user content by default; users must opt out manually via privacy settings.',
    },
  },
  {
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    rating: 'Aggressive',
    color: 'red-600',
    summary:
      'Amazon combines purchase history, browsing, Alexa voice recordings, and Prime Video viewing to build comprehensive consumer profiles used for ads and sold insights.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: true,
      canDeleteData: true,
      dataRetention: 'Alexa voice recordings kept until manually deleted; purchase history indefinitely',
      notableClause:
        'Amazon shares purchase and behavioral data with third-party sellers on its marketplace, meaning merchants can see patterns about your buying habits.',
    },
  },
  {
    name: 'Apple',
    logo: 'https://logo.clearbit.com/apple.com',
    rating: 'Transparent',
    color: 'green-600',
    summary:
      'Apple positions itself as privacy-first, processes most data on-device, does not sell personal data, and requires explicit opt-in for cross-app tracking via its ATT framework.',
    practices: {
      sellsData: false,
      sharesWithPartners: false,
      usedForAds: false,
      aiTraining: false,
      crossAppTracking: false,
      canDeleteData: true,
      dataRetention: 'Account data deleted within 7 days of request',
      notableClause:
        'Apple\'s App Tracking Transparency (ATT) requires every app to ask your permission before tracking you across other companies\' apps and websites.',
    },
  },
  {
    name: 'Spotify',
    logo: 'https://logo.clearbit.com/spotify.com',
    rating: 'Moderate',
    color: 'yellow-600',
    summary:
      'Spotify uses listening history, mood inferences, and podcast behavior to serve targeted ads on the free tier and shares aggregated data with record labels and podcast partners.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: false,
      canDeleteData: true,
      dataRetention: '30 days after account deletion',
      notableClause:
        'Spotify\'s policy permits inferring your "mood" and "emotional state" from listening patterns and using that inference to personalize ads.',
    },
  },
  {
    name: 'YouTube',
    logo: 'https://logo.clearbit.com/youtube.com',
    rating: 'Aggressive',
    color: 'red-600',
    summary:
      'As part of Google, YouTube links your watch history, search queries, and ad interactions to your Google profile, enabling cross-platform targeting across all Google services.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: true,
      canDeleteData: true,
      dataRetention: 'Tied to Google account; varies by data type',
      notableClause:
        'YouTube can serve targeted ads to signed-out viewers using cookies and device fingerprinting, with no account required to be tracked.',
    },
  },
  {
    name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    rating: 'Moderate',
    color: 'yellow-600',
    summary:
      'Microsoft collects data across Windows, Office, Xbox, LinkedIn, and Bing, using it for ad targeting and to improve AI products like Copilot, with enterprise controls available.',
    practices: {
      sellsData: false,
      sharesWithPartners: true,
      usedForAds: true,
      aiTraining: true,
      crossAppTracking: true,
      canDeleteData: true,
      dataRetention: 'Up to 180 days after account closure; some logs retained longer',
      notableClause:
        'Microsoft\'s Copilot and other AI products may use your prompts and interactions to improve models unless you are on an enterprise plan with a data processing agreement.',
    },
  },
];

const PRACTICE_COLUMNS = [
  { key: 'sellsData', label: 'Sells Data', badForUser: true },
  { key: 'sharesWithPartners', label: 'Shares w/ Partners', badForUser: true },
  { key: 'usedForAds', label: 'Used for Ads', badForUser: true },
  { key: 'aiTraining', label: 'AI Training', badForUser: true },
  { key: 'crossAppTracking', label: 'Cross-App Tracking', badForUser: true },
  { key: 'canDeleteData', label: 'Can Delete Data', badForUser: false },
  { key: 'dataRetention', label: 'Data Retention', badForUser: null },
];

const RATING_CONFIG = {
  Aggressive: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  Moderate: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
  Transparent: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
};

function PracticePill({ value, badForUser }) {
  if (typeof value === 'string') {
    return (
      <span className="inline-block text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5">
        {value}
      </span>
    );
  }
  const isGood = badForUser ? !value : value;
  return (
    <span
      className={`inline-block text-xs rounded px-2 py-0.5 font-medium ${
        isGood ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}
    >
      {value ? 'Yes' : 'No'}
    </span>
  );
}

function TableCell({ value, badForUser }) {
  if (typeof value === 'string') {
    return <span className="text-xs text-gray-600">{value}</span>;
  }
  const isGood = badForUser ? !value : value;
  return (
    <span className={`text-base font-bold ${isGood ? 'text-green-600' : 'text-red-600'}`}>
      {isGood ? '✓' : '✗'}
    </span>
  );
}

function PlatformCard({ platform }) {
  const rc = RATING_CONFIG[platform.rating];
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
      <img
        src={platform.logo}
        alt={platform.name}
        className="w-10 h-10 rounded-lg object-contain"
        onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
      />
      <div style={{display:'none'}} className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
        {platform.name[0]}
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-gray-900 text-base leading-tight">{platform.name}</h3>
        <span
          className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${rc.bg} ${rc.text} ${rc.border}`}
        >
          {platform.rating}
        </span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{platform.summary}</p>

      <div className="flex flex-wrap gap-1.5">
        {PRACTICE_COLUMNS.map(col => (
          <div key={col.key} className="flex items-center gap-1">
            <span className="text-xs text-gray-500">{col.label}:</span>
            <PracticePill value={platform.practices[col.key]} badForUser={col.badForUser} />
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 italic border-t border-gray-100 pt-3 leading-relaxed">
        "{platform.practices.notableClause}"
      </p>
    </div>
  );
}

export default function TermsComparison() {
  const [view, setView] = useState('cards');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">What You Agree To</h2>
        <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
          A plain-English summary of what major platforms claim the right to do with your data when
          you click "I Agree." Most people never read these — here's what they say.
        </p>
        <p className="text-xs text-gray-400">
          Based on publicly available privacy policies and terms of service as of 2024. For legal
          advice, consult an attorney.
        </p>
      </div>

      {/* Rating legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(RATING_CONFIG).map(([rating, rc]) => (
          <span
            key={rating}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${rc.bg} ${rc.text} ${rc.border}`}
          >
            {rating === 'Aggressive' && '● Aggressive — extensive data collection and sharing'}
            {rating === 'Moderate' && '● Moderate — some data sharing, limited controls'}
            {rating === 'Transparent' && '● Transparent — strong user controls and privacy defaults'}
          </span>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-gray-100 rounded-full p-1 w-fit">
        {['cards', 'table'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-5 py-1.5 text-sm font-semibold rounded-full transition-colors ${
              view === v ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {v === 'cards' ? 'Cards' : 'Table'}
          </button>
        ))}
      </div>

      {/* Card grid */}
      {view === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PLATFORMS.map(p => (
            <PlatformCard key={p.name} platform={p} />
          ))}
        </div>
      )}

      {/* Comparison table */}
      {view === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm bg-white">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="sticky left-0 bg-gray-50 z-10 text-left px-4 py-3 font-semibold text-gray-900 border-r border-gray-200 min-w-[140px]">
                  Platform
                </th>
                {PRACTICE_COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap text-center min-w-[120px]"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLATFORMS.map((p, i) => {
                const rc = RATING_CONFIG[p.rating];
                return (
                  <tr
                    key={p.name}
                    className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className={`sticky left-0 z-10 px-4 py-3 border-r border-gray-200 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.logo}
                            alt={p.name}
                            className="w-6 h-6 rounded object-contain shrink-0"
                            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                          />
                          <div style={{display:'none'}} className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs shrink-0">
                            {p.name[0]}
                          </div>
                          <span className="font-semibold text-gray-900 whitespace-nowrap">
                            {p.name}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit border ${rc.bg} ${rc.text} ${rc.border}`}
                        >
                          {p.rating}
                        </span>
                      </div>
                    </td>
                    {PRACTICE_COLUMNS.map(col => (
                      <td key={col.key} className="px-4 py-3 text-center">
                        <TableCell value={p.practices[col.key]} badForUser={col.badForUser} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
