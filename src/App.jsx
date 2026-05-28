import { HarvestProvider } from './context/HarvestContext';
import Sidebar from './components/Sidebar/Sidebar';
import TaxHarvestingPage from './pages/TaxHarvestingPage';

export default function App() {
  return (
    <HarvestProvider>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <TaxHarvestingPage />
        </main>
      </div>
    </HarvestProvider>
  );
}
