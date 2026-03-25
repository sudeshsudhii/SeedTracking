import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateBatch from './pages/CreateBatch';
import BatchesPage from './pages/BatchesPage';
import Timeline from './pages/Timeline';
import VerifyPage from './pages/VerifyPage';
import LineagePage from './pages/LineagePage';
import SeedDashboard from './pages/SeedDashboard';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <Navbar />
          <main className="pb-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-batch" element={<CreateBatch />} />
              <Route path="/batches" element={<BatchesPage />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/lineage" element={<LineagePage />} />
              <Route path="/dashboard" element={<SeedDashboard />} />
              {/* Legacy redirect */}
              <Route path="/pds" element={<SeedDashboard />} />
              <Route path="/add-event" element={<CreateBatch />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
