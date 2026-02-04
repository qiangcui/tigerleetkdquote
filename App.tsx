import React, { useState, useMemo } from 'react';
import { Download, ExternalLink, Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { ComparisonTable } from './components/ComparisonTable';
import { BenefitsSection } from './components/BenefitsSection';
import { SignaturePad } from './components/SignaturePad';
import { ClientData, PricingData } from './types';

// TODO: Follow instructions in SCRIPT_SETUP.md to get your URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7hCEGGaXw9Czl-BYNNv6YzsFN70dzLgMxJsS3e5-rU6DgVyr-Czm4tuboJ_zbyvKL/exec";

const App: React.FC = () => {
  const [isSigned, setIsSigned] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);

  // Dynamic Data Loading using URL Parameters
  const { clientData, pricingData } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    // Helper to get string param with default
    const getStr = (key: string, def: string) => params.get(key) || def;
    // Helper to get number param with default
    const getNum = (key: string, def: number) => {
      const val = params.get(key);
      return val ? parseFloat(val) : def;
    };

    const cData: ClientData = {
      clientName: getStr('client', "Tiger Lee’s World Class Tae Kwon Do"),
      developerName: getStr('dev', "Gloria Cloud"),
      date: getStr('date', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })),
      quoteNumber: getStr('ref', "Q-2024-TKD-001"),
      websiteLink: getStr('link', "https://tigerleetkd.vercel.app/")
    };

    const pData: PricingData = {
      newCreation: getNum('setup', 500),
      newHosting: getNum('new_host', 5),
      hostingDiscount: getNum('discount', 5), // Same as newHosting = client pays $0 for hosting
      newMaintenance: getNum('new_maint', 20),
      currentHosting: getNum('old_host', 15),
      currentMaintenance: getNum('old_maint', 20),
      creationDiscountPercent: getNum('creation_discount_pct', 50)
    };

    return { clientData: cData, pricingData: pData };
  }, []);

  // Calculated savings
  const monthlySavings = (pricingData.currentHosting + pricingData.currentMaintenance) -
    ((pricingData.newHosting - pricingData.hostingDiscount) + pricingData.newMaintenance);
  const yearlySavings = monthlySavings * 12;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const element = document.getElementById('quote-container');

    // Sanitize filename
    const safeName = clientData.clientName.replace(/[^a-z0-9]/gi, '_');

    const opt = {
      margin: [10, 10], // top/bottom, left/right in mm
      filename: `Proposal_${safeName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Check if html2pdf is loaded
      // @ts-ignore
      if (typeof window.html2pdf !== 'undefined') {
        // @ts-ignore
        await window.html2pdf().set(opt).from(element).save();
      } else {
        alert("PDF generator library not loaded yet. Please wait a moment or try printing.");
        window.print();
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("There was an error generating the PDF. Opening print dialog instead.");
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSignatureSubmit = async (signatureImage: string, signerEmail: string, signerName: string) => {
    // Check if URL is configured
    if (GOOGLE_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
      alert("⚠️ Email service is not configured yet.\n\nPlease open SCRIPT_SETUP.md in your project files and follow the instructions to create your backend.");
      return;
    }

    setIsSubmitting(true);

    // 1. Update UI first to show signature on the document
    setSignatureData(signatureImage);
    setIsSigned(true);
    setShowSignModal(false);

    // 2. Wait for React to render the signature into the DOM before generating PDF
    // We use setTimeout to push this to the next event loop cycle after render
    setTimeout(async () => {
      try {
        // --- Generate PDF String ---
        const element = document.getElementById('quote-container');
        const safeName = clientData.clientName.replace(/[^a-z0-9]/gi, '_');

        const opt = {
          margin: [10, 10],
          filename: `Proposal_${safeName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        let pdfBase64 = null;

        // @ts-ignore
        if (typeof window.html2pdf !== 'undefined') {
          // outputPdf('datauristring') returns the full data URI (data:application/pdf;base64,...)
          // @ts-ignore
          pdfBase64 = await window.html2pdf().set(opt).from(element).outputPdf('datauristring');
        }

        // --- Prepare Payload ---
        const payload = {
          type: 'quote_acceptance',
          quoteNumber: clientData.quoteNumber,
          clientName: clientData.clientName,
          signerName: signerName,
          signerEmail: signerEmail,
          signatureImage: signatureImage, // Base64 string of just the signature
          pdfData: pdfBase64, // Base64 string of the full signed PDF
          date: new Date().toISOString(),
          websiteLink: clientData.websiteLink,
          pricing: {
            setup: pricingData.newCreation,
            monthly: (pricingData.newHosting - pricingData.hostingDiscount) + pricingData.newMaintenance
          }
        };

        // --- Send to Google Apps Script ---
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(payload)
        });

        alert("Quote accepted successfully! A confirmation email with the signed PDF has been sent to both parties.");

      } catch (error) {
        console.error("Error sending acceptance:", error);
        alert("There was an error sending the data. Please download the PDF manually for your records.");
      } finally {
        setIsSubmitting(false);
      }
    }, 1000); // 1s delay to ensure signature is fully rendered
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8 flex flex-col items-center bg-slate-50/50">

      {/* Action Bar - Hidden when printing */}
      <div className="w-full max-w-5xl mb-6 md:mb-8 flex justify-end items-center no-print">
        <div className="flex gap-4">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm md:text-base disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Save as PDF</span>
                <span className="sm:hidden">Save PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quote Document */}
      <div id="quote-container" className="w-full max-w-5xl bg-white shadow-xl print-shadow-none rounded-xl p-6 sm:p-8 md:p-14 text-slate-800 print:p-0">

        <Header data={clientData} />

        {/* Intro */}
        <div className="mb-8 md:mb-12 text-slate-600 leading-relaxed text-base md:text-lg">
          <p className="mb-4 md:mb-6">
            Dear Team at <strong>{clientData.clientName}</strong>,
          </p>
          <p>
            Thank you for the opportunity to review your current digital presence.
            Based on our discussion, I have outlined a proposal to modernize your website.
            This upgrade will enhance your brand image with a professional design, introduce a <strong>new custom booking platform</strong>, and significantly reduce your monthly operational costs.
          </p>

          {clientData.websiteLink && (
            <div className="my-6 md:my-8 p-3 md:p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <p className="font-bold text-blue-900 mb-1 md:mb-2 text-sm md:text-base">Live Demo Available</p>
              <p className="text-blue-800 mb-1 md:mb-2 text-sm md:text-base">I have prepared a live preview of the proposed design. You can explore it here:</p>
              <a
                href={clientData.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-700 font-bold hover:text-blue-900 hover:underline text-base md:text-lg break-all sm:break-normal"
              >
                {clientData.websiteLink} <ExternalLink className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              </a>
            </div>
          )}

          <p className="mt-4 md:mt-6">
            Regarding hosting: Currently, you pay the provider directly. In this new proposal, <strong>I will manage and pay the hosting provider directly</strong>
            {(pricingData.newHosting - pricingData.hostingDiscount) === 0
              ? ", with hosting included at no extra cost to you."
              : `, simplifying your billing to a single low monthly fee of $${pricingData.newHosting - pricingData.hostingDiscount}.`}
          </p>
        </div>

        {/* Comparison Table */}
        <ComparisonTable {...pricingData} />

        {/* Benefits Grid */}
        <BenefitsSection />

        {/* Financial Summary Box */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 md:p-8 mb-8 md:mb-12 page-break-inside-avoid">
          <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-6 border-b border-slate-200 pb-4">Financial Summary</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

            {/* Card 1: Investment */}
            <div className="bg-white rounded-lg p-4 md:p-5 border border-slate-200 shadow-sm flex flex-col justify-center h-full">
              <p className="text-xs md:text-sm uppercase tracking-wide text-slate-500 font-bold mb-1 md:mb-2">One-Time Investment</p>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                ${pricingData.newCreation}
                {pricingData.creationDiscountPercent != null && pricingData.creationDiscountPercent > 0 && (
                  <span className="ml-2 text-lg md:text-xl font-semibold text-green-600">({pricingData.creationDiscountPercent}% off)</span>
                )}
              </div>
              <p className="text-sm md:text-base text-slate-500 mt-1 md:mt-2">Design & Development Fee</p>
            </div>

            {/* Card 2: Monthly */}
            <div className="bg-blue-50 rounded-lg p-4 md:p-5 border border-blue-100 shadow-sm flex flex-col justify-center h-full">
              <p className="text-xs md:text-sm uppercase tracking-wide text-blue-700 font-bold mb-1 md:mb-2">New Monthly Total</p>
              <div className="text-3xl md:text-4xl font-bold text-blue-700">${(pricingData.newHosting - pricingData.hostingDiscount) + pricingData.newMaintenance}</div>
              <p className="text-sm md:text-base text-blue-600/80 mt-1 md:mt-2">Hosting + Maintenance</p>
            </div>

            {/* Card 3: Savings */}
            <div className="bg-green-50 rounded-lg p-4 md:p-5 border border-green-100 shadow-sm flex flex-col justify-center h-full sm:col-span-2 md:col-span-1">
              <p className="text-xs md:text-sm uppercase tracking-wide text-green-700 font-bold mb-1 md:mb-2">Estimated Annual Savings</p>
              <div className="text-3xl md:text-4xl font-bold text-green-700">${yearlySavings}</div>
              <p className="text-sm md:text-base text-green-600/80 mt-1 md:mt-2">That's ${monthlySavings} saved every month</p>
            </div>
          </div>
        </div>

        {/* Closing & CTA */}
        <div className="mt-10 md:mt-14 pt-8 md:pt-10 border-t-2 border-slate-100 page-break-inside-avoid">
          <p className="text-slate-700 mb-6 md:mb-8 leading-relaxed text-base md:text-lg">
            I am confident this new website will better serve your students and help attract new families to
            {clientData.clientName === "Tiger Lee’s World Class Tae Kwon Do" ? "Tiger Lee’s World Class Tae Kwon Do" : clientData.clientName}. I am ready to begin work immediately upon approval.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 items-start sm:items-center justify-between">
            <div className="w-full sm:w-auto">
              <p className="font-bold text-slate-900 text-lg md:text-xl">Ready to proceed?</p>
              <p className="text-slate-500 text-sm md:text-base mt-1">
                {isSigned ? "Quote accepted on " + new Date().toLocaleDateString() : "Please sign below to accept this quote."}
              </p>
            </div>

            <div className="w-full sm:w-72 pt-4 sm:pt-0">
              {isSigned && signatureData ? (
                <div className="border-b-2 border-slate-300 pb-2">
                  <img src={signatureData} alt="Client Signature" className="h-12 md:h-16 object-contain mb-2" />
                  <p className="text-xs text-slate-400 uppercase font-bold">Authorized Signature</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setShowSignModal(true)}
                    className="w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] no-print text-sm md:text-base"
                  >
                    Click to Sign & Accept
                  </button>
                  <div className="w-full border-b-2 border-slate-300 mt-4 print:block hidden"></div>
                  <p className="text-xs text-slate-400 uppercase font-bold pt-2 print:block hidden">Authorized Signature</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-400 text-base">
              Thank you for your business.
            </p>
          </div>
        </div>

      </div>

      {/* Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Accept Proposal</h3>
              <button onClick={() => setShowSignModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-4 text-sm">
                By signing below, you agree to the terms outlined in this proposal (Quote #{clientData.quoteNumber}).
              </p>
              <SignaturePad
                onSave={handleSignatureSubmit}
                onCancel={() => setShowSignModal(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 text-slate-400 text-base no-print">
        &copy; {new Date().getFullYear()} {clientData.developerName}. All rights reserved.
      </div>
    </div>
  );
};

export default App;