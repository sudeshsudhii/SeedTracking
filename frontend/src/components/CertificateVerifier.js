import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Hash, Loader2, CheckCircle, XCircle, AlertCircle, AlertTriangle, Award, QrCode, Camera, X } from 'lucide-react';
import { seedService } from '../services/api';
import QrCodeDisplay from './QrCodeDisplay';
import QRScanner from './QRScanner';

const CertificateVerifier = () => {
  const location = useLocation();
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState('CERTIFICATE'); // 'CERTIFICATE' or 'BATCH'
  const [scannerOpen, setScannerOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Parse trailing query params on load (e.g. ?batchId=123)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('batchId')) {
      setInputType('BATCH');
      setInputValue(searchParams.get('batchId'));
      setTimeout(() => triggerVerification('BATCH', searchParams.get('batchId')), 100);
    }
  }, [location.search]);

  const triggerVerification = async (type, id) => {
    if (!id || !String(id).trim()) { 
      setError('Please enter a valid ID'); 
      return; 
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setScannerOpen(false);

    try {
      let certIdToVerify = Number(id);

      // If user provided a Batch ID, we first lookup the cert associated with it
      if (type === 'BATCH') {
        const certData = await seedService.getCertificateByBatch(Number(id));
        certIdToVerify = Number(certData.certId);
      }

      // Then verify that cert
      const verificationData = await seedService.verifyCertificate(certIdToVerify);
      setResult(verificationData);

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Verification failed. No valid certificate found.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerify = () => {
    triggerVerification(inputType, inputValue);
  };

  const handleScanSuccess = (decodedText) => {
    try {
      // Try to parse as JSON (matches our QrCodeDisplay format)
      const data = JSON.parse(decodedText);
      if (data.type === 'SEED_BATCH') {
        setInputType('BATCH');
        setInputValue(data.id);
        triggerVerification('BATCH', data.id);
      } else if (data.type === 'CERTIFICATE') {
        setInputType('CERTIFICATE');
        setInputValue(data.id);
        triggerVerification('CERTIFICATE', data.id);
      } else {
        // Fallback: assume the raw text is the ID
        setInputValue(decodedText);
        triggerVerification(inputType, decodedText);
      }
    } catch {
      // Not JSON, assume plain text ID
      setInputValue(decodedText);
      triggerVerification(inputType, decodedText);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VALID': return <CheckCircle className="h-16 w-16 text-emerald-500" />;
      case 'EXPIRED': return <AlertTriangle className="h-16 w-16 text-yellow-500" />;
      case 'TAMPERED': return <XCircle className="h-16 w-16 text-red-500" />;
      case 'REVOKED': return <XCircle className="h-16 w-16 text-red-500" />;
      default: return <AlertCircle className="h-16 w-16 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VALID': return 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
      case 'EXPIRED': return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'TAMPERED': return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      case 'REVOKED': return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default: return 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'VALID': return { title: 'Authentic & Valid', desc: 'This certificate is completely authentic and registered properly.' };
      case 'EXPIRED': return { title: 'Authentic but Expired', desc: 'Verify the dates before taking action.' };
      case 'TAMPERED': return { title: 'Tampered Certificate', desc: 'WARNING: Blockchain signatures do not match! Data altered.' };
      case 'REVOKED': return { title: 'Certificate Revoked', desc: 'This certificate has been explicitly revoked.' };
      default: return { title: 'Unknown Status', desc: 'Unable to verify authenticity.' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Verify Seed Product
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Ensure transparency and authenticity by verifying a product's blockchain certificate or corresponding batch tracking details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              Start Verification
            </h2>

            {!scannerOpen ? (
              <div className="space-y-6">
                <div>
                  <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-lg mb-4">
                    <button 
                      className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inputType === 'CERTIFICATE' ? 'bg-white dark:bg-slate-800 shadow text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-900'}`}
                      onClick={() => setInputType('CERTIFICATE')}
                    >
                      Certificate ID
                    </button>
                    <button 
                      className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inputType === 'BATCH' ? 'bg-white dark:bg-slate-800 shadow text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-900'}`}
                      onClick={() => setInputType('BATCH')}
                    >
                      Batch ID
                    </button>
                  </div>

                  <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualVerify()}
                    placeholder={`Enter ${inputType === 'BATCH' ? 'Batch' : 'Certificate'} ID`} 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                    disabled={loading} 
                  />
                </div>
                
                <button 
                  onClick={handleManualVerify} 
                  disabled={loading || !inputValue.trim()}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? <><Loader2 className="h-5 w-5 animate-spin" /><span>Verifying...</span></> : <><ShieldCheck className="h-5 w-5" /><span>Verify Now</span></>}
                </button>

                <div className="pt-6 border-t border-gray-100 dark:border-slate-700 relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-3 text-xs text-gray-400 font-bold uppercase tracking-wider">Or</div>
                  <button 
                    onClick={() => setScannerOpen(true)}
                    className="w-full py-4 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-xl font-bold border border-gray-200 dark:border-slate-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <QrCode className="h-5 w-5 text-emerald-600" />
                    <span>Scan QR Code</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800 dark:text-white flex items-center"><Camera className="h-4 w-4 mr-2"/> Point at QR Code</span>
                  <button onClick={() => setScannerOpen(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full dark:hover:bg-slate-700"><X className="h-5 w-5"/></button>
                </div>
                <QRScanner onScanSuccess={handleScanSuccess} />
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3 animate-slide-up">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-300 font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="md:col-span-7">
          {!result && !loading && !error && (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-10 text-center bg-gray-50 dark:bg-slate-800/50">
              <Award className="h-16 w-16 text-gray-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">Awaiting Verification</h3>
              <p className="text-sm text-gray-400 mt-2">Enter an ID or scan a code to see verified data here.</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border border-gray-100 dark:border-slate-700 rounded-2xl p-10 bg-white dark:bg-slate-800 shadow-xl">
              <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Querying Ledger...</h3>
            </div>
          )}

          {result && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 animate-slide-up">
              {/* Grand Banner */}
              <div className={`p-8 ${getStatusColor(result.integrityStatus)} flex flex-col md:flex-row items-center gap-6`}>
                <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg">
                  {getStatusIcon(result.integrityStatus)}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                    {getStatusText(result.integrityStatus).title}
                  </h2>
                  <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                    {getStatusText(result.integrityStatus).desc}
                  </p>
                </div>
              </div>

              {/* Data Blocks */}
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div><span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Cert ID</span><div className="text-lg font-bold text-gray-900 dark:text-white">#{result.certId}</div></div>
                  <div><span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Batch ID</span><div className="text-lg font-bold text-emerald-600">#{result.batchId}</div></div>
                  <div className="col-span-2"><span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Issuer Authority</span><div className="font-mono text-sm dark:text-gray-300 break-all bg-gray-50 dark:bg-slate-900 p-2 rounded">{result.issuer}</div></div>
                </div>

                {result.certificateData && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white dark:bg-slate-800 px-3 text-sm font-bold text-gray-500 uppercase tracking-widest">Lab Results</span>
                    </div>
                  </div>
                )}

                {result.certificateData && (
                  <div className="grid grid-cols-2 gap-4">
                    {result.certificateData.labName && (
                      <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl">
                        <span className="block text-xs text-gray-500 font-semibold mb-1">Evaluating Lab</span>
                        <div className="font-bold text-gray-900 dark:text-white">{result.certificateData.labName}</div>
                      </div>
                    )}
                    {result.certificateData.testStandard && (
                      <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl">
                        <span className="block text-xs text-gray-500 font-semibold mb-1">Test Standard</span>
                        <div className="font-bold text-gray-900 dark:text-white">{result.certificateData.testStandard}</div>
                      </div>
                    )}
                    {result.certificateData.germinationRate !== undefined && (
                      <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl">
                        <span className="block text-xs text-gray-500 font-semibold mb-1">Germination</span>
                        <div className="text-2xl font-black text-emerald-600">{result.certificateData.germinationRate}%</div>
                      </div>
                    )}
                    {result.certificateData.purityPercent !== undefined && (
                      <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl">
                        <span className="block text-xs text-gray-500 font-semibold mb-1">Purity</span>
                        <div className="text-2xl font-black text-emerald-600">{result.certificateData.purityPercent}%</div>
                      </div>
                    )}
                    {result.certificateData.passStatus && (
                      <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl col-span-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Final Quality Assessment</span>
                        <div className={`text-xl font-black px-4 py-1 rounded-full ${result.certificateData.passStatus === 'PASS' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {result.certificateData.passStatus}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-between items-end">
                   <div>
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Immutable Record (IPFS)</p>
                     <code className="text-xs break-all bg-gray-50 text-gray-600 dark:bg-slate-900 dark:text-gray-400 p-2 rounded-lg block max-w-sm">
                       {result.ipfsHash}
                     </code>
                   </div>
                   <QrCodeDisplay data={JSON.stringify({ type: 'CERT_VERIFIED', certId: result.certId, status: result.integrityStatus, batchId: result.batchId })} size={96} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateVerifier;
