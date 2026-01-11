import React from 'react';
import { Monitor, Calendar, Hash } from 'lucide-react';
import { ClientData } from '../types';

interface HeaderProps {
  data: ClientData;
}

export const Header: React.FC<HeaderProps> = ({ data }) => {
  return (
    <div className="border-b-2 border-slate-100 pb-6 md:pb-10 mb-6 md:mb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
        <div>
          <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
            <div className="bg-blue-600 p-2 md:p-3 rounded-xl shrink-0">
              <Monitor className="text-white w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Website Proposal</h1>
          </div>
          <p className="text-slate-500 font-medium text-base md:text-lg">Professional Design & Development</p>
        </div>

        <div className="text-left md:text-right flex flex-col items-start md:items-end gap-2 text-sm md:text-base w-full md:w-auto">
          <div className="flex items-center gap-3 text-slate-600">
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium">{data.date}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Hash className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium">Ref: {data.quoteNumber}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-slate-50 p-4 md:p-6 rounded-lg border border-slate-100">
          <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Prepared For</p>
          <h2 className="text-lg md:text-xl font-bold text-slate-800 break-words">{data.clientName}</h2>
        </div>
        <div className="bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-100">
          <p className="text-xs md:text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Prepared By</p>
          <h2 className="text-lg md:text-xl font-bold text-blue-900">{data.developerName}</h2>
          <p className="text-sm md:text-base text-blue-700 mt-1">Digital Solutions Architect</p>
        </div>
      </div>
    </div>
  );
};