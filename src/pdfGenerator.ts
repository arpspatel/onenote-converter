import { jsPDF } from "jspdf";
import { OneNotebook, OnePage } from "./types";

interface PdfExportOptions {
  themeColor: "indigo" | "emerald" | "rose" | "neutral" | "amber";
  jpegQuality: number;
  pdfCompliance: string;
  fontFolder: string;
}

const THEME_COLORS = {
  indigo: { primary: [79, 70, 229], secondary: [224, 231, 255], text: [17, 24, 39] },
  emerald: { primary: [5, 150, 105], secondary: [209, 250, 229], text: [17, 24, 39] },
  rose: { primary: [225, 29, 72], secondary: [255, 228, 230], text: [17, 24, 39] },
  neutral: { primary: [31, 41, 55], secondary: [243, 244, 246], text: [17, 24, 39] },
  amber: { primary: [217, 119, 6], secondary: [254, 243, 199], text: [17, 24, 39] },
};

/**
 * Compiles parsed OneNote elements and assembles a professional vector PDF layout using jsPDF.
 */
export function generatePdfFromNotebook(notebook: OneNotebook, options: PdfExportOptions): Blob {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });

  const themeColors = THEME_COLORS[options.themeColor] || THEME_COLORS.indigo;
  const marginX = 45;
  let marginY = 50;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxContentHeight = pageHeight - 60; // Leave 60pt for footer

  let isFirstPage = true;

  notebook.pages.forEach((page, pageIdx) => {
    if (!isFirstPage) {
      doc.addPage();
    }
    isFirstPage = false;
    marginY = 55;

    // --- Page Header Accent ---
    // Underline primary color accent
    doc.setFillColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
    doc.rect(marginX, marginY, pageWidth - (marginX * 2), 4, "F");
    marginY += 20;

    // --- Document Title & Status Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55); // Deep gray text
    doc.text(page.title, marginX, marginY);
    marginY += 15;

    // --- Date/Time Tag ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128); // Muted slate date
    doc.text(`Notebook Page • ${page.date || "Unknown Creation Date"}`, marginX, marginY);
    marginY += 25;

    // Track vertical space
    page.sections.forEach((section) => {
      // Check page height limit, wrap gracefully
      if (marginY > maxContentHeight - 40) {
        doc.addPage();
        marginY = 55;
        doc.setFillColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
        doc.rect(marginX, marginY, pageWidth - (marginX * 2), 4, "F");
        marginY += 25;
      }

      // Render Optional Section Title
      if (section.title) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
        doc.text(section.title, marginX, marginY);
        marginY += 16;
      }

      // Render items by type
      if (section.type === "checklist" && Array.isArray(section.content)) {
        section.content.forEach((item: any) => {
          if (marginY > maxContentHeight - 30) {
            doc.addPage();
            marginY = 55;
            doc.setFillColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
            doc.rect(marginX, marginY, pageWidth - (marginX * 2), 4, "F");
            marginY += 25;
          }

          const textStr = String(item.text || item);
          const checked = !!item.checked;

          // Draw custom styled checkmark box
          doc.setDrawColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
          doc.rect(marginX, marginY - 8, 10, 10, "S");

          if (checked) {
            doc.setFillColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
            doc.rect(marginX + 2, marginY - 6, 6, 6, "F");
          }

          // Print task item text
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10.5);
          doc.setTextColor(55, 65, 81);
          
          if (checked) {
            // Draw standard strike-through for checked items
            const textWidth = doc.getTextWidth(textStr);
            doc.line(marginX + 18, marginY - 3, marginX + 18 + textWidth, marginY - 3);
          }
          
          doc.text(textStr, marginX + 18, marginY);
          marginY += 18;
        });
        marginY += 8;
      } else if (section.type === "bullet_list" && Array.isArray(section.content)) {
        section.content.forEach((item: any) => {
          if (marginY > maxContentHeight - 30) {
            doc.addPage();
            marginY = 55;
            doc.setFillColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
            doc.rect(marginX, marginY, pageWidth - (marginX * 2), 4, "F");
            marginY += 25;
          }

          const txt = String(item);
          // Draw list bullet dot
          doc.setFillColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
          doc.circle(marginX + 5, marginY - 3, 2.5, "F");

          // Text run split if line wraps
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10.5);
          doc.setTextColor(55, 65, 81);
          const lines = doc.splitTextToSize(txt, pageWidth - (marginX * 2) - 18);
          doc.text(lines, marginX + 18, marginY);
          marginY += (16 * lines.length);
        });
        marginY += 8;
      } else {
        // Standard Paragraph or generic sequences
        const txts = Array.isArray(section.content) ? section.content : [section.content];
        txts.forEach((item: any) => {
          const textLine = String(item);
          
          if (marginY > maxContentHeight - 30) {
            doc.addPage();
            marginY = 55;
            doc.setFillColor(themeColors.primary[0], themeColors.primary[1], themeColors.primary[2]);
            doc.rect(marginX, marginY, pageWidth - (marginX * 2), 4, "F");
            marginY += 25;
          }

          doc.setFont("helvetica", "normal");
          doc.setFontSize(10.5);
          doc.setTextColor(55, 65, 81);
          
          const lines = doc.splitTextToSize(textLine, pageWidth - (marginX * 2));
          doc.text(lines, marginX, marginY);
          marginY += (16 * lines.length);
        });
        marginY += 10;
      }
    });

    // --- Elegant Page Footer ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    // Left-aligned brand and page numbers
    doc.text(`Auto-Converted via Note2PDF Engine Node.js. Styled under "${options.themeColor.toUpperCase()}" template.`, marginX, pageHeight - 30);
    doc.text(`Page ${pageIdx + 1} of ${notebook.pages.length}`, pageWidth - marginX - 45, pageHeight - 30);
  });

  return doc.output("blob");
}
