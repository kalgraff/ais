/**
 * Filterkomponent for å velge hvilke skip-typer som skal vises
 */

import { useState } from 'react';
import { ShipType } from '../types/ais';
import './ShipTypeFilter.css';

interface ShipTypeCategory {
  name: string;
  emoji: string;
  types: number[];
  color: string;
}

// Grupperte skip-kategorier med norske navn
const SHIP_CATEGORIES: ShipTypeCategory[] = [
  {
    name: 'Bøyer (BUOY)',
    emoji: '🟠',
    types: [-1], // Spesiell verdi for navn-basert filtrering
    color: '#FF6F00',
  },
  {
    name: 'Plattformer / Rigger',
    emoji: '🛢️',
    types: [-2], // Spesiell verdi for navn-basert filtrering
    color: '#8B4513',
  },
  {
    name: 'Akvakultur / Fiskeoppdrett',
    emoji: '🐟',
    types: [-3], // Spesiell verdi for navn-basert filtrering
    color: '#00CED1',
  },
  {
    name: 'Fiskebåter',
    emoji: '🎣',
    types: [ShipType.Fishing],
    color: '#4CAF50',
  },
  {
    name: 'Lasteskip / Fraktebåter',
    emoji: '📦',
    types: [
      ShipType.Cargo,
      ShipType.CargoHazardousCategoryA,
      ShipType.CargoHazardousCategoryB,
      ShipType.CargoHazardousCategoryC,
      ShipType.CargoHazardousCategoryD,
    ],
    color: '#FF9800',
  },
  {
    name: 'Tankskip',
    emoji: '🛢️',
    types: [
      ShipType.Tanker,
      ShipType.TankerHazardousCategoryA,
      ShipType.TankerHazardousCategoryB,
      ShipType.TankerHazardousCategoryC,
      ShipType.TankerHazardousCategoryD,
    ],
    color: '#F44336',
  },
  {
    name: 'Passasjerskip / Ferjer',
    emoji: '⛴️',
    types: [
      ShipType.PassengerShip,
      ShipType.PassengerShipHazardousCategoryA,
      ShipType.PassengerShipHazardousCategoryB,
      ShipType.PassengerShipHazardousCategoryC,
      ShipType.PassengerShipHazardousCategoryD,
    ],
    color: '#2196F3',
  },
  {
    name: 'Hurtigbåter',
    emoji: '🚤',
    types: [
      ShipType.HighSpeedCraft,
      ShipType.HighSpeedCraftHazardousCategoryA,
      ShipType.HighSpeedCraftHazardousCategoryB,
      ShipType.HighSpeedCraftHazardousCategoryC,
      ShipType.HighSpeedCraftHazardousCategoryD,
    ],
    color: '#00BCD4',
  },
  {
    name: 'Slepe- og Taubåter',
    emoji: '🚢',
    types: [ShipType.Towing, ShipType.TowingLarge, ShipType.Tug],
    color: '#795548',
  },
  {
    name: 'Fritidsbåter',
    emoji: '⛵',
    types: [ShipType.Sailing, ShipType.PleasureCraft],
    color: '#9C27B0',
  },
  {
    name: 'Losbåter',
    emoji: '🧭',
    types: [ShipType.PilotVessel],
    color: '#3F51B5',
  },
  {
    name: 'Redningsskøyter',
    emoji: '🚁',
    types: [ShipType.SearchAndRescueVessel],
    color: '#E91E63',
  },
  {
    name: 'Havnebåter',
    emoji: '⚓',
    types: [ShipType.PortTender],
    color: '#607D8B',
  },
  {
    name: 'Spesialfartøy',
    emoji: '🔧',
    types: [
      ShipType.DredgingOrUnderwaterOps,
      ShipType.DivingOps,
      ShipType.AntiPollutionEquipment,
    ],
    color: '#FFC107',
  },
  {
    name: 'Militære fartøy',
    emoji: '🛡️',
    types: [ShipType.MilitaryOps],
    color: '#455A64',
  },
  {
    name: 'Ambulansebåter',
    emoji: '🏥',
    types: [ShipType.MedicalTransport],
    color: '#FF5722',
  },
  {
    name: 'Politi / Kystvakt',
    emoji: '👮',
    types: [ShipType.LawEnforcement],
    color: '#1976D2',
  },
  {
    name: 'Ekranoplan (WIG)',
    emoji: '✈️',
    types: [
      ShipType.WingInGround,
      ShipType.WingInGroundHazardousCategoryA,
      ShipType.WingInGroundHazardousCategoryB,
      ShipType.WingInGroundHazardousCategoryC,
      ShipType.WingInGroundHazardousCategoryD,
    ],
    color: '#9E9E9E',
  },
  {
    name: 'Andre / Ukjent',
    emoji: '❓',
    types: [ShipType.Other, ShipType.NotAvailable],
    color: '#757575',
  },
];

interface ShipTypeFilterProps {
  selectedTypes: Set<number>;
  onToggleType: (types: number[]) => void;
  shipCounts: Map<number, number>;
}

export function ShipTypeFilter({
  selectedTypes,
  onToggleType,
  shipCounts,
}: ShipTypeFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCategoryToggle = (category: ShipTypeCategory) => {
    onToggleType(category.types);
  };

  const handleSelectAll = () => {
    const allTypes = SHIP_CATEGORIES.flatMap((cat) => cat.types);
    onToggleType(allTypes);
  };

  const handleDeselectAll = () => {
    onToggleType([]);
  };

  const isCategorySelected = (category: ShipTypeCategory) => {
    return category.types.some((type) => selectedTypes.has(type));
  };

  const getCategoryCount = (category: ShipTypeCategory) => {
    return category.types.reduce((sum, type) => sum + (shipCounts.get(type) || 0), 0);
  };

  const totalSelected = selectedTypes.size;
  const totalAvailable = SHIP_CATEGORIES.flatMap((cat) => cat.types).length;

  return (
    <div className="ship-type-filter">
      <div className="filter-header">
        <button
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
          <span className="filter-title">🚢 Skip-typer</span>
          <span className="filter-count">
            {totalSelected} / {totalAvailable}
          </span>
        </button>
      </div>

      {isExpanded && (
        <div className="filter-content">
          <div className="filter-actions">
            <button onClick={handleSelectAll} className="action-button">
              ✓ Velg alle
            </button>
            <button onClick={handleDeselectAll} className="action-button">
              ✗ Fjern alle
            </button>
          </div>

          <div className="filter-list">
            {SHIP_CATEGORIES.map((category) => {
              const isSelected = isCategorySelected(category);
              const count = getCategoryCount(category);

              return (
                <label
                  key={category.name}
                  className={`filter-item ${isSelected ? 'selected' : ''} ${count === 0 ? 'disabled' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCategoryToggle(category)}
                    disabled={count === 0}
                  />
                  <span
                    className="color-indicator"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="category-emoji">{category.emoji}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">
                    {count > 0 ? `(${count})` : '(0)'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
