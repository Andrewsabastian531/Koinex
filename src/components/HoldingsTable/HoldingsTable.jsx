import { useState, useMemo } from 'react';
import { useHarvest } from '../../context/HarvestContext';
import { formatINR, formatCrypto, gainClass } from '../../utils/format';
import './HoldingsTable.css';

const INITIAL_VISIBLE = 8;

// ── Sub-components ──────────────────────────────────────────────

function Checkbox({ checked, indeterminate, onChange, id, label }) {
  return (
    <div className="checkbox-wrap">
      <div
        id={id}
        className={`custom-checkbox ${checked ? 'checked' : ''} ${indeterminate ? 'indeterminate' : ''}`}
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-label={label}
        tabIndex={0}
        onClick={onChange}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && onChange()}
      >
        {checked && !indeterminate && (
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {indeterminate && (
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

function CoinLogo({ src, alt, symbol }) {
  const [error, setError] = useState(false);
  const colors = ['#667eea', '#ed64a6', '#48bb78', '#ed8936', '#4299e1', '#9f7aea'];
  const colorIdx = symbol ? symbol.charCodeAt(0) % colors.length : 0;

  if (error || !src) {
    return (
      <div
        className="coin-logo-fallback"
        style={{ background: `linear-gradient(135deg, ${colors[colorIdx]}, ${colors[(colorIdx + 2) % colors.length]})` }}
        aria-label={alt}
      >
        {symbol?.slice(0, 2).toUpperCase() || '?'}
      </div>
    );
  }
  return (
    <img
      className="coin-logo"
      src={src}
      alt={alt}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

function GainCell({ gain, balance }) {
  const cls = gainClass(gain);
  const isNegligible = Math.abs(gain) < 1e-10 && Math.abs(balance) < 1e-10;

  if (isNegligible) {
    return <span className="gain-chip neutral">—</span>;
  }

  return (
    <div className="gain-cell">
      <span className={`gain-chip ${cls}`}>
        {gain > 0 ? '▲' : gain < 0 ? '▼' : '–'} {formatINR(Math.abs(gain))}
      </span>
      {balance !== 0 && (
        <span className="holdings-sub">{formatCrypto(Math.abs(balance))} units</span>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      {[...Array(7)].map((_, i) => (
        <td key={i}>
          <div className="skeleton skeleton-text" style={{ width: i === 0 ? '80%' : '60%', height: 14 }} />
        </td>
      ))}
    </tr>
  );
}

// ── Main Component ──────────────────────────────────────────────

export default function HoldingsTable() {
  const {
    holdings,
    selectedIds,
    loadingHoldings,
    errorHoldings,
    toggleHolding,
    selectAll,
    deselectAll,
  } = useHarvest();

  const [showAll, setShowAll] = useState(false);

  // Sort: by absolute short-term gain descending
  const sortedHoldings = useMemo(() => {
    return [...holdings].sort((a, b) => Math.abs(b.stcg.gain) - Math.abs(a.stcg.gain));
  }, [holdings]);

  const visibleHoldings = showAll ? sortedHoldings : sortedHoldings.slice(0, INITIAL_VISIBLE);
  const totalCount = sortedHoldings.length;
  const visibleCount = visibleHoldings.length;

  const allVisibleIndices = useMemo(
    () => sortedHoldings.map((_, i) => i),
    [sortedHoldings]
  );

  const selectedCount = selectedIds.size;
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  const handleSelectAll = () => {
    if (allSelected || someSelected) {
      deselectAll();
    } else {
      selectAll(allVisibleIndices);
    }
  };

  const handleRowClick = (index) => {
    toggleHolding(index);
  };

  if (errorHoldings) {
    return (
      <div className="holdings-section">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p className="error-title">Failed to load holdings</p>
          <p className="error-sub">{errorHoldings}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="holdings-section" aria-label="Holdings Table">
      <div className="holdings-header">
        <div>
          <h2 className="holdings-title">
            <span aria-hidden="true">📦</span> Holdings
          </h2>
          <p className="holdings-title-sub">
            {loadingHoldings ? 'Loading assets...' : `${totalCount} assets found`}
          </p>
        </div>
        <div className="holdings-actions">
          {selectedCount > 0 && (
            <span className="selected-count-badge" aria-live="polite">
              {selectedCount} selected
            </span>
          )}
          {selectedCount > 0 && (
            <button className="btn btn-ghost" onClick={deselectAll} id="deselect-all-btn">
              Clear Selection
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper" role="region" aria-label="Holdings data table">
        <table aria-label="Crypto holdings with tax loss harvesting options">
          <thead>
            <tr>
              <th scope="col" style={{ width: 44 }}>
                <Checkbox
                  id="select-all-checkbox"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                  label="Select all holdings"
                />
              </th>
              <th scope="col">Asset</th>
              <th scope="col">Holdings / Avg Buy Price</th>
              <th scope="col">Current Price</th>
              <th scope="col">Short-Term Gain</th>
              <th scope="col">Long-Term Gain</th>
              <th scope="col">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {loadingHoldings
              ? Array.from({ length: 6 }, (_, i) => <SkeletonRow key={i} />)
              : visibleHoldings.map((holding, idx) => {
                  const isSelected = selectedIds.has(idx);
                  const hasGain = Math.abs(holding.stcg.gain) > 1e-10 || Math.abs(holding.ltcg.gain) > 1e-10;

                  return (
                    <tr
                      key={`${holding.coin}-${holding.coinName}-${idx}`}
                      className={isSelected ? 'selected' : ''}
                      onClick={() => handleRowClick(idx)}
                      role="row"
                      aria-selected={isSelected}
                    >
                      {/* Checkbox */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          id={`checkbox-holding-${idx}`}
                          checked={isSelected}
                          onChange={() => handleRowClick(idx)}
                          label={`Select ${holding.coinName}`}
                        />
                      </td>

                      {/* Asset */}
                      <td>
                        <div className="coin-cell">
                          <CoinLogo
                            src={holding.logo}
                            alt={holding.coinName}
                            symbol={holding.coin}
                          />
                          <div className="coin-info">
                            <span className="coin-symbol">{holding.coin}</span>
                            <span className="coin-name" title={holding.coinName}>
                              {holding.coinName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Holdings / Avg Buy Price */}
                      <td>
                        <div className="holdings-cell">
                          <span className="holdings-value">
                            {formatCrypto(holding.totalHolding)} {holding.coin}
                          </span>
                          <span className="holdings-sub">
                            Avg: {formatINR(holding.averageBuyPrice, 4)}
                          </span>
                        </div>
                      </td>

                      {/* Current Price */}
                      <td>
                        <span className="price-cell">{formatINR(holding.currentPrice, 2)}</span>
                      </td>

                      {/* Short-Term Gain */}
                      <td>
                        <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} />
                      </td>

                      {/* Long-Term Gain */}
                      <td>
                        <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} />
                      </td>

                      {/* Amount to Sell */}
                      <td>
                        {isSelected ? (
                          <span className="amount-cell">
                            {formatCrypto(holding.totalHolding)} {holding.coin}
                          </span>
                        ) : (
                          <span className="amount-cell empty">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* View All Toggle */}
      {!loadingHoldings && totalCount > INITIAL_VISIBLE && (
        <div className="view-all-row">
          <button
            className={`view-all-btn ${showAll ? 'expanded' : ''}`}
            id="view-all-holdings-btn"
            onClick={() => setShowAll(!showAll)}
            aria-expanded={showAll}
          >
            {showAll
              ? `Show less`
              : `View all ${totalCount} assets (${totalCount - visibleCount} more)`}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 10.293L2.854 5.146a.5.5 0 0 0-.708.708l5.5 5.5a.5.5 0 0 0 .708 0l5.5-5.5a.5.5 0 0 0-.708-.708L8 10.293z" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
