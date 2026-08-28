import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StudentRecord } from '../types';
import { SCALES, SCALE_ORDER, SUPPORT_TIPS } from '../data/constellationData';
import { getTopAndFocusTraits } from './storage';

/**
 * Generates a polished PDF summary report for a student's Learning Constellation.
 */
export async function generateStudentPDF(
  student: StudentRecord,
  radarElementId?: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Background deep WILS royal purple header bar
  doc.setFillColor(14, 8, 33); // #0e0821 WILS Royal Purple
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Decorative gold accent line
  doc.setFillColor(245, 183, 22); // #f5b716 WILS Gold
  doc.rect(0, 44, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(245, 183, 22); // Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('WESTVIEW INTERNATIONAL LANGUAGE SCHOOL', margin, 14);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.text('LEARNING CONSTELLATION DOSSIER', margin, 23);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(216, 180, 254); // Purple-200
  doc.text('COGNITIVE PSYCHOMETRIC & LEARNER PROFILE', margin, 31);

  // Student Info in Header right aligned
  doc.setTextColor(240, 230, 255);
  doc.setFontSize(9);
  doc.text(`Student: ${student.name}`, pageWidth - margin, 14, { align: 'right' });
  doc.text(`Grade ${student.grade} • Class ${student.className}`, pageWidth - margin, 20, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 183, 22);
  doc.text(`Code: ${student.id}`, pageWidth - margin, 27, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 190, 220);
  doc.text(`Date: ${new Date(student.timestamp).toLocaleDateString()}`, pageWidth - margin, 34, { align: 'right' });

  let currentY = 52;

  // Archetype Showcase Box
  doc.setFillColor(246, 248, 252);
  doc.setDrawColor(215, 225, 240);
  doc.roundedRect(margin, currentY, contentWidth, 38, 3, 3, 'FD');

  // Archetype Badge
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 184, 75);
  doc.roundedRect(margin + 5, currentY + 5, 52, 6.5, 2, 2, 'FD');
  doc.setTextColor(161, 98, 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PRIMARY ARCHETYPE', margin + 7, currentY + 9.5);

  // Archetype Name & Subtitle
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.text(`${student.archetype.symbol} ${student.archetype.name}`, margin + 5, currentY + 18);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 148, 136); // teal-600
  doc.text(student.archetype.subtitle, margin + 5, currentY + 23);

  // Archetype Description (wrapped)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(student.archetype.description, contentWidth - 10);
  doc.text(descLines, margin + 5, currentY + 28);

  currentY += 44;

  // Capture radar image if element exists
  let radarImageAdded = false;
  if (radarElementId) {
    const radarElem = document.getElementById(radarElementId);
    if (radarElem) {
      try {
        const canvas = await html2canvas(radarElem, {
          backgroundColor: '#1c0e38',
          scale: 2,
          logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        // Place radar on the right side
        const radarW = 60;
        const radarH = 60;
        const radarX = pageWidth - margin - radarW;
        doc.addImage(imgData, 'PNG', radarX, currentY, radarW, radarH);
        radarImageAdded = true;
      } catch (err) {
        console.warn('Radar canvas capture skipped', err);
      }
    }
  }

  // Dimension Scores Section
  const scoreTableWidth = radarImageAdded ? contentWidth - 66 : contentWidth;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Dimension Score Breakdown (1.0 - 5.0)', margin, currentY + 2);

  let scoreY = currentY + 8;

  SCALE_ORDER.forEach((scaleKey) => {
    const scale = SCALES[scaleKey];
    const score = student.scores[scaleKey];
    const mean = score?.mean ?? 3.0;
    const pct = Math.min(100, Math.max(0, (mean / 5.0) * 100));

    // Scale label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(scale.label, margin, scoreY);

    // Score text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`${mean.toFixed(2)} / 5.0`, margin + scoreTableWidth - 16, scoreY, { align: 'right' });

    // Category tag
    const catLabel = score?.cat === 'H' ? 'High' : score?.cat === 'M' ? 'Moderate' : 'Growth';
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    if (score?.cat === 'H') doc.setTextColor(180, 83, 9);
    else if (score?.cat === 'M') doc.setTextColor(13, 148, 136);
    else doc.setTextColor(190, 24, 93);
    doc.text(`[${catLabel}]`, margin + scoreTableWidth - 2, scoreY, { align: 'right' });

    // Progress bar track
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(margin, scoreY + 1.5, scoreTableWidth, 3, 1, 1, 'F');

    // Progress bar fill
    if (scaleKey === 'social') doc.setFillColor(245, 184, 75);
    else if (scaleKey === 'structure') doc.setFillColor(99, 102, 241);
    else if (scaleKey === 'independence') doc.setFillColor(168, 85, 247);
    else if (scaleKey === 'practice') doc.setFillColor(78, 217, 192);
    else if (scaleKey === 'expression') doc.setFillColor(251, 146, 60);
    else doc.setFillColor(244, 63, 94);

    const fillWidth = (scoreTableWidth * pct) / 100;
    doc.roundedRect(margin, scoreY + 1.5, fillWidth, 3, 1, 1, 'F');

    scoreY += 9;
  });

  currentY = Math.max(scoreY + 2, currentY + 64);

  // Strategy & Accommodations Section
  const { top, focus } = getTopAndFocusTraits(student.scores);
  const topScale = SCALES[top];
  const focusScale = SCALES[focus];
  const supportTip = SUPPORT_TIPS[focus];

  const colW = (contentWidth - 6) / 2;

  // Strength Box
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(margin, currentY, colW, 40, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(161, 98, 7);
  doc.text('✦ TOP STRENGTH / SUPERPOWER', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${topScale.label} (${student.scores[top]?.mean?.toFixed(2)} / 5.0)`, margin + 4, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const strengthLines = doc.splitTextToSize(
    `${topScale.highDescription}\n\nSuperpower: ${student.archetype.superpower}`,
    colW - 8
  );
  doc.text(strengthLines, margin + 4, currentY + 17);

  // Growth Focus Box
  const focusX = margin + colW + 6;
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(204, 251, 241);
  doc.roundedRect(focusX, currentY, colW, 40, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(13, 148, 136);
  doc.text('✦ GROWTH FOCUS & ACCOMMODATION', focusX + 4, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${focusScale.label} (${student.scores[focus]?.mean?.toFixed(2)} / 5.0)`, focusX + 4, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const focusLines = doc.splitTextToSize(
    `Student Strategy: ${supportTip.student}\n\nClassroom: ${supportTip.classroom}`,
    colW - 8
  );
  doc.text(focusLines, focusX + 4, currentY + 17);

  currentY += 45;

  // Optimal Study Routine & Reflection
  if (student.reflection) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, 24, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(99, 102, 241);
    doc.text("STUDENT'S REQUESTED SUPPORT THIS SEMESTER", margin + 4, currentY + 6);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const reflLines = doc.splitTextToSize(`"${student.reflection}"`, contentWidth - 8);
    doc.text(reflLines, margin + 4, currentY + 12);

    currentY += 28;
  }

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Learning Constellation Psychometrics • Student Report: ${student.id} (${student.name})`,
    margin,
    pageHeight - 7
  );
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} • Confidential`,
    pageWidth - margin,
    pageHeight - 7,
    { align: 'right' }
  );

  // Save the PDF
  const sanitizedName = student.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${sanitizedName}_Learning_Constellation_${student.id}.pdf`);
}
