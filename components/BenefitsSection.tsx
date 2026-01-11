import React from 'react';
import { ShieldCheck, CalendarCheck, Palette, Mail } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <CalendarCheck className="w-8 h-8 text-purple-600" />,
      title: "New Booking Platform",
      description: "Integrated scheduling system to easily manage classes and student appointments."
    },
    {
      icon: <Palette className="w-8 h-8 text-pink-500" />,
      title: "Fancy & Modern Design",
      description: "A visually stunning interface that reflects the high quality of your Tae Kwon Do instruction."
    },
    {
      icon: <Mail className="w-8 h-8 text-blue-500" />,
      title: "Better Email",
      description: "Professional, reliable email setup to ensure you never miss a communication from parents."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
      title: "Worry-Free Hosting",
      description: "I manage the technical details and hosting payments so you can focus on teaching."
    }
  ];

  return (
    <div className="mb-8 md:mb-12">
      <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
        <span className="bg-blue-600 w-1 md:w-1.5 h-6 md:h-8 rounded-full"></span>
        Key Benefits of the Upgrade
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-4 md:gap-5 p-4 md:p-6 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2 md:p-3 bg-slate-50 rounded-xl shrink-0">
              {React.cloneElement(benefit.icon as React.ReactElement, { className: "w-6 h-6 md:w-8 md:h-8" })}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1 md:mb-2 text-base md:text-lg">{benefit.title}</h4>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};