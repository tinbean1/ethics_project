import React, { useState } from 'react';

const PLATFORMS = [
  {
    name: 'Google',
    logo: 'https://www.google.com/s2/favicons?domain=google.com&sz=128',
    brandColor: '#4285F4',
    summary:
      'Google builds detailed profiles from your searches, location, YouTube history, and Gmail to serve targeted ads across its vast network of products and partner sites.',
    partners: [
      'Doubleclick/Google Ad Manager',
      'Google Analytics (3M+ sites)',
      'YouTube',
      'Android device manufacturers',
      'Gmail partner integrations',
      'Google Shopping merchants',
    ],
    sources: [
      { label: 'Google Privacy Policy', url: 'https://policies.google.com/privacy' },
      { label: 'Alphabet 2023 Annual Report', url: 'https://abc.xyz/investor/' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=128',
    brandColor: '#1877F2',
    summary:
      'Meta does not technically "sell" your data but shares it extensively with advertisers and uses the Facebook Pixel to track you across millions of third-party websites.',
    partners: [
      'Instagram',
      'WhatsApp',
      'Facebook Pixel partners (10M+ sites)',
      'Oculus/Meta Quest',
      'CRM partners (Salesforce, HubSpot)',
      'Audience Network publishers',
    ],
    sources: [
      { label: 'Meta Privacy Policy', url: 'https://www.facebook.com/privacy/policy/' },
      { label: 'Meta 2023 Annual Report', url: 'https://investor.fb.com/' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=128',
    brandColor: '#E1306C',
    summary:
      'Owned by Meta, Instagram shares the same advertising infrastructure and data-sharing practices, tracking your activity on and off the app to serve targeted ads.',
    partners: [
      'Meta Platforms',
      'Facebook Ad Network',
      'Shopping partners (Shopify, etc.)',
      'Creator marketplace brands',
      'WhatsApp Business',
    ],
    sources: [
      { label: 'Instagram Privacy Policy', url: 'https://privacycenter.instagram.com/policy' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=128',
    brandColor: '#010101',
    summary:
      'TikTok collects an unusually broad set of device and behavioral data, including biometric identifiers, and its parent company ByteDance is subject to Chinese data laws.',
    partners: [
      'ByteDance',
      'TikTok for Business advertisers',
      'Creator marketplace brands',
      'Shopify (TikTok Shopping)',
      'Oracle (former data partner)',
    ],
    sources: [
      { label: 'TikTok Privacy Policy', url: 'https://www.tiktok.com/legal/page/us/privacy-policy/en' },
      { label: 'FTC TikTok Settlement 2023', url: 'https://www.ftc.gov/news-events/news/press-releases/2023/09/ftc-doj-charge-tiktok-knowingly-illegally-collecting-using-childrens-data' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=128',
    brandColor: '#000000',
    summary:
      'Since Elon Musk\'s acquisition, X updated its privacy policy to use public posts and interactions to train its Grok AI model, with opt-out buried in settings.',
    partners: [
      'Twitter Audience Platform',
      'MoPub (sold 2021)',
      'Data resellers',
      'X Premium partners',
      'Third-party app developers via API',
    ],
    sources: [
      { label: 'X Privacy Policy', url: 'https://twitter.com/en/privacy' },
      { label: 'X Terms of Service', url: 'https://twitter.com/en/tos' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=snapchat.com&sz=128',
    brandColor: '#FFFC00',
    summary:
      'Snapchat collects location and device data for ad targeting and uses your content to improve its AI and AR features, but messages between users are encrypted in transit.',
    partners: [
      'Snap Audience Network',
      'AR lens brand partners',
      'Bitmoji / Snap Kit developers',
      'Snapchat+ brand integrations',
      'Ad measurement partners (Nielsen, etc.)',
    ],
    sources: [
      { label: 'Snap Privacy Policy', url: 'https://snap.com/en-US/privacy/privacy-policy' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=128',
    brandColor: '#0A66C2',
    summary:
      'LinkedIn uses your professional profile, connections, and activity to serve job and B2B ads, and it shares data with its parent company Microsoft for cross-product use.',
    partners: [
      'Microsoft (parent company)',
      'Microsoft Advertising',
      'LinkedIn Learning partners',
      'ATS/recruiting software vendors',
      'Salesforce integration partners',
    ],
    sources: [
      { label: 'LinkedIn Privacy Policy', url: 'https://www.linkedin.com/legal/privacy-policy' },
      { label: 'Microsoft Privacy Statement', url: 'https://privacy.microsoft.com/en-us/privacystatement' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128',
    brandColor: '#FF9900',
    summary:
      'Amazon combines purchase history, browsing, Alexa voice recordings, and Prime Video viewing to build comprehensive consumer profiles used for ads and sold insights.',
    partners: [
      'AWS clients',
      'Amazon DSP advertisers',
      'Third-party marketplace sellers',
      'Whole Foods',
      'IMDb/Twitch/Audible',
      'Alexa skill developers',
    ],
    sources: [
      { label: 'Amazon Privacy Notice', url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ' },
      { label: 'Alexa Terms of Use', url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=GA7W9ULDG4B5JKZZ' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=apple.com&sz=128',
    brandColor: '#555555',
    summary:
      'Apple positions itself as privacy-first, processes most data on-device, does not sell personal data, and requires explicit opt-in for cross-app tracking via its ATT framework.',
    partners: [
      'App Store developers',
      'Apple Advertising partners (opt-in)',
      'Apple Pay merchants',
      'iCloud service partners',
      'CarPlay manufacturers',
    ],
    sources: [
      { label: 'Apple Privacy Policy', url: 'https://www.apple.com/legal/privacy/' },
      { label: 'App Store Review Guidelines', url: 'https://developer.apple.com/app-store/review/guidelines/' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128',
    brandColor: '#1DB954',
    summary:
      'Spotify uses listening history, mood inferences, and podcast behavior to serve targeted ads on the free tier and shares aggregated data with record labels and podcast partners.',
    partners: [
      'Spotify Audience Network publishers',
      'Podcast advertising partners',
      'Ticketmaster / Live Nation',
      'Megaphone (podcast hosting)',
      'Brand playlist sponsors',
    ],
    sources: [
      { label: 'Spotify Privacy Policy', url: 'https://www.spotify.com/us/legal/privacy-policy/' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',
    brandColor: '#FF0000',
    summary:
      'As part of Google, YouTube links your watch history, search queries, and ad interactions to your Google profile, enabling cross-platform targeting across all Google services.',
    partners: [
      'Google Ads (parent)',
      'YouTube Premium brand partners',
      'Channel memberships brands',
      'YouTube Shopping merchants',
      'Creator monetization partners',
    ],
    sources: [
      { label: 'YouTube Privacy Policy', url: 'https://www.youtube.com/howyoutubeworks/user-settings/privacy/' },
      { label: 'Google Privacy Policy', url: 'https://policies.google.com/privacy' },
    ],
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
    logo: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
    brandColor: '#00A4EF',
    summary:
      'Microsoft collects data across Windows, Office, Xbox, LinkedIn, and Bing, using it for ad targeting and to improve AI products like Copilot, with enterprise controls available.',
    partners: [
      'LinkedIn (owned)',
      'Azure cloud clients',
      'Microsoft Advertising partners',
      'Xbox/gaming partners',
      'Office 365 enterprise clients',
      'OpenAI (partnership)',
    ],
    sources: [
      { label: 'Microsoft Privacy Statement', url: 'https://privacy.microsoft.com/en-us/privacystatement' },
      { label: 'LinkedIn Privacy Policy', url: 'https://www.linkedin.com/legal/privacy-policy' },
    ],
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

const PRACTICE_ROWS = [
  { key: 'sellsData', label: 'Sells Data', badForUser: true },
  { key: 'sharesWithPartners', label: 'Shares w/ Partners', badForUser: true },
  { key: 'usedForAds', label: 'Used for Ads', badForUser: true },
  { key: 'aiTraining', label: 'AI Training', badForUser: true },
  { key: 'crossAppTracking', label: 'Cross-App Tracking', badForUser: true },
  { key: 'canDeleteData', label: 'Can Delete Data', badForUser: false },
  { key: 'dataRetention', label: 'Data Retention', badForUser: null },
];


function BoolPill({ value, badForUser }) {
  const isGood = badForUser ? !value : value;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-0.5 font-medium ${
        isGood ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
      }`}
    >
      {isGood ? (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 6l3 3 5-5"/>
        </svg>
      ) : (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3l6 6M9 3l-6 6"/>
        </svg>
      )}
      {value ? 'Yes' : 'No'}
    </span>
  );
}

function PlatformDetail({ platform }) {
  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center gap-4">
        <img
          src={platform.logo}
          alt={platform.name}
          className="w-16 h-16 rounded-xl object-contain border border-gray-100 bg-white p-1 flex-shrink-0"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        <div
          style={{ display: 'none', backgroundColor: platform.brandColor }}
          className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl flex-shrink-0 text-white"
        >
          {platform.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-gray-900 leading-tight">{platform.name}</h3>
        </div>
      </div>

      {/* Summary */}
      <p className="text-gray-600 leading-relaxed">{platform.summary}</p>

      {/* Practice rows */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
          What they claim the right to do
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
          {PRACTICE_ROWS.map(row => {
            const val = platform.practices[row.key];
            return (
              <div key={row.key} className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-sm text-gray-600">{row.label}</span>
                {typeof val === 'string' ? (
                  <span className="text-sm text-gray-700 text-right max-w-[55%] leading-snug">{val}</span>
                ) : (
                  <BoolPill value={val} badForUser={row.badForUser} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notable clause */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
          Notable clause
        </h4>
        <blockquote className="bg-gray-50 border-l-4 border-gray-300 rounded-r-lg px-4 py-3">
          <p className="text-sm text-gray-600 italic leading-relaxed">
            "{platform.practices.notableClause}"
          </p>
        </blockquote>
      </div>

      {/* Key Partners & Data Recipients */}
      {platform.partners && platform.partners.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
            Key Partners &amp; Data Recipients
          </h4>
          <p className="text-sm text-gray-500 mb-3">
            Companies and platforms that receive or process your data under this policy.
          </p>
          <div className="flex flex-wrap gap-2">
            {platform.partners.map(partner => (
              <span
                key={partner}
                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {platform.sources && platform.sources.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
            Sources
          </h4>
          <div className="flex flex-wrap gap-1 items-center">
            {platform.sources.map((source, i) => (
              <span key={source.url}>
                {i > 0 && <span className="text-gray-400 text-xs mx-1">·</span>}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline text-xs"
                >
                  {source.label}
                </a>
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Information based on publicly available privacy policies and terms of service as of 2024.
          </p>
        </div>
      )}

    </div>
  );
}

function LogoFallback({ name }) {
  return (
    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg flex-shrink-0">
      {name[0]}
    </div>
  );
}

export default function TermsComparison() {
  const [selected, setSelected] = useState('Google');
  const selectedPlatform = PLATFORMS.find(p => p.name === selected) || PLATFORMS[0];

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

      {/* Two-panel explorer */}
      <div className="flex gap-8 items-start">
        {/* Left panel — desktop sticky tile grid */}
        <div className="hidden lg:block w-64 flex-shrink-0 sticky top-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Pick a platform to explore
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map(p => {
              const isSelected = p.name === selected;
              return (
                <button
                  key={p.name}
                  onClick={() => setSelected(p.name)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    style={{ display: 'none', backgroundColor: p.brandColor }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  >
                    {p.name[0]}
                  </div>
                  <span className="text-xs text-gray-700 leading-tight line-clamp-2">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile selector — horizontal scrollable pills */}
        <div className="lg:hidden w-full">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Pick a platform
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {PLATFORMS.map(p => {
              const isSelected = p.name === selected;
              return (
                <button
                  key={p.name}
                  onClick={() => setSelected(p.name)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={p.logo}
                    alt=""
                    className="w-5 h-5 rounded object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel — detail */}
        <div className="flex-1 min-w-0 lg:block hidden">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <PlatformDetail platform={selectedPlatform} />
          </div>
        </div>
      </div>

      {/* Mobile detail panel below selector */}
      <div className="lg:hidden">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <PlatformDetail platform={selectedPlatform} />
        </div>
      </div>
    </div>
  );
}
