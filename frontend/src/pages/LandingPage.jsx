import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Search,
  FileText,
  Image,
  Globe,
  Sliders,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  HelpCircle,
} from 'lucide-react';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Hybrid Detection',
      description: 'Combines trained ML classification with LLM reasoning, NLP sentiment parsing, and credibility databases.',
    },
    {
      icon: Globe,
      title: 'Automated URL Verification',
      description: 'Parses live news websites, assesses publisher reputations, and cross-checks claim validity against web archives.',
    },
    {
      icon: FileText,
      title: 'In-Depth Text Analysis',
      description: 'Cleans, tokenizes, and audits text for clickbait phrasing, emotional manipulation, and statistical anomalies.',
    },
    {
      icon: Image,
      title: 'Image & Screenshot OCR',
      description: 'Upload viral screenshots or camera photos to extract optical text for instant multi-modal fact checking.',
    },
    {
      icon: ShieldCheck,
      title: 'Source & Domain Credibility',
      description: 'Classifies domain authority into High, Moderate, Limited, or Satirical tiers based on journalistic registries.',
    },
    {
      icon: Sliders,
      title: 'Explainable AI & Claims',
      description: 'Extracts discrete factual claims with transparent supporting vs contradicting evidence panels.',
    },
    {
      icon: BarChart3,
      title: 'Confidence Calibration',
      description: 'Scores results from 0 to 100% with transparent weighting, avoiding false 100% certainty claims.',
    },
    {
      icon: FileSpreadsheet,
      title: 'PDF & CSV Audit Reports',
      description: 'Export professional audit summaries with claims, sources, and evidence citations ready for academic reviews.',
    },
  ];

  const steps = [
    { step: '01', title: 'Submit News', desc: 'Paste raw text, enter a URL, or upload an image screenshot / PDF document.' },
    { step: '02', title: 'AI Analyzes Content', desc: 'NLP cleans text, computes emotional sentiment polarity, and detects clickbait syntax.' },
    { step: '03', title: 'Claims Are Extracted', desc: 'Identifies discrete factual, statistical, and institutional assertions.' },
    { step: '04', title: 'Sources Are Verified', desc: 'Evaluates publisher legitimacy, domain SSL, and historical journalistic reliability.' },
    { step: '05', title: 'Evidence Is Compared', desc: 'NewsAPI and knowledge bases search for corroborating or debunking reporting.' },
    { step: '06', title: 'Final Result Generated', desc: 'Calculates an explainable confidence score with detailed reasoning breakdown.' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 text-center px-4 max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 text-xs md:text-sm font-semibold shadow-sm animate-fadeIn">
          <Sparkles className="w-4 h-4" />
          Production-Ready AIML Investigation Engine
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          Detect. Verify. Understand.{' '}
          <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent mt-2">
            Before You Share.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          An explainable AI platform combining machine learning, natural language processing, source reputation indexing, and real-time cross-source evidence matching.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <Link
            to={isAuthenticated ? "/check" : "/login"}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm md:text-base shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Check News Now
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold text-sm md:text-base border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-slate-600 dark:text-slate-400 font-semibold text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Learn How It Works
          </Link>
        </div>

        {/* Verification Disclaimer */}
        <div className="pt-6 max-w-3xl mx-auto text-left">
          <DisclaimerBanner />
        </div>
      </section>

      {/* Verification Methodology Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Comprehensive Verification Features
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            Engineered for academic transparency and real-world disinformation defense.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-100/50 dark:bg-[#080f24] py-16 rounded-3xl border border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Pipeline Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How The Verification Pipeline Works
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            Step-by-step explainable AI lifecycle from ingestion to audited report.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-slate-800/80 shadow-sm"
            >
              <span className="text-3xl font-black text-indigo-600/20 dark:text-indigo-400/20 block mb-2">
                {item.step}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-500/30 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to verify breaking news?
            </h2>
            <p className="text-sm text-indigo-200">
              Access the interactive dashboard, upload news screenshots, or test live demo cases without any setup required.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={isAuthenticated ? "/check" : "/login"}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-indigo-950 font-bold text-sm shadow-md hover:bg-indigo-50 transition-colors"
              >
                Launch Verification Suite
              </Link>
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-800/60 border border-indigo-400/30 text-white font-semibold text-sm hover:bg-indigo-700/60 transition-colors"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
