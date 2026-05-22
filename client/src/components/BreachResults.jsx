import React from 'react';

/**
 * Feature 1 — Breach Results Display.
 * Shows the list of breaches returned by the HIBP API (or mock data).
 * Each breach shows name, date, compromised data classes, and a severity badge.
 */

// Determines severity based on what data classes were exposed
function getSeverity(dataClasses) {
  if (!dataClasses) return 'LOW';
  const high = ['Passwords', 'Financial data', 'Credit cards', 'Bank account numbers'];
  const medium = ['Email addresses', 'Phone numbers', 'Physical addresses'];
  if (dataClasses.some(d => high.includes(d))) return 'HIGH';
  if (dataClasses.some(d => medium.includes(d))) return 'MEDIUM';
  return 'LOW';
}

function SeverityBadge({ severity }) {
  if (severity === 'HIGH') {
    return (
      <span className="badge-high flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
        HIGH RISK
      </span>
    );
  }
  if (severity === 'MEDIUM') {
    return (
      <span className="badge-medium flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
        MEDIUM
      </span>
    );
  }
  return (
    <span className="badge-low flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
      LOW
    </span>
  );
}

function BreachCard({ breach }) {
  const severity = getSeverity(breach.DataClasses);

  return (
    <div className="card p-5 hover:border-[#3D3D3D] transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-bold text-white text-lg leading-tight">{breach.Name}</h3>
          <p className="text-[#718096] text-sm mt-0.5">
            Breached:{' '}
            <time dateTime={breach.BreachDate}>
              {new Date(breach.BreachDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </time>
          </p>
        </div>
        <SeverityBadge severity={severity} />
      </div>

      {/* What was compromised */}
      {breach.DataClasses && breach.DataClasses.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-[#718096] font-medium uppercase tracking-wide mb-1.5">
            Compromised data
          </p>
          <div className="flex flex-wrap gap-1.5">
            {breach.DataClasses.map(dc => (
              <span
                key={dc}
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  ['Passwords', 'Financial data', 'Credit cards'].includes(dc)
                    ? 'bg-red-950 text-red-300 border-red-800'
                    : 'bg-[#2D2D2D] text-[#A0AEC0] border-[#3D3D3D]'
                }`}
              >
                {dc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Breach description */}
      {breach.Description && (
        <p
          className="text-sm text-[#A0AEC0] leading-relaxed"
          // HIBP descriptions may contain safe HTML like <a> tags
          dangerouslySetInnerHTML={{ __html: breach.Description }}
        />
      )}
    </div>
  );
}

export default function BreachResults({ data, email, isLoading }) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="card p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#2D2D2D] rounded w-1/3"></div>
          <div className="h-4 bg-[#2D2D2D] rounded w-2/3"></div>
          <div className="space-y-3 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-[#2D2D2D] rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // API / network error
  if (data?.error) {
    return (
      <div className="card p-8 border-red-900">
        <p className="text-red-400 font-semibold">⚠️ {data.error}</p>
      </div>
    );
  }

  if (!data) return null;

  const breaches = data.breaches ?? [];
  const mockMode = data.mockMode ?? false;
  const highCount = breaches.filter(b => getSeverity(b.DataClasses) === 'HIGH').length;

  return (
    <div>
      {/* Mock mode warning — shown prominently at top */}
      {mockMode && (
        <div className="bg-yellow-950 border border-yellow-800 rounded-xl p-4 mb-4 flex items-start gap-3">
          <span className="text-yellow-400 text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="text-yellow-300 font-semibold text-sm">Demo mode — sample data shown</p>
            <p className="text-yellow-600 text-xs mt-0.5">
              {data.mockModeMessage} These are real breaches, but they are <strong>not results for this specific email</strong>.
              Add your HIBP_API_KEY to /server/.env for live results.
            </p>
          </div>
        </div>
      )}

      <div className="card p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-500 text-xl">🔴</span>
          <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">
            Breach Results
          </span>
        </div>

        {/* Summary line */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="section-heading">
              {breaches.length === 0
                ? 'No breaches found'
                : `${breaches.length} breach${breaches.length !== 1 ? 'es' : ''} found`}
            </h2>
            <p className="text-[#A0AEC0] text-sm">
              {mockMode
                ? 'Showing example breach data (demo mode)'
                : `Results for ${email}`}
            </p>
          </div>

          {/* Big breach count badge */}
          {breaches.length > 0 && (
            <div className="flex-shrink-0 bg-red-950 border border-red-800 rounded-xl px-5 py-3 text-center">
              <p className="text-4xl font-black text-red-400">{breaches.length}</p>
              <p className="text-xs text-red-600 font-medium">
                {highCount > 0 ? `${highCount} high risk` : 'breaches'}
              </p>
            </div>
          )}
        </div>

        {/* No breaches — green state */}
        {breaches.length === 0 && (
          <div className="bg-green-950 border border-green-800 rounded-xl p-6 text-center">
            <p className="text-5xl mb-3">✅</p>
            <p className="text-green-300 font-bold text-lg">You're clear!</p>
            <p className="text-green-600 text-sm mt-1">
              No breaches were found for this email in the HaveIBeenPwned database.
            </p>
            <p className="text-[#718096] text-xs mt-3">
              This does not guarantee your data has never been exposed —
              not all breaches are reported to HIBP.
            </p>
          </div>
        )}

        {/* Breach list */}
        {breaches.length > 0 && (
          <div className="space-y-4">
            {/* Sort high severity first */}
            {[...breaches]
              .sort((a, b) => {
                const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                return order[getSeverity(a.DataClasses)] - order[getSeverity(b.DataClasses)];
              })
              .map((breach, i) => (
                <BreachCard key={`${breach.Name}-${i}`} breach={breach} />
              ))
            }
          </div>
        )}

        {/* Source attribution */}
        <p className="mt-6 text-xs text-[#718096] border-t border-[#2D2D2D] pt-4">
          Breach data sourced from{' '}
          <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
            HaveIBeenPwned.com
          </a>
          {' '}— a free service by security researcher Troy Hunt, trusted by governments and enterprises worldwide.
        </p>
      </div>
    </div>
  );
}
