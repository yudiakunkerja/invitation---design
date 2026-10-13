import React from 'react';
import { Sparkles } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface LoveStorySectionProps {
  config: WeddingConfig;
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ config }) => {
  return (
    <section id="kisah" className="py-24 px-6 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9c825a] font-sans font-medium block">
            Perjalanan Dua Hati
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-stone-900 mt-2 font-normal">
            Kisah Cinta Kami
          </h2>
          <p className="text-xs text-stone-600 mt-2 max-w-lg mx-auto font-sans">
            Setiap cerita cinta itu indah, namun bagi kami, cerita ini adalah anugerah terindah dari Sang Pencipta.
          </p>
          <div className="w-16 h-px bg-[#d6cebe] mx-auto mt-4" />
        </div>

        {/* Milestone Timeline */}
        <div className="relative border-l border-[#d6cebe] ml-4 sm:ml-32 pl-6 sm:pl-10 space-y-12">
          {config.loveStory.map((milestone, idx) => (
            <div key={idx} className="relative group">
              {/* Dot on line */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#8a724d] border-2 border-[#faf8f5] shadow-sm flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Year label */}
              <div className="sm:absolute sm:-left-32 sm:top-1 text-xs font-mono font-bold text-[#8a724d] tracking-wider uppercase mb-1 sm:mb-0">
                {milestone.year}
              </div>

              {/* Card content */}
              <div className="bg-[#f7f4ee] p-6 rounded-xl border border-[#e8dfcf] shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-[#8a724d]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium text-stone-900">
                    {milestone.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                  {milestone.story}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
