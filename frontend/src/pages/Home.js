import React from 'react';
import { Sprout, Package, Clock, ShieldCheck, ArrowRight, Sparkles, Award, GitBranch, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const steps = [
    { number: '1', title: 'Create Seed Batch', description: 'Producer registers a new seed batch with crop type, variety, quantity, and expiry date. Data is uploaded to IPFS and recorded on the blockchain.' },
    { number: '2', title: 'AI Fraud Analysis', description: 'Our AI engine analyzes the batch for anomalies — detecting suspicious quantities, near-expiry fraud, and abnormal patterns in real-time.' },
    { number: '3', title: 'Certificate Issuance', description: 'Lab authority issues a digitally signed quality certificate. The certificate hash, signature, and metadata are stored immutably on-chain.' },
    { number: '4', title: 'Transfer & Split', description: 'Batches flow through the supply chain via ownership transfers and quantity splits — each operation traceable with full parent-child lineage.' },
    { number: '5', title: 'Public Verification', description: 'Anyone can verify a certificate\'s authenticity via its on-chain ID. The system detects VALID, EXPIRED, or TAMPERED certificates cryptographically.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sprout className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              SeedChain:<br />Blockchain Seed Tracking
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-6 font-light">
              End-to-end agricultural seed supply chain with AI fraud detection & digital certificate verification.
            </p>
            <p className="text-lg text-emerald-50 max-w-3xl mx-auto mb-8">
              Immutable batch tracking, cryptographic quality certificates, and intelligent anomaly detection — ensuring seed authenticity from producer to farmer.
            </p>
            <Link to="/create-batch" className="inline-flex items-center space-x-2 bg-white text-emerald-600 font-semibold py-4 px-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
              <span>Create Seed Batch</span><ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Core Capabilities</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">A comprehensive blockchain-powered seed supply chain platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Package, title: 'Batch Tracking', desc: 'Create and track seed batches with full blockchain immutability and IPFS storage.', color: 'from-emerald-500 to-emerald-600' },
            { icon: Award, title: 'Digital Certificates', desc: 'Cryptographically signed quality certificates with VALID/EXPIRED/TAMPERED detection.', color: 'from-blue-500 to-blue-600' },
            { icon: ShieldCheck, title: 'AI Fraud Detection', desc: 'Real-time anomaly detection analyzing quantity, expiry, splits, and transfer patterns.', color: 'from-purple-500 to-purple-600' },
            { icon: GitBranch, title: 'Supply Chain Lineage', desc: 'Full parent-child batch traceability through splits, transfers, and ownership changes.', color: 'from-teal-500 to-teal-600' },
          ].map((f, i) => (
            <div key={i} className="card group hover:scale-105 transition-all duration-300 text-center dark:bg-slate-800 dark:border-slate-700">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${f.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="card bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 border-emerald-200 dark:border-slate-700">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">System Workflow</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow dark:border dark:border-slate-700">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{step.number}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 dark:bg-slate-950 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">SeedChain — Built with React, TailwindCSS, Solidity, Node.js, ethers.js, and Python AI</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
