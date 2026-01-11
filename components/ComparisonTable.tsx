import React from 'react';
import { Check, X, Minus } from 'lucide-react';

interface ComparisonTableProps {
  currentHosting: number;
  currentMaintenance: number;
  newCreation: number;
  newHosting: number;
  newMaintenance: number;
  hostingDiscount: number;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  currentHosting,
  currentMaintenance,
  newCreation,
  newHosting,
  newMaintenance,
  hostingDiscount,
}) => {
  const currentTotalMonthly = currentHosting + currentMaintenance;
  const newTotalMonthly = (newHosting - hostingDiscount) + newMaintenance;
  const clientHostingCost = newHosting - hostingDiscount;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm mb-8 md:mb-12">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="py-3 px-4 md:py-5 md:px-8 text-sm md:text-lg font-bold text-slate-500 uppercase tracking-wider w-1/3">Feature / Cost Item</th>
            <th className="py-3 px-4 md:py-5 md:px-8 text-sm md:text-lg font-bold text-slate-700 w-1/4">Current Setup</th>
            <th className="py-3 px-4 md:py-5 md:px-8 text-sm md:text-lg font-bold text-blue-700 bg-blue-50 w-1/3 border-l border-blue-100">Proposed Solution</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {/* One-time Cost */}
          <tr className="border-b border-slate-100">
            <td className="py-3 px-4 md:py-5 md:px-8 font-medium text-sm md:text-lg">Website Creation (One-time)</td>
            <td className="py-3 px-4 md:py-5 md:px-8 text-slate-400 italic text-sm md:text-lg">
              <div className="flex items-center gap-2">
                <Minus className="w-4 h-4 md:w-5 md:h-5" /> Already Paid
              </div>
            </td>
            <td className="py-3 px-4 md:py-5 md:px-8 font-bold bg-blue-50/30 border-l border-blue-50 text-slate-900 text-sm md:text-lg">
              ${newCreation}
              <span className="block text-sm md:text-lg font-normal text-slate-500">Modern Redesign</span>
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
                  ${newHosting} value - Covered by Developer
                </span>
              ) : (
                <span className="block text-sm md:text-lg font-normal text-slate-500">
                  Managed & Paid by Developer
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

          {/* Design Quality */}
          <tr className="border-b border-slate-200">
            <td className="py-3 px-4 md:py-5 md:px-8 font-medium text-sm md:text-lg">Design & Technology</td>
            <td className="py-3 px-4 md:py-5 md:px-8 text-slate-500 text-sm md:text-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400 shrink-0"></span>
                Standard / Dated
              </div>
            </td>
            <td className="py-3 px-4 md:py-5 md:px-8 bg-blue-50/30 border-l border-blue-50 text-blue-700 font-semibold text-sm md:text-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 shrink-0"></span>
                Modern & Responsive
              </div>
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