import { useHarvest } from '../../context/HarvestContext';
import { formatINR, netGain, realisedCapitalGains, gainClass } from '../../utils/format';
import './CapitalGainsCard.css';

function GainRow({ label, value }) {
  const cls = gainClass(value);
  return (
    <div className="gain-row">
      <span className="gain-row-label">{label}</span>
      <span className={`gain-row-value ${cls}`}>{formatINR(value)}</span>
    </div>
  );
}

function GainSection({ label, gains, variant }) {
  const net = netGain(gains);
  return (
    <div className="gain-section">
      <div className={`gain-section-label gain-section-label--${variant}`}>{label}</div>
      <div className="gain-section-rows">
        <GainRow label="Profits" value={gains.profits} />
        <GainRow label="Losses" value={-gains.losses} />
        <GainRow label="Net Gain" value={net} />
      </div>
    </div>
  );
}

function SkeletonCard({ dark }) {
  return (
    <div className={`gain-card ${dark ? 'gain-card--dark' : 'gain-card--blue'}`}>
      <div className="card-header">
        <div className="skeleton skeleton-text" style={{ width: 160, height: 18 }} />
      </div>
      <div className="gain-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="gain-section">
            <div className="skeleton skeleton-text" style={{ width: 80, height: 12, marginBottom: 12 }} />
            {[1, 2, 3].map(j => (
              <div key={j} className="skeleton skeleton-text" style={{ width: '80%', height: 14, marginBottom: 8 }} />
            ))}
          </div>
        ))}
      </div>
      <hr className="gain-divider" />
      <div className="skeleton skeleton-text" style={{ width: 200, height: 20 }} />
    </div>
  );
}

export default function CapitalGainsCards() {
  const {
    capitalGains,
    afterHarvestingGains,
    loadingGains,
    errorGains,
  } = useHarvest();

  if (loadingGains) {
    return (
      <div className="cards-grid">
        <SkeletonCard dark />
        <SkeletonCard />
      </div>
    );
  }

  if (errorGains || !capitalGains) {
    return (
      <div className="cards-grid">
        <div className="gain-card gain-card--dark error-state">
          <span className="error-icon">⚠️</span>
          <p className="error-title">Failed to load capital gains</p>
          <p className="error-sub">{errorGains}</p>
        </div>
      </div>
    );
  }

  const pre = capitalGains.capitalGains;
  const post = afterHarvestingGains?.capitalGains ?? pre;

  const preRealised = realisedCapitalGains(pre);
  const postRealised = realisedCapitalGains(post);
  const savings = preRealised - postRealised;
  const showSavings = preRealised > postRealised && savings > 0.01;

  return (
    <div className="cards-grid animate-fade-in">
      {/* Pre-Harvesting Card */}
      <div className="gain-card gain-card--dark" role="region" aria-label="Pre-Harvesting Capital Gains">
        <div className="card-header">
          <h2 className="card-title">
            <span className="card-title-icon card-title-icon--dark" aria-hidden="true">📋</span>
            Pre-Harvesting
          </h2>
          <span className="info-tooltip" title="Capital gains before tax loss harvesting">
            <span className="info-icon">i</span>
          </span>
        </div>

        <div className="gain-grid">
          <GainSection label="Short-Term" gains={pre.stcg} variant="dark" />
          <GainSection label="Long-Term" gains={pre.ltcg} variant="dark" />
          <div className="gain-section realised-section">
            <div className="gain-section-label gain-section-label--dark">Realised</div>
            <div className="realised-total">
              <div className={`realised-gains-value ${gainClass(preRealised)}`}>
                {formatINR(preRealised)}
              </div>
              <div className="gain-row-label" style={{ marginTop: 4 }}>Total Capital Gains</div>
            </div>
          </div>
        </div>

        <hr className="gain-divider" />

        <div className="realised-gains-row">
          <span className="realised-gains-label">Realised Capital Gains</span>
          <span className={`realised-gains-value ${gainClass(preRealised)}`}>
            {formatINR(preRealised)}
          </span>
        </div>
      </div>

      {/* After Harvesting Card */}
      <div className="gain-card gain-card--blue" role="region" aria-label="After Harvesting Capital Gains">
        <div className="card-header">
          <h2 className="card-title">
            <span className="card-title-icon card-title-icon--blue" aria-hidden="true">✨</span>
            After Harvesting
          </h2>
          <span className="info-tooltip" title="Projected capital gains after harvesting selected holdings">
            <span className="info-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>i</span>
          </span>
        </div>

        <div className="gain-grid">
          <GainSection label="Short-Term" gains={post.stcg} variant="blue" />
          <GainSection label="Long-Term" gains={post.ltcg} variant="blue" />
          <div className="gain-section realised-section">
            <div className="gain-section-label gain-section-label--blue">Realised</div>
            <div className="realised-total">
              <div className={`realised-gains-value ${gainClass(postRealised)}`}>
                {formatINR(postRealised)}
              </div>
              <div className="gain-row-label" style={{ marginTop: 4, color: 'rgba(255,255,255,0.6)' }}>Total Capital Gains</div>
            </div>
          </div>
        </div>

        <hr className="gain-divider" />

        <div className="realised-gains-row">
          <span className="realised-gains-label">Realised Capital Gains</span>
          <span className={`realised-gains-value ${gainClass(postRealised)}`}>
            {formatINR(postRealised)}
          </span>
        </div>

        {showSavings && (
          <div className="savings-banner" role="status" aria-live="polite">
            <span className="savings-banner-icon" aria-hidden="true">🎉</span>
            <span className="savings-banner-text">
              You're going to save {formatINR(savings)}!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
