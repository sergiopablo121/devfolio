import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { PortfolioData, ResumeExperience, ResumeEducation } from '@/types';

export async function generatePDF(
  element: HTMLElement,
  filename: string,
  options: { watermark?: boolean; text?: string } = {}
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  let imgY = 0;

  let heightLeft = imgHeight * ratio;
  let position = 0;

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight * ratio;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pdfHeight;
  }

  if (options.watermark) {
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(48);
      pdf.setTextColor(200, 200, 200);
      pdf.setFont('helvetica', 'bold');
      pdf.saveGraphicsState();
      pdf.setGState(new (pdf as any).GState({ opacity: 0.15 }));
      pdf.text(options.text || 'DEVFOLIO', pdfWidth / 2, pdfHeight / 2, {
        align: 'center',
        angle: 45,
      });
      pdf.restoreGraphicsState();
    }
  }

  pdf.save(`${filename}.pdf`);
}

export function buildResumeData(data: PortfolioData, experiences?: ResumeExperience[], education?: ResumeEducation[]) {
  const skills = Object.entries(data.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([lang]) => lang);

  return {
    user: data.user,
    repos: data.repos.slice(0, 6),
    languages: data.languages,
    skills,
    experiences: experiences || [],
    education: education || [],
  };
}
