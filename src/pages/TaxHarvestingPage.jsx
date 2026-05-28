import CapitalGainsCards from '../components/CapitalGainsCards/CapitalGainsCard';
import HoldingsTable from '../components/HoldingsTable/HoldingsTable';
import InfoBanner from '../components/InfoBanner/InfoBanner';
import './TaxHarvestingPage.css';

export default function TaxHarvestingPage() {
  return (
    <>
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-title-group">
          <h1 className="topbar-title">Tax Loss Harvesting</h1>
          <p className="topbar-subtitle">Optimise your crypto tax liability</p>
        </div>
        <div className="topbar-right">
          <div className="topbar-badge">
            <span aria-hidden="true">🟢</span>
            FY 2023–24
          </div>
          <div className="topbar-badge topbar-badge--dark">
            <span aria-hidden="true">📅</span>
            Live
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="page-container">
        <InfoBanner />
        <CapitalGainsCards />
        <HoldingsTable />
      </div>
    </>
  );
}
