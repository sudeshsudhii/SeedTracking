import React, { useState } from 'react';
import { GitBranch, Search, Loader2, Package, ArrowDown, AlertCircle } from 'lucide-react';
import { seedService } from '../services/api';

const BatchLineage = () => {
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [lineageData, setLineageData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!batchId.trim()) return;
    setLoading(true);
    setError(null);
    setLineageData(null);

    try {
      const data = await seedService.getBatchHistory(Number(batchId));
      setLineageData(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch lineage');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (ts) => ts ? new Date(ts * 1000).toLocaleDateString() : 'N/A';
  const formatAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : 'N/A';

  const getNodeColor = (batch) => {
    if (batch.status === 2) return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    if (batch.expiryDate <= Date.now() / 1000) return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-4">
          <GitBranch className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">Batch Lineage</h1>
        <p className="text-gray-600 dark:text-gray-300">Trace the full parent-child history of any seed batch</p>
      </div>

      <div className="card dark:bg-slate-800 mb-8">
        <div className="flex space-x-3">
          <input type="number" value={batchId} onChange={(e) => setBatchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter Batch ID..." className="input-field flex-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
          <button onClick={handleSearch} disabled={loading || !batchId.trim()}
            className="btn-primary px-6 bg-purple-600 hover:bg-purple-700 flex items-center space-x-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            <span>Trace</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3 mb-6">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {lineageData && (
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🌳 Lineage Tree</h2>

          {/* Parent Chain */}
          <div className="relative">
            {lineageData.lineage.map((batch, index) => (
              <div key={batch.batchId}>
                <div className={`border-l-4 ${getNodeColor(batch)} rounded-lg p-4 ml-6 relative`}>
                  {/* Connector dot */}
                  <div className="absolute -left-[26px] top-4 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-emerald-500"></div>

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">Batch #{batch.batchId}</span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{batch.cropType} — {batch.seedVariety}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      batch.status === 2 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                      : batch.expiryDate <= Date.now() / 1000 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    }`}>
                      {batch.statusLabel || (batch.status === 2 ? 'TRANSFERRED' : batch.expiryDate <= Date.now() / 1000 ? 'EXPIRED' : 'ACTIVE')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div><span className="text-xs text-gray-500 dark:text-gray-400">Quantity</span><div className="font-semibold dark:text-white">{batch.quantity}g</div></div>
                    <div><span className="text-xs text-gray-500 dark:text-gray-400">Expiry</span><div className="font-semibold dark:text-white">{formatDate(batch.expiryDate)}</div></div>
                    <div><span className="text-xs text-gray-500 dark:text-gray-400">Owner</span><div className="font-mono text-xs dark:text-gray-300">{formatAddr(batch.ownerAddress)}</div></div>
                  </div>

                  {batch.parentBatchId > 0 && (
                    <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-semibold">↑ Split from Batch #{batch.parentBatchId}</div>
                  )}
                </div>

                {/* Connector line */}
                {index < lineageData.lineage.length - 1 && (
                  <div className="flex items-center justify-center py-1 ml-6">
                    <ArrowDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Children */}
          {lineageData.childBatchIds && lineageData.childBatchIds.length > 0 && (
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">🌿 Child Batches (Splits)</h3>
              <div className="flex flex-wrap gap-2">
                {lineageData.childBatchIds.map(childId => (
                  <button key={childId} onClick={() => { setBatchId(String(childId)); }}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded-full text-sm font-semibold hover:bg-purple-200 dark:hover:bg-purple-700 transition">
                    Batch #{childId}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchLineage;
