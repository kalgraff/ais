/**
 * Kontroller for marine data overlay
 */

import { useState } from 'react';
import type { MarineOverlayOptions } from '../types/marine';
import './MarineOverlayControl.css';

interface MarineOverlayControlProps {
  options: MarineOverlayOptions;
  onOptionsChange: (options: MarineOverlayOptions) => void;
  isLoading?: boolean;
}

export function MarineOverlayControl({
  options,
  onOptionsChange,
  isLoading = false,
}: MarineOverlayControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (key: keyof MarineOverlayOptions) => {
    onOptionsChange({
      ...options,
      [key]: !options[key],
    });
  };

  const handleToggleAll = () => {
    const allEnabled = options.showTemperature && options.showWaves && options.showCurrents;
    onOptionsChange({
      showTemperature: !allEnabled,
      showWaves: !allEnabled,
      showCurrents: !allEnabled,
    });
  };

  const activeCount = [
    options.showTemperature,
    options.showWaves,
    options.showCurrents,
  ].filter(Boolean).length;

  return (
    <div className="marine-overlay-control">
      <div className="marine-header">
        <button
          className="marine-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
          <span className="marine-title">🌊 Havdata</span>
          {isLoading && <span className="loading-spinner-small"></span>}
          {!isLoading && activeCount > 0 && (
            <span className="active-count">{activeCount}</span>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="marine-content">
          <div className="marine-actions">
            <button onClick={handleToggleAll} className="action-button">
              {activeCount === 3 ? '✗ Fjern alle' : '✓ Velg alle'}
            </button>
          </div>

          <div className="marine-options">
            <label className={`marine-option ${options.showTemperature ? 'active' : ''}`}>
              <div>
                <input
                  type="checkbox"
                  checked={options.showTemperature}
                  onChange={() => handleToggle('showTemperature')}
                />
                <span className="option-icon">🌡️</span>
                <div className="option-info">
                  <span className="option-name">Sjøtemperatur</span>
                  <span className="option-desc">Overflatetemperatur</span>
                </div>
              </div>
              <div className="color-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'rgba(0, 100, 255, 0.6)' }}></span>
                  <span className="legend-text">Kaldt (&lt;5°C)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'rgba(0, 255, 100, 0.6)' }}></span>
                  <span className="legend-text">Moderat (8-12°C)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'rgba(255, 100, 0, 0.6)' }}></span>
                  <span className="legend-text">Varmt (&gt;16°C)</span>
                </div>
              </div>
            </label>

            <label className={`marine-option ${options.showWaves ? 'active' : ''}`}>
              <div>
                <input
                  type="checkbox"
                  checked={options.showWaves}
                  onChange={() => handleToggle('showWaves')}
                />
                <span className="option-icon">🌊</span>
                <div className="option-info">
                  <span className="option-name">Bølgehøyde</span>
                  <span className="option-desc">Høyde og retning</span>
                </div>
              </div>
            </label>

            <label className={`marine-option ${options.showCurrents ? 'active' : ''}`}>
              <div>
                <input
                  type="checkbox"
                  checked={options.showCurrents}
                  onChange={() => handleToggle('showCurrents')}
                />
                <span className="option-icon">💨</span>
                <div className="option-info">
                  <span className="option-name">Havstrømmer</span>
                  <span className="option-desc">Hastighet og retning</span>
                </div>
              </div>
            </label>
          </div>

          <div className="marine-info">
            <p>Data fra Open-Meteo Marine API</p>
            <p>Oppdateres hver 6. time</p>
          </div>
        </div>
      )}
    </div>
  );
}
