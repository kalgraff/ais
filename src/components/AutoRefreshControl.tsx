/**
 * Kontrollkomponent for automatisk oppdatering av AIS-data
 */

import { useState } from 'react';
import './AutoRefreshControl.css';

interface AutoRefreshControlProps {
  enabled: boolean;
  interval: number;
  onToggle: () => void;
  onIntervalChange: (interval: number) => void;
}

const REFRESH_INTERVALS = [
  { value: 30000, label: '30 sekunder' },
  { value: 60000, label: '1 minutt' },
  { value: 180000, label: '3 minutter' },
  { value: 300000, label: '5 minutter' },
];

export function AutoRefreshControl({
  enabled,
  interval,
  onToggle,
  onIntervalChange,
}: AutoRefreshControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentInterval = REFRESH_INTERVALS.find((i) => i.value === interval);

  return (
    <div className="auto-refresh-control">
      <div className="refresh-header">
        <button
          className="refresh-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
          <span className="refresh-title">⏱️ Auto-oppdatering</span>
          <span className={`refresh-status ${enabled ? 'active' : 'inactive'}`}>
            {enabled ? '✓ På' : '✗ Av'}
          </span>
        </button>
      </div>

      {isExpanded && (
        <div className="refresh-content">
          <div className="refresh-toggle-section">
            <label className="refresh-switch">
              <input
                type="checkbox"
                checked={enabled}
                onChange={onToggle}
              />
              <span className="slider"></span>
            </label>
            <span className="switch-label">
              {enabled ? 'Automatisk oppdatering aktiv' : 'Automatisk oppdatering av'}
            </span>
          </div>

          <div className="refresh-interval-section">
            <div className="interval-label">Oppdateringsintervall:</div>
            <div className="interval-options">
              {REFRESH_INTERVALS.map((option) => (
                <button
                  key={option.value}
                  className={`interval-option ${interval === option.value ? 'selected' : ''}`}
                  onClick={() => onIntervalChange(option.value)}
                  disabled={!enabled}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {enabled && currentInterval && (
              <div className="interval-info">
                Oppdaterer hvert {currentInterval.label.toLowerCase()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
