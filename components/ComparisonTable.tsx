import React from 'react';
import { Check, X } from 'lucide-react';

interface ComparisonTableProps {
  currentHosting: number;
  currentMaintenance: number;
  newCreation: number;
  newHosting: number;
  newMaintenance: number;
  hostingDiscount: number;
  creationDiscountPercent?: number;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  currentHosting,
  currentMaintenance,
  newCreation,
  newHosting,
  newMaintenance,
  hostingDiscount,
  creationDiscountPercent = 0,
}) => {
  const currentTotalMonthly = currentHosting + currentMaintenance;
  const newTotalMonthly = (newHosting - hostingDiscount) + newMaintenance;
  const clientHostingCost = newHosting - hostingDiscount;
  const creationOriginalPrice = creationDiscountPercent > 0 && creationDiscountPercent < 100
    ? Math.round(newCreation / (1 - creationDiscountPercent / 100))
    : null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm mb-8 md:mb-12">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="py-3 px-4 md:py-5 md:px-8 text-sm md:text-lg font-bold text-slate-500 uppercase tracking-wider w-1/3">Feature / Cost Item</th>
            <th className="py-3 px-4 md:py-5 md:px-8 text-sm md:text-lg font-bold text-slate-700 w-1/4">Your current website</th>
            <th className="py-3 px-4 md:py-5 md:px-8 text-sm md:text-lg font-bold text-blue-700 bg-blue-50 w-1/3 border-l border-blue-100">Proposed new website</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {/* One-time Cost */}
          <tr className="border-b border-slate-100">
            <td className="py-3 px-4 md:py-5 md:px-8 font-medium text-sm md:text-lg">Website Creation (One-time)</td>
            <td className="py-3 px-4 md:py-5 md:px-8 text-slate-600 text-sm md:text-lg">$0</td>
            <td className="py-3 px-4 md:py-5 md:px-8 font-bold bg-blue-50/30 border-l border-blue-50 text-slate-900 text-sm md:text-lg">
              {creationOriginalPrice != null ? (
                <>
                  <span className="line-through text-slate-400 font-normal mr-2">${creationOriginalPrice}</span>
                  <span className="text-green-600">${newCreation}</span>
                  <span className="block text-sm md:text-lg font-normal text-green-600">{creationDiscountPercent}% discount applied</span>
                </>
              ) : (
                <>
                  ${newCreation}
                  <span className="block text-sm md:text-lg font-normal text-slate-500">Modern Redesign</span>
                </>
              )}
            </td>
          </tr>

          {/* Hosting */}
          <tr className="border-b border-slate-100">
            <td className="py-3 px-4 md:py-5 md:px-8 font-medium text-sm md:text-lg">Monthly Hosting</td>
            <td className="py-3 px-4 md:py-5 md:px-8 text-red-600 font-medium text-sm md:text-lg">
              ${currentHosting}/mo
              <span className="block text-sm md:text-lg font-normal text-slate-500">
                Direct to Provider
              </span>
            </td>
            <td className={`py-3 px-4 md:py-5 md:px-8 font-bold bg-blue-50/30 border-l border-blue-50 text-sm md:text-lg ${clientHostingCost === 0 ? 'text-green-600' : 'text-slate-900'}`}>
              ${clientHostingCost}/mo
              {hostingDiscount > 0 ? (
                <span className="block text-sm md:text-lg font-normal text-slate-500">
                  $15 value - Covered by Gloria Cloud
                </span>
              ) : (
                <span className="block text-sm md:text-lg font-normal text-slate-500">
                  Managed & Paid by Gloria Cloud
                </span>
              )}
            </td>
          </tr>

          {/* Maintenance */}
          <tr className="border-b border-slate-100">
            <td className="py-3 px-4 md:py-5 md:px-8 font-medium text-sm md:text-lg">Monthly Maintenance</td>
            <td className="py-3 px-4 md:py-5 md:px-8 text-sm md:text-lg">${currentMaintenance}/mo</td>
            <td className="py-3 px-4 md:py-5 md:px-8 bg-blue-50/30 border-l border-blue-50 text-sm md:text-lg">
              ${newMaintenance}/mo
            </td>
          </tr>

          {/* Design & look */}
          <tr className="border-b border-slate-100">
            <td className="py-3 px-4 md:py-5 md:px-8 font-medium text-sm md:text-lg">Design & look</td>
            <td className="py-3 px-4 md:py-5 md:px-8 text-slate-600 text-sm md:text-lg">
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                <span>Older style, limited layout options</span>
              </div>
            </td>
            <td className="py-3 px-4 md:py-5 md:px-8 bg-blue-50/30 border-l border-blue-50 text-sm md:text-lg">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-slate-800">Modern, professional design tailored to your brand</span>
              </div>
            </td>
          </tr>

          {/* Booking / scheduling */}
          <tr className="border-b border-slate-100">
            <td className="py-3 px-4 md:py-5 md:px-8 font-medium text-sm md:text-lg">Booking / classes</td>
            <td className="py-3 px-4 md:py-5 md:px-8 text-slate-600 text-sm md:text-lg">
              Potential cost: Bookly Pro $129.00 (Lifetime)
            </td>
            <td className="py-3 px-4 md:py-5 md:px-8 bg-blue-50/30 border-l border-blue-50 text-sm md:text-lg">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-slate-800">Custom booking platform included</span>
              </div>
            </td>
          </tr>

          {/* Who manages hosting */}
          <tr className="border-b border-slate-200">
            <td className="py-3 px-4 md:py-5 md:px-8 font-medium text-sm md:text-lg">Who manages hosting</td>
            <td className="py-3 px-4 md:py-5 md:px-8 text-slate-600 text-sm md:text-lg">
              You pay the provider directly; you handle renewals and billing
            </td>
            <td className="py-3 px-4 md:py-5 md:px-8 bg-blue-50/30 border-l border-blue-50 text-sm md:text-lg text-slate-800">
              Gloria Cloud manages and pays the host; you get one simple monthly invoice
            </td>
          </tr>

          {/* Totals Row */}
          <tr className="bg-slate-900 text-white">
            <td className="py-4 px-4 md:py-6 md:px-8 font-bold text-right border-t border-slate-800 text-sm md:text-lg">TOTAL MONTHLY COST</td>
            <td className="py-4 px-4 md:py-6 md:px-8 font-medium text-slate-300 border-t border-slate-800 text-sm md:text-lg">
              ${currentTotalMonthly}/mo
            </td>
            <td className="py-4 px-4 md:py-6 md:px-8 font-bold text-sm md:text-lg bg-blue-600 border-t border-blue-500 border-l">
              ${newTotalMonthly}/mo
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};