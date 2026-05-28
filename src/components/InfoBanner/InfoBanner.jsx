import './InfoBanner.css';

export default function InfoBanner() {
  return (
    <div className="info-banner" role="complementary" aria-label="Tax Loss Harvesting Information">
      <div className="info-banner-icon" aria-hidden="true">💡</div>
      <div className="info-banner-content">
        <p className="info-banner-text">
          <strong>How Tax Loss Harvesting Works:</strong> Select holdings below to see how selling them affects your capital gains.
          Selling assets at a <em>loss</em> offsets your gains, reducing your tax liability.
          Assets with positive gains can still be selected to recalculate projections.
        </p>
      </div>
      <button className="info-banner-close" aria-label="Dismiss info banner">✕</button>
    </div>
  );
}
