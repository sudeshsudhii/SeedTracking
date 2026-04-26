import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, RefreshCw, ArrowRightLeft, Scissors, Award, AlertTriangle, Clock, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { seedService } from '../services/api';

const BatchExplorer = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');

  // Transfer modal
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');
  const [transferBatchId, setTransferBatchId] = useState(null);

  // Split modal
  const [showSplit, setShowSplit] = useState(false);
  const [splitQuantity, setSplitQuantity] = useState('');
  const [splitBatchId, setSplitBatchId] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => { fetchBatches(); }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const data = await seedService.getAllBatches();
      setBatches(data);
    } catch (e) {
      console.error('Failed to fetch batches:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) { fetchBatches(); return; }
    try {
      await seedService.getBatch(Number(searchId));
      setBatches(batches.filter(b => String(b.batchId) === searchId));
    } catch (e) {
      setActionMessage({ type: 'error', text: `Batch #${searchId} not found` });
    }
  };

  const clearSearch = () => {
      setSearchId('');
      fetchBatches();
  }

  const handleTransfer = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionMessage(null);
    try {
      const result = await seedService.transferBatch(transferBatchId, transferAddress);
      setActionMessage({ type: 'success', text: `Transferred! Tx: ${result.txHash?.slice(0, 18)}...` });
      setShowTransfer(false);
      setTransferAddress('');
      fetchBatches();
    } catch (e) {
      setActionMessage({ type: 'error', text: e.response?.data?.error || e.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSplit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionMessage(null);
    try {
      const result = await seedService.splitBatch(splitBatchId, Number(splitQuantity));
      setActionMessage({ type: 'success', text: `Split! Child Batch #${result.childBatchId}. Tx: ${result.txHash?.slice(0, 18)}...` });
      setShowSplit(false);
      setSplitQuantity('');
      fetchBatches();
    } catch (e) {
      setActionMessage({ type: 'error', text: e.response?.data?.error || e.message });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (batch) => {
    if (batch.isExpired || batch.statusLabel === 'EXPIRED') {
      return <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center shadow-sm space-x-1"><AlertTriangle className="h-4 w-4" /><span>EXPIRED</span></span>;
    }
    if (batch.statusLabel === 'TRANSFERRED') {
      return <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 flex items-center shadow-sm space-x-1"><ArrowRightLeft className="h-4 w-4" /><span>TRANSFERRED</span></span>;
    }
    if (batch.certIPFSHash && batch.certIPFSHash.length > 0) {
      return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center shadow-sm space-x-1"><Award className="h-4 w-4" /><span>VERIFIED</span></span>;
    }
    return <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center shadow-sm space-x-1"><CheckCircle className="h-4 w-4" /><span>ACTIVE</span></span>;
  };

  const formatDate = (ts) => ts ? new Date(ts * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  const formatAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : 'N/A';

  const filteredBatches = searchId ? batches.filter(b => String(b.batchId) === searchId) : batches;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">Batch Explorer</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
           Browse the global seed supply chain ledger. Verify batches, view lineage, and manage product ownership directly from the explorer.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-10 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center">
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 h-6 w-6 text-gray-400" />
          <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by Batch ID..." className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 dark:text-white outline-none font-medium" />
        </div>
        <button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition mr-2">Search</button>
        <button onClick={clearSearch} className="p-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition">
          <RefreshCw className={`h-6 w-6 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Action Messages */}
      {actionMessage && (
        <div className={`mb-8 p-4 rounded-xl text-sm flex items-center justify-center space-x-2 max-w-2xl mx-auto shadow-sm ${actionMessage.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
          {actionMessage.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span className="font-semibold text-base">{actionMessage.text}</span>
        </div>
      )}

      {/* Batch Grid */}
      {loading ? (
        <div className="text-center py-20"><RefreshCw className="h-12 w-12 text-emerald-500 animate-spin mx-auto mb-4" /><p className="text-gray-500 font-medium text-lg">Syncing from blockchain...</p></div>
      ) : filteredBatches.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700"><Package className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 text-lg font-medium">No batches found matching criteria</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBatches.map(batch => (
            <div key={batch.batchId} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
              
              <div className="flex justify-between items-start mb-6 mt-2">
                <div>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1 block">Batch #{batch.batchId}</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{batch.cropType}</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">{batch.seedVariety}</p>
                </div>
                {getStatusBadge(batch)}
              </div>

              <div className="space-y-4 text-sm mb-8 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl">
                <div className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 uppercase font-bold text-xs">Quantity</span><span className="font-bold text-lg dark:text-white">{batch.quantity}g</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 uppercase font-bold text-xs">Expiry</span>
                  <span className={`font-semibold ${batch.isExpired ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                    {formatDate(batch.expiryDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 uppercase font-bold text-xs">Owner</span><span className="font-mono text-xs font-semibold dark:text-gray-300 bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">{formatAddr(batch.ownerAddress)}</span></div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Link to={`/verify?batchId=${batch.batchId}`} className="w-full py-3 bg-gray-900 hover:bg-black text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md">
                   <ShieldCheck className="h-5 w-5" /> <span>Verify Authenticity</span>
                </Link>
                
                {batch.statusLabel === 'ACTIVE' && !batch.isExpired && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => { setTransferBatchId(batch.batchId); setShowTransfer(true); setActionMessage(null); }}
                      className="py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-1.5 transition">
                      <ArrowRightLeft className="h-4 w-4" /><span>Transfer</span>
                    </button>
                    <button onClick={() => { setSplitBatchId(batch.batchId); setSplitQuantity(''); setShowSplit(true); setActionMessage(null); }}
                      className="py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-slate-700 dark:text-purple-400 dark:hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-1.5 transition">
                      <Scissors className="h-4 w-4" /><span>Split</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in border border-gray-100 dark:border-slate-700">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center"><ArrowRightLeft className="mr-3 text-blue-500"/> Transfer Batch #{transferBatchId}</h3>
            <form onSubmit={handleTransfer} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">New Owner Address</label>
                <input type="text" value={transferAddress} onChange={(e) => setTransferAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="0x..." required />
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowTransfer(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-bold rounded-xl transition">Cancel</button>
                <button type="submit" disabled={actionLoading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition">
                  {actionLoading ? 'Transferring...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Split Modal */}
      {showSplit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in border border-gray-100 dark:border-slate-700">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center"><Scissors className="mr-3 text-purple-500"/> Split Batch #{splitBatchId}</h3>
            <form onSubmit={handleSplit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Split Quantity (grams)</label>
                <input type="number" value={splitQuantity} onChange={(e) => setSplitQuantity(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition" placeholder="e.g. 500" min="1" required />
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowSplit(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-bold rounded-xl transition">Cancel</button>
                <button type="submit" disabled={actionLoading} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition">
                  {actionLoading ? 'Splitting...' : 'Confirm Split'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchExplorer;
