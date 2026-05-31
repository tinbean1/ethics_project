import React from 'react';

function getSeverity(dataClasses) {
  if (!dataClasses) return 'LOW';
  const high = ['Passwords', 'Financial data', 'Credit cards', 'Bank account numbers'];
  const medium = ['Email addresses', 'Phone numbers', 'Physical addresses'];
  if (dataClasses.some(d => high.includes(d))) return 'HIGH';
  if (dataClasses.some(d => medium.includes(d))) return 'MEDIUM';
  return 'LOW';
}

function SeverityBadge({ severity }) {
  if (severity === 'HIGH') return (
    <span className="badge-high flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>HIGH RISK
    </span>
  );
  if (severity === 'MEDIUM') return (
    <span className="badge-medium flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>MEDIUM
    </span>
  );
  return (
    <span className="badge-low flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>LOW
    </span>
  );
}

function BreachCard({ breach }) {
  const severity = getSeverity(breach.DataClasses);
  return (
    <div className="card p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{breach.Name}</h3>
          <p className="text-gray-500 text-sm mt-0.5">
            Breached:{' '}
            <time dateTime={breach.BreachDate}>
              {new Date(breach.BreachDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </p>
        </div>
        <SeverityBadge severity={severity} />
      </div>
      {breach.DataClasses && breach.DataClasses.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1.5">Compromised data</p>
          <div className="flex flex-wrap gap-1.5">
            {breach.DataClasses.map(dc => (
              <span key={dc} className={`text-xs px-2 py-0.5 rounded-full border ${
                ['Passwords', 'Financial data', 'Credit cards'].includes(dc)
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>{dc}</span>
            ))}
          </div>
        </div>
      )}
      {breach.Description && (
        <p className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: breach.Description }} />
      )}
    </div>
  );
}

export default function BreachResults({ data, email, isLoading }) {
  if (isLoading) return (
    <div className="card p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="space-y-3 mt-6">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>)}</div>
      </div>
    </div>
  );

  if (data?.error) return (
    <div className="card p-8 border-red-200">
      <p className="text-red-700 font-semibold">{data.error}</p>
    </div>
  );

  if (!data) return null;

  const breaches = data.breaches ?? [];
  const mockMode = data.mockMode ?? false;
  const highCount = breaches.filter(b => getSeverity(b.DataClasses) === 'HIGH').length;

  return (
    <div>
      {mockMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex items-start gap-3">
          <span className="text-yellow-600 flex-shrink-0">⚠</span>
          <div>
            <p className="text-yellow-800 font-semibold text-sm">Demo mode — sample data shown</p>
            <p className="text-yellow-700 text-xs mt-0.5">
              {data.mockModeMessage} These are real breaches, but they are <strong>not results for this specific email</strong>.
              Add your HIBP_API_KEY to /server/.env for live results.
            </p>
          </div>
        </div>
      )}
      <div className="card p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="section-heading">
              {breaches.length === 0 ? 'No breaches found' : `${breaches.length} breach${breaches.length !== 1 ? 'es' : ''} found`}
            </h2>
            <p className="text-gray-500 text-sm">
              {mockMode ? 'Showing example breach data (demo mode)' : `Results for ${email}`}
            </p>
          </div>
          {breaches.length > 0 && (
            <div className="flex-shrink-0 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-center">
              <p className="text-4xl font-black text-red-600">{breaches.length}</p>
              <p className="text-xs text-red-500 font-medium">{highCount > 0 ? `${highCount} high risk` : 'breaches'}</p>
            </div>
          )}
        </div>
        {breaches.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <p className="text-green-800 font-bold text-base mb-1">No breaches found</p>
            <p className="text-green-700 text-sm">This email does not appear in the HaveIBeenPwned database.</p>
            <p className="text-gray-500 text-xs mt-3">This does not guarantee your data has never been exposed — not all breaches are reported to HIBP.</p>
          </div>
        )}
        {breaches.length > 0 && (
          <div className="space-y-4">
            {[...breaches].sort((a, b) => {
              const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
              return order[getSeverity(a.DataClasses)] - order[getSeverity(b.DataClasses)];
            }).map((breach, i) => <BreachCard key={`${breach.Name}-${i}`} breach={breach} />)}
          </div>
        )}
        <p className="mt-6 text-xs text-gray-400 border-t border-gray-200 pt-4">
          Breach data sourced from{' '}
          <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">HaveIBeenPwned.com</a>
          {' '}— a free service by security researcher Troy Hunt.
        </p>
      </div>
    </div>
  );
}
