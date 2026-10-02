import jsPDF from 'jspdf';

export const downloadPDFReport = (analysis) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header Banner
  doc.setFillColor(30, 27, 75); // Dark Indigo
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('FAKE NEWS DETECTOR - VERIFICATION AUDIT', 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(199, 210, 254);
  doc.text('Explainable AI & Multi-Source Evidence Report', 14, 26);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 26, { align: 'right' });

  yPos = 45;

  // Article Info Box
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('ARTICLE DETAILS', 14, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Title: ${analysis.headline || 'Untitled News Item'}`, 14, yPos);
  yPos += 6;
  doc.text(`Source/Publisher: ${analysis.publisher || 'Unspecified'} | Input: ${analysis.inputType || 'TEXT'}`, 14, yPos);
  yPos += 6;
  if (analysis.url) {
    doc.text(`URL: ${analysis.url}`, 14, yPos);
    yPos += 6;
  }

  yPos += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, yPos, pageWidth - 14, yPos);
  yPos += 10;

  // Classification & Confidence Verdict Box
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFICATION VERDICT', 14, yPos);
  yPos += 8;

  // Color-coded badge
  let statusColor = [107, 114, 128];
  if (analysis.prediction === 'REAL' || analysis.prediction === 'LIKELY REAL') statusColor = [16, 185, 129];
  else if (analysis.prediction === 'LIKELY FAKE' || analysis.prediction === 'FAKE') statusColor = [239, 68, 68];
  else if (analysis.prediction === 'MISLEADING') statusColor = [245, 158, 11];

  doc.setFillColor(...statusColor);
  doc.roundedRect(14, yPos - 5, 60, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`${analysis.prediction}`, 44, yPos + 2, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.text(`Confidence Score: ${analysis.finalConfidence}% (${analysis.confidenceLevel || 'Evaluated'})`, 80, yPos + 2);
  yPos += 16;

  // AI Reasoning Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('AI REASONING & EXPLANATION', 14, yPos);
  yPos += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const summaryLines = doc.splitTextToSize(analysis.aiExplanation?.summary || 'Comprehensive cross-source linguistic analysis conducted.', pageWidth - 28);
  doc.text(summaryLines, 14, yPos);
  yPos += (summaryLines.length * 5) + 6;

  // Key Claims Extracted
  if (analysis.claims && analysis.claims.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EXTRACTED FACTUAL CLAIMS', 14, yPos);
    yPos += 6;

    analysis.claims.slice(0, 3).forEach((c, idx) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`Claim ${idx + 1} [Status: ${c.status || 'Verified'}]:`, 14, yPos);
      yPos += 4;
      doc.setFont('helvetica', 'normal');
      const claimText = doc.splitTextToSize(`"${c.claim}"`, pageWidth - 28);
      doc.text(claimText, 14, yPos);
      yPos += (claimText.length * 4) + 4;
    });
  }

  // Evidence Summary
  yPos += 2;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CROSS-SOURCE EVIDENCE SUMMARY', 14, yPos);
  yPos += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const supCount = analysis.supportingEvidence?.length || 0;
  const conCount = analysis.contradictingEvidence?.length || 0;
  doc.text(`Supporting Sources Identified: ${supCount} | Contradicting Reports Identified: ${conCount}`, 14, yPos);
  yPos += 8;

  // Disclaimer at Footer
  yPos = 270;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, yPos, pageWidth - 14, yPos);
  yPos += 6;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const disclaimer = 'IMPORTANT DISCLAIMER: AI-generated verification is an aid, not an absolute guarantee of truth. News can change as new evidence becomes available. Always review cited sources and use independent judgment before sharing.';
  const discLines = doc.splitTextToSize(disclaimer, pageWidth - 28);
  doc.text(discLines, 14, yPos);

  // Save PDF
  const filename = `truthguard-verification-${(analysis.headline || 'report').substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
};

export const downloadCSVReport = (items) => {
  const rows = [
    ['ID', 'Date', 'Headline', 'Input Type', 'Verdict', 'Confidence', 'Publisher', 'URL'],
    ...items.map(item => [
      item._id || item.id || '',
      item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '',
      `"${(item.headline || '').replace(/"/g, '""')}"`,
      item.inputType || 'TEXT',
      item.prediction || '',
      `${item.finalConfidence || 0}%`,
      `"${(item.publisher || '').replace(/"/g, '""')}"`,
      `"${(item.url || '').replace(/"/g, '""')}"`,
    ]),
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `truthguard-audit-history-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
