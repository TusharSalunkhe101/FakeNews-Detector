import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Download,
  Bookmark,
  Share2,
  Calendar,
  User,
  Globe,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import ConfidenceGauge from '../components/common/ConfidenceGauge';
import ClaimsList from '../components/result/ClaimsList';
import EvidencePanel from '../components/result/EvidencePanel';
import IndicatorsCard from '../components/result/IndicatorsCard';
import SourceCredibilityCard from '../components/result/SourceCredibilityCard';
import SimilarArticlesCard from '../components/result/SimilarArticlesCard';
import HybridScoringBreakdown from '../components/result/HybridScoringBreakdown';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import DemoBadge from '../components/common/DemoBadge';
import { getAnalysisDetails, saveArticle } from '../services/newsService';
import { downloadPDFReport, downloadCSVReport } from '../services/reportGenerator';

export const AnalysisResultPage = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await getAnalysisDetails(id);
        if (res.success && res.data) {
          setAnalysis(res.data);
        }
      } catch (err) {
        console.warn('Error fetching analysis', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  const handleSave = async () => {
    if (!analysis) return;
    try {
      await saveArticle({
        analysisId: analysis._id || analysis.id,
        title: analysis.headline || 'Saved News Analysis',
        notes: `Verification score: ${analysis.finalConfidence}% (${analysis.prediction})`,
        tags: [analysis.prediction, analysis.inputType || 'TEXT'],
      });
      setSaveStatus('Bookmarked!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('Already saved or offline.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading verification audit...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 text-center bg-white dark:bg-[#0b1329] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Record Not Found</h2>
        <p className="text-xs text-slate-500">The requested analysis may have expired or was removed.</p>
        <Link
          to="/check"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
        >
          Check Another Story
        </Link>
      </div>
    );
  }

  const isPositive = analysis.prediction === 'REAL' || analysis.prediction === 'LIKELY REAL';
  const isNegative = analysis.prediction === 'LIKELY FAKE' || analysis.prediction === 'FAKE';
  const isMisleading = analysis.prediction === 'MISLEADING';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {analysis.isDemoData && <DemoBadge />}

          <button
            onClick={() => downloadPDFReport(analysis)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            Download PDF Report
          </button>

          <button
            onClick={() => downloadCSVReport([analysis])}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            CSV
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            {saveStatus || 'Bookmark'}
          </button>

          <Link
            to="/check"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Check
          </Link>
        </div>
      </div>

      {/* Main Top Verdict Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${
          isPositive
            ? 'bg-gradient-to-br from-emerald-950/30 via-slate-900 to-[#0b1329] border-emerald-500/30 glow-success'
            : isNegative
            ? 'bg-gradient-to-br from-rose-950/30 via-slate-900 to-[#0b1329] border-rose-500/30 glow-danger'
            : isMisleading
            ? 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-[#0b1329] border-amber-500/30'
            : 'bg-gradient-to-br from-indigo-950/30 via-slate-900 to-[#0b1329] border-indigo-500/30'
        }`}
      >
        <div className="space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <StatusBadge status={analysis.prediction} size="lg" />
            <span className="text-xs font-semibold text-slate-400">
              Evaluated on {new Date(analysis.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {analysis.headline || 'Submitted News Analysis'}
          </h1>

          {/* Quick Metadata tags */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-400">
            {analysis.publisher && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                {analysis.publisher}
              </span>
            )}
            {analysis.author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                {analysis.author}
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
              Input: {analysis.inputType || 'TEXT'}
            </span>
          </div>
        </div>

        {/* Confidence Gauge Component */}
        <div className="flex-shrink-0 bg-white/5 dark:bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
          <ConfidenceGauge
            score={analysis.finalConfidence || 85}
            level={analysis.confidenceLevel || 'Evaluated Confidence'}
            size="lg"
          />
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: AI Explanation & Claims Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Explanation Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Explainable AI Reasoning & Audit
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
              {analysis.aiExplanation?.summary ||
                'Comprehensive NLP and cross-source analysis performed on content assertions.'}
            </p>

            {analysis.aiExplanation?.keyFactors && analysis.aiExplanation.keyFactors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Key Decisive Factors
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {analysis.aiExplanation.keyFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.aiExplanation?.recommendations && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                <span className="font-bold block">Verification Recommendations:</span>
                {analysis.aiExplanation.recommendations.map((rec, idx) => (
                  <p key={idx}>• {rec}</p>
                ))}
              </div>
            )}
          </div>

          {/* Claim-by-Claim Extracted Assertions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Extracted Claims & Factual Validation
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {analysis.claims?.length || 0} claims audited
              </span>
            </div>

            <ClaimsList claims={analysis.claims} />
          </div>

          {/* Original Article Content Accordion/Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Submitted Article Excerpt
            </h4>
            <div className="max-h-48 overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
              {analysis.content}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Evidence, Credibility & Indicators (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Multi-Signal Hybrid Scoring Breakdown */}
          <HybridScoringBreakdown breakdown={analysis.scoreBreakdown} />

          {/* Source & Publisher Credibility */}
          <SourceCredibilityCard source={analysis.sourceCredibility} />

          {/* Supporting & Contradicting Evidence Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cross-Source Evidence & Citations
            </h3>
            <EvidencePanel
              supporting={analysis.supportingEvidence}
              contradicting={analysis.contradictingEvidence}
            />
          </div>

          {/* Detected Suspicious Indicators */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <IndicatorsCard indicators={analysis.suspiciousIndicators} />
          </div>

          {/* Similar News Coverage */}
          {analysis.similarArticles && analysis.similarArticles.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <SimilarArticlesCard articles={analysis.similarArticles} />
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};

export default AnalysisResultPage;
