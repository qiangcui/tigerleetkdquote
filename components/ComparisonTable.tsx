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
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm mb-12">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="py-5 px-8 text-lg font-bold text-slate-500 uppercase tracking-wider w-1/3">Feature / Cost Item</th>
            <th className="py-5 px-8 text-lg font-bold text-slate-700 w-1/4">Current Setup</th>
            <th className="py-5 px-8 text-lg font-bold text-blue-700 bg-blue-50 w-1/3 border-l border-blue-100">Proposed Solution</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {/* One-time Cost */}
          <tr className="border-b border-slate-100">
            <td className="py-5 px-8 font-medium text-lg">Website Creation (One-time)</td>
            <td className="py-5 px-8 text-slate-400 italic text-lg">
              <div className="flex items-center gap-2">
                <Minus className="w-5 h-5" /> Already Paid
              </div>
            </td>
            <td className="py-5 px-8 font-bold bg-blue-50/30 border-l border-blue-50 text-slate-900 text-lg">
              ${newCreation}
              <span className="block text-lg font-normal text-slate-500">Modern Redesign</span>
            </td>
          </tr>

          {/* Hosting */}
          <tr className="border-b border-slate-100">
            <td className="py-5 px-8 font-medium text-lg">Monthly Hosting</td>
            <td className="py-5 px-8 text-red-600 font-medium text-lg">
              ${currentHosting}/mo
              <span className="block text-lg font-normal text-slate-500">
                Direct to Provider
              </span>
            </td>
            <td className={`py-5 px-8 font-bold bg-blue-50/30 border-l border-blue-50 text-lg ${clientHostingCost === 0 ? 'text-green-600' : 'text-slate-900'}`}>
              ${clientHostingCost}/mo
              {hostingDiscount > 0 ? (
                <span className="block text-lg font-normal text-slate-500">
                  ${newHosting} value - Covered by Developer
                </span>
              ) : (
                <span className="block text-lg font-normal text-slate-500">
                  Managed & Paid by Developer
                </span>
              )}
            </td>
          </tr>

          {/* Maintenance */}
          <tr className="border-b border-slate-100">
            <td className="py-5 px-8 font-medium text-lg">Monthly Maintenance</td>
            <td className="py-5 px-8 text-lg">${currentMaintenance}/mo</td>
            <td className="py-5 px-8 bg-blue-50/30 border-l border-blue-50 text-lg">
              ${newMaintenance}/mo
            </td>
          </tr>

          {/* Design Quality */}
          <tr className="border-b border-slate-200">
            <td className="py-5 px-8 font-medium text-lg">Design & Technology</td>
            <td className="py-5 px-8 text-slate-500 text-lg">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                Standard / Dated
              </div>
            </td>
            <td className="py-5 px-8 bg-blue-50/30 border-l border-blue-50 text-blue-700 font-semibold text-lg">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Modern & Responsive
              </div>
            </td>
          </tr>

          {/* Totals Row */}
          <tr className="bg-slate-900 text-white">
            <td className="py-6 px-8 font-bold text-right border-t border-slate-800 text-lg">TOTAL MONTHLY COST</td>
            <td className="py-6 px-8 font-medium text-slate-300 border-t border-slate-800 text-lg">
              ${currentTotalMonthly}/mo
            </td>
            <td className="py-6 px-8 font-bold text-lg bg-blue-600 border-t border-blue-500 border-l">
              ${newTotalMonthly}/mo
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};