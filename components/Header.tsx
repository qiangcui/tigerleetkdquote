import React from 'react';
import { Monitor, Calendar, Hash } from 'lucide-react';
import { ClientData } from '../types';

interface HeaderProps {
  data: ClientData;
}

export const Header: React.FC<HeaderProps> = ({ data }) => {
  return (
    <div className="border-b-2 border-slate-100 pb-10 mb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Monitor className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Website Proposal</h1>
          </div>
          <p className="text-slate-500 font-medium text-lg">Professional Design & Development</p>
        </div>
        
        <div className="text-right flex flex-col items-start md:items-end gap-2">
          <div className="flex items-center gap-3 text-slate-600">
            <Calendar className="w-5 h-5" />
            <span className="text-base font-medium">{data.date}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Hash className="w-5 h-5" />
            <span className="text-base font-medium">Ref: {data.quoteNumber}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Prepared For</p>
          <h2 className="text-xl font-bold text-slate-800">{data.clientName}</h2>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <p className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Prepared By</p>
          <h2 className="text-xl font-bold text-blue-900">{data.developerName}</h2>
          <p className="text-base text-blue-700 mt-1">Digital Solutions Architect</p>
        </div>
      </div>
    </div>
  );
};