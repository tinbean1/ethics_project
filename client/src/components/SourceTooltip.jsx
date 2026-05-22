import React, { useState, useRef, useEffect } from 'react';

/**
 * Reusable citation tooltip.
 * Wrap any element with this to show a source citation on hover/click.
 *
 * Usage:
 *   <SourceTooltip citation="Meta Q4 2023 Earnings..." label="Facebook ARPU">
 *     <span>$62.39</span>
 *   </SourceTooltip>
 */
export default function SourceTooltip({ children, citation, label }) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        tooltipRef.current && !tooltipRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <span className="inline-flex items-center gap-1 relative">
      {children}
      {/* (i) info icon */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setVisible(v => !v)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={(e) => {
          // Keep tooltip open if mouse is over the tooltip itself
          if (!tooltipRef.current?.contains(e.relatedTarget)) {
            setVisible(false);
          }
        }}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#3D3D3D] text-[#A0AEC0] text-[10px] font-bold hover:bg-red-900 hover:text-red-300 transition-colors cursor-help flex-shrink-0"
        aria-label={`Source: ${label}`}
      >
        i
      </button>

      {/* Tooltip popup */}
      {visible && (
        <span
          ref={tooltipRef}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg p-3 z-50 shadow-2xl"
          role="tooltip"
        >
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#3D3D3D]"></span>
          <p className="text-xs font-semibold text-red-400 mb-1">{label}</p>
          <p className="text-xs text-[#A0AEC0] leading-relaxed">{citation}</p>
        </span>
      )}
    </span>
  );
}
