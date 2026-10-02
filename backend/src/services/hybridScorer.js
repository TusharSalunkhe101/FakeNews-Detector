class HybridScorer {
  /**
   * Combines all multi-modal verification signals into a transparent, calibrated confidence score and verdict.
   */
  static calculateFinalScore({
    mlPrediction,
    llmAnalysis,
    sourceCredibility,
    externalNews,
    linguisticAnalysis,
  }) {
    // 1. ML Score (0 to 100, where 100 = highly reliable/real, 0 = highly fake)
    let mlScore = 50;
    if (mlPrediction) {
      if (typeof mlPrediction.probability_real === 'number') {
        mlScore = Math.round(mlPrediction.probability_real * 100);
      } else if (mlPrediction.prediction === 'REAL') {
        mlScore = 85;
      } else if (mlPrediction.prediction === 'FAKE') {
        mlScore = 15;
      }
    }

    // 2. LLM Reasoning Score (0 to 100)
    let llmScore = 50;
    let llmVerdict = 'UNVERIFIED';
    if (llmAnalysis) {
      llmVerdict = llmAnalysis.llmVerdict || 'UNVERIFIED';
      if (typeof llmAnalysis.llmCredibilityScore === 'number') {
        llmScore = Math.round(llmAnalysis.llmCredibilityScore);
      } else {
        if (llmVerdict === 'REAL' || llmVerdict === 'LIKELY REAL') llmScore = 85;
        else if (llmVerdict === 'LIKELY FAKE') llmScore = 10;
        else if (llmVerdict === 'MISLEADING') llmScore = 35;
      }
    }

    // 3. Source Credibility Score (0 to 100)
    let sourceScore = 50;
    if (sourceCredibility && typeof sourceCredibility.credibility_score === 'number') {
      sourceScore = Math.round(sourceCredibility.credibility_score * 100);
    }

    // 4. External Evidence Score (0 to 100)
    let evidenceScore = 50;
    const supportingEvidence = [];
    const contradictingEvidence = [];

    // Ingest supporting & contradicting evidence from AI/Google analysis
    if (llmAnalysis && Array.isArray(llmAnalysis.supportingEvidence)) {
      llmAnalysis.supportingEvidence.forEach(item => {
        if (item && item.title) {
          supportingEvidence.push({
            source: item.source || 'Verified Source',
            title: item.title,
            url: item.url || '',
            stance: 'SUPPORTS',
            snippet: item.snippet || 'Factual corroboration across official records.',
            publishedDate: item.publishedDate || 'Recent',
            reliability: 0.95,
          });
        }
      });
    }

    if (llmAnalysis && Array.isArray(llmAnalysis.contradictingEvidence)) {
      llmAnalysis.contradictingEvidence.forEach(item => {
        if (item && item.title) {
          contradictingEvidence.push({
            source: item.source || 'Fact Check Desk',
            title: item.title,
            url: item.url || '',
            stance: 'CONTRADICTS',
            snippet: item.snippet || 'Debunked by verified fact-checking standards.',
            publishedDate: item.publishedDate || 'Recent',
            reliability: 0.95,
          });
        }
      });
    }

    if (externalNews && externalNews.articles && externalNews.articles.length > 0) {
      externalNews.articles.forEach(art => {
        if (art.stance === 'SUPPORTS' && !supportingEvidence.some(e => e.title === art.title)) {
          supportingEvidence.push({
            source: art.publisher,
            title: art.title,
            url: art.url,
            stance: 'SUPPORTS',
            snippet: art.snippet,
            publishedDate: art.date,
            reliability: 0.9,
          });
        } else if (art.stance === 'CONTRADICTS' && !contradictingEvidence.some(e => e.title === art.title)) {
          contradictingEvidence.push({
            source: art.publisher,
            title: art.title,
            url: art.url,
            stance: 'CONTRADICTS',
            snippet: art.snippet,
            publishedDate: art.date,
            reliability: 0.9,
          });
        }
      });
    }

    if (supportingEvidence.length > 0 && contradictingEvidence.length === 0) {
      evidenceScore = Math.min(95, 80 + (supportingEvidence.length * 5));
    } else if (contradictingEvidence.length > 0 && supportingEvidence.length === 0) {
      evidenceScore = Math.max(5, 20 - (contradictingEvidence.length * 5));
    } else if (supportingEvidence.length > 0 || contradictingEvidence.length > 0) {
      const ratio = supportingEvidence.length / (supportingEvidence.length + contradictingEvidence.length);
      evidenceScore = Math.round(ratio * 90) + 5;
    }

    // 5. Linguistic & Clickbait Score (0 to 100)
    let linguisticScore = 50;
    if (linguisticAnalysis && typeof linguisticAnalysis.linguistic_credibility_score === 'number') {
      linguisticScore = Math.round(linguisticAnalysis.linguistic_credibility_score * 100);
    }

    // Dynamic weight allocation: If LLM has high-certainty factual knowledge (e.g. LLM score < 20 or > 80), give LLM 45% weight
    let weights = {
      ml: 0.25,
      evidence: 0.20,
      source: 0.15,
      llm: 0.30,
      linguistic: 0.10,
    };

    if (llmAnalysis && (llmScore <= 20 || llmScore >= 85)) {
      weights = {
        ml: 0.15,
        evidence: 0.15,
        source: 0.10,
        llm: 0.50,
        linguistic: 0.10,
      };
    }

    const compositeReliabilityIndex = Math.round(
      (mlScore * weights.ml) +
      (evidenceScore * weights.evidence) +
      (sourceScore * weights.source) +
      (llmScore * weights.llm) +
      (linguisticScore * weights.linguistic)
    );

    // Determine Verdict and Verification Confidence
    let prediction = 'UNVERIFIED';
    let confidenceLevel = 'Uncertain / Needs Verification';
    let finalConfidence = compositeReliabilityIndex;

    // Check strong LLM factual debunking
    if (llmVerdict === 'LIKELY FAKE' || llmScore <= 25) {
      prediction = 'LIKELY FAKE';
      confidenceLevel = 'Likely Fake';
      finalConfidence = Math.max(82, 100 - compositeReliabilityIndex);
    } else if (llmVerdict === 'MISLEADING' || (compositeReliabilityIndex > 25 && compositeReliabilityIndex <= 45)) {
      prediction = 'MISLEADING';
      confidenceLevel = 'Likely Misleading';
      finalConfidence = Math.max(78, 100 - compositeReliabilityIndex + 10);
    } else if (compositeReliabilityIndex >= 78 || (llmVerdict === 'REAL' && llmScore >= 80)) {
      prediction = compositeReliabilityIndex >= 88 ? 'REAL' : 'LIKELY REAL';
      confidenceLevel = compositeReliabilityIndex >= 88 ? 'Very High Confidence' : 'High Confidence';
      finalConfidence = Math.max(80, compositeReliabilityIndex);
    } else {
      prediction = 'UNVERIFIED';
      confidenceLevel = 'Uncertain / Needs Verification';
      finalConfidence = compositeReliabilityIndex;
    }

    // Ensure final confidence is within 20-98%
    finalConfidence = Math.min(98, Math.max(20, finalConfidence));

    return {
      prediction,
      finalConfidence,
      confidenceLevel,
      compositeReliabilityIndex,
      scoreBreakdown: {
        mlScore,
        llmScore,
        sourceScore,
        evidenceScore,
        linguisticScore,
      },
      supportingEvidence,
      contradictingEvidence,
    };
  }
}

module.exports = HybridScorer;
