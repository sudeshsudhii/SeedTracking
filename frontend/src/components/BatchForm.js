import React, { useState } from 'react';
import { Sprout, Upload, CheckCircle, AlertCircle, Loader2, Award } from 'lucide-react';
import { SEED_TYPES } from '../constants/seedTypes';
import { seedService } from '../services/api';
import QrCodeDisplay from './QrCodeDisplay';

const BatchForm = () => {
  const [mode, setMode] = useState('batch'); // 'batch' or 'certificate'

  // Batch fields
  const [cropType, setCropType] = useState('wheat');
  const [seedVariety, setSeedVariety] = useState('');
  const [quantity, setQuantity] = useState(1000);
  const [expiryDate, setExpiryDate] = useState('');

  // Certificate fields
  const [certBatchId, setCertBatchId] = useState('');
  const [certExpiryDate, setCertExpiryDate] = useState('');
  const [labName, setLabName] = useState('');
  const [germinationRate, setGerminationRate] = useState(95);
  const [purityPercent, setPurityPercent] = useState(99);
  const [moistureContent, setMoistureContent] = useState(12);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [response, setResponse] = useState(null);

  const currentSeed = SEED_TYPES.find(s => s.id === cropType);
  const varieties = currentSeed?.varieties || [];

  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null); setResponse(null);
    setLoading(true);

    try {
      const result = await seedService.createBatch({
        cropType,
        seedVariety: seedVariety || varieties[0],
        quantity: Number(quantity),
        expiryDate
      });

      if (result.success) {
        setSuccess('✅ Batch processed successfully. Your transaction is now verifiable on the ledger.');
        setResponse({ type: 'batch', data: result });
      } else {
        setError(result.message || 'Failed to create batch');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCertificate = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null); setResponse(null);
    setLoading(true);

    try {
      const result = await seedService.registerCertificate({
        batchId: Number(certBatchId),
        certificateData: {
          labName,
          germinationRate: Number(germinationRate),
          purityPercent: Number(purityPercent),
          moistureContent: Number(moistureContent),
          testStandard: 'ISTA',
          passStatus: germinationRate >= 70 ? 'PASS' : 'FAIL'
        },
        expiryDate: certExpiryDate
      });

      if (result.success) {
        setSuccess('✅ Certificate registered successfully. Quality data is now immutable.');
        setResponse({ type: 'certificate', data: result });
      } else {
        setError(result.message || 'Failed to register certificate');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Record Supply Chain Event
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Create a new trackable seed batch or issue a recognized quality certificate into the blockchain network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation & Forms */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
          
          <div className="flex bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
            <button
              onClick={() => { setMode('batch'); setError(null); setSuccess(null); setResponse(null); }}
              className={`flex-1 flex flex-col items-center justify-center py-6 font-bold transition duration-300 ${
                mode === 'batch' 
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 border-b-4 border-emerald-500 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Sprout className="h-8 w-8 mb-2" />
              <span>Register Seed Batch</span>
            </button>
            <button
              onClick={() => { setMode('certificate'); setError(null); setSuccess(null); setResponse(null); }}
              className={`flex-1 flex flex-col items-center justify-center py-6 font-bold transition duration-300 ${
                mode === 'certificate' 
                   ? 'bg-white dark:bg-slate-800 text-emerald-600 border-b-4 border-emerald-500 shadow-sm' 
                   : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Award className="h-8 w-8 mb-2" />
              <span>Issue Certificate</span>
            </button>
          </div>

          <div className="p-8">
            {mode === 'batch' && (
              <form onSubmit={handleSubmitBatch} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Crop Type</label>
                    <select value={cropType} onChange={(e) => { setCropType(e.target.value); setSeedVariety(''); }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" disabled={loading}>
                      {SEED_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Seed Variety</label>
                    <select value={seedVariety} onChange={(e) => setSeedVariety(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" disabled={loading}>
                      <option value="">Select official variety...</option>
                      {varieties.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Quantity (grams)</label>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" min="1" required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Expiry Date (YYYY-MM-DD)</label>
                    <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                      min={new Date().toISOString().split('T')[0]} required disabled={loading} />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading || !seedVariety}
                    className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none delay-75 hover:-translate-y-1'}`}>
                    {loading ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /><span>Syncing to Blockchain...</span></>
                    ) : (
                      <><Upload className="h-5 w-5" /><span>Execute Batch Creation</span></>
                    )}
                  </button>
                </div>
              </form>
            )}

            {mode === 'certificate' && (
              <form onSubmit={handleSubmitCertificate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide text-blue-600 dark:text-blue-400">Target Batch ID</label>
                    <input type="number" value={certBatchId} onChange={(e) => setCertBatchId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 transition" placeholder="Enter corresponding Batch ID" min="1" required disabled={loading} />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide mt-2">Authority / Lab</label>
                    <input type="text" value={labName} onChange={(e) => setLabName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="IARI Seed Lab" required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide mt-2">Cert Expiry Date</label>
                    <input type="date" value={certExpiryDate} onChange={(e) => setCertExpiryDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                      min={new Date().toISOString().split('T')[0]} required disabled={loading} />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Germination %</label>
                    <input type="number" value={germinationRate} onChange={(e) => setGerminationRate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" min="0" max="100" step="0.1" required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Purity %</label>
                    <input type="number" value={purityPercent} onChange={(e) => setPurityPercent(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" min="0" max="100" step="0.1" required disabled={loading} />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading || !certBatchId || !labName}
                    className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-none delay-75 hover:-translate-y-1'}`}>
                    {loading ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /><span>Registering on Ledger...</span></>
                    ) : (
                      <><Award className="h-5 w-5" /><span>Execute Certification</span></>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Status / Output */}
        <div className="lg:col-span-5 h-full">
          {!error && !success && !response && (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl p-10 text-center bg-gray-50 dark:bg-slate-800/50">
              <Sprout className="h-16 w-16 text-gray-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">Waiting for Submission</h3>
              <p className="text-sm text-gray-400 mt-2">Fill out the required data and execute to sync with the blockchain network.</p>
            </div>
          )}

          {error && (
            <div className="h-full p-8 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-3xl flex flex-col items-center text-center justify-center animate-slide-up">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Transaction Failed</h3>
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          {success && response && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl shadow-xl overflow-hidden border border-emerald-100 dark:border-slate-600 animate-slide-up">
              <div className="bg-emerald-600 p-6 flex items-center gap-4 text-white">
                <CheckCircle className="h-10 w-10 text-emerald-200" />
                <div>
                  <h3 className="text-xl font-extrabold">{response.type === 'batch' ? `Batch Created` : `Certificate Issued`}</h3>
                  <p className="text-emerald-100 font-medium text-sm">Blockchain log recorded successfully.</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div><span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Generated ID</span><div className="text-3xl font-black text-gray-900 dark:text-white">#{response.type === 'batch' ? response.data.batchId : response.data.certId}</div></div>
                  <div><span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Tx Hash</span><div className="font-mono text-sm bg-white dark:bg-slate-900 p-2 rounded break-all dark:text-gray-300 border border-gray-100 dark:border-slate-600">{response.data.txHash}</div></div>
                  <div><span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">IPFS Hash</span><div className="font-mono text-sm bg-white dark:bg-slate-900 p-2 rounded break-all dark:text-gray-300 border border-gray-100 dark:border-slate-600">{response.data.ipfsHash}</div></div>
                </div>

                <div className="border-t border-emerald-100 dark:border-slate-600 pt-6 flex flex-col justify-center items-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Blockchain QR Tag</span>
                  <QrCodeDisplay data={JSON.stringify({ 
                    type: response.type === 'batch' ? 'SEED_BATCH' : 'CERTIFICATE', 
                    id: response.type === 'batch' ? response.data.batchId : response.data.certId,
                    tx: response.data.txHash,
                    ipfs: response.data.ipfsHash
                  })} size={144} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchForm;
