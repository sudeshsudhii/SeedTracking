import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Package, Award, ArrowRightLeft, ShieldCheck, Activity } from 'lucide-react';
import LiveTransactions from '../components/Dashboard/LiveTransactions';
import axios from 'axios';

const SeedDashboard = () => {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchMetrics = async () => {
        try {
            const res = await axios.get('http://localhost:4000/dashboard-metrics');
            setMetrics(res.data);
        } catch (e) { console.error(e); }
    };

    const statCards = [
        { label: 'Total Supply Batches', value: metrics?.totalBatches || 0, icon: Package, color: 'from-emerald-500 to-teal-600', bg: 'border-emerald-500' },
        { label: 'Verified Certificates', value: metrics?.totalCertificates || 0, icon: Award, color: 'from-blue-500 to-indigo-600', bg: 'border-blue-500' },
        { label: 'Ledger Transfers', value: metrics?.totalTransfers || 0, icon: ArrowRightLeft, color: 'from-purple-500 to-violet-600', bg: 'border-purple-500' },
        { label: 'Network Uptime', value: '100%', icon: Activity, color: 'from-green-500 to-emerald-600', bg: 'border-green-500' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">SeedChain Network</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">Global decentralized ledger for automated seed supply chain verification.</p>
                </div>
                <div className="flex gap-4">
                  <Link to="/verify" className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm flex items-center space-x-2">
                      <ShieldCheck className="h-5 w-5 text-blue-500" /><span>Verify Seed</span>
                  </Link>
                  <Link to="/create-batch" className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 dark:shadow-none flex items-center space-x-2">
                      <PlusCircle className="h-5 w-5" /><span>Register Batch</span>
                  </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 border-b-4 ${card.bg} hover:shadow-2xl hover:-translate-y-1 transition duration-300`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{card.label}</p>
                                <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-start">
                {/* System Status */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700">
                    <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-white">
                        <Activity className="h-6 w-6 mr-3 text-emerald-500" /> Network Health
                    </h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Blockchain Node', status: 'Operational', ping: '12ms' },
                            { name: 'IPFS Storage', status: 'Active', ping: '45ms' },
                            { name: 'Verification Engine', status: 'Online', ping: '8ms' },
                            { name: 'Smart Contracts', status: 'Deployed', ping: '-' },
                        ].map(item => (
                            <div key={item.name} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 transition">
                                <span className="text-gray-700 dark:text-gray-300 font-bold text-sm tracking-wide">{item.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-400 font-mono">{item.ping}</span>
                                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full text-xs font-black shadow-sm flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <LiveTransactions />
                </div>
            </div>
        </div>
    );
};

export default SeedDashboard;
