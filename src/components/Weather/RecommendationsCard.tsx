import React from 'react';
import { WeatherRecommendation } from '../../types';
import {
  Sparkles,
  Shirt,
  Compass,
  Car,
  CheckCircle2,
  AlertTriangle,
  Umbrella,
  ShieldAlert,
} from 'lucide-react';

interface RecommendationsCardProps {
  recommendation: WeatherRecommendation;
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({
  recommendation,
}) => {
  return (
    <div
      id="weather-planning-recommendations"
      className="w-full bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-none backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Intelligent Planning & Travel Recommendations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated lifestyle advisory derived from current atmospheric dynamics
            </p>
          </div>
        </div>

        {/* Condition Rating Badge */}
        <span
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${
            recommendation.badge.variant === 'rose'
              ? 'bg-rose-500/10 text-rose-600 border-rose-300 dark:border-rose-900/50 dark:text-rose-400'
              : recommendation.badge.variant === 'amber'
              ? 'bg-amber-500/10 text-amber-700 border-amber-300 dark:border-amber-900/50 dark:text-amber-400'
              : recommendation.badge.variant === 'blue'
              ? 'bg-sky-500/10 text-sky-700 border-sky-300 dark:border-sky-900/50 dark:text-sky-400'
              : recommendation.badge.variant === 'indigo'
              ? 'bg-indigo-500/10 text-indigo-700 border-indigo-300 dark:border-indigo-900/50 dark:text-indigo-400'
              : 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:border-emerald-900/50 dark:text-emerald-400'
          }`}
        >
          {recommendation.badge.label}
        </span>
      </div>

      {/* Warning banner if severe */}
      {recommendation.warning && (
        <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3">
          <ShieldAlert size={18} className="shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div>
            <span className="font-extrabold mr-1">Advisory Alert:</span>
            <span>{recommendation.warning}</span>
          </div>
        </div>
      )}

      {/* Primary Key Takeaway */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50/30 to-slate-50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 mb-5">
        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="text-base">💡</span>
          <span>{recommendation.summary}</span>
        </p>
      </div>

      {/* 3 Core Pillars: Outfit, Activities, Commute */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* Outfit Guide */}
        <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-slate-100">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Shirt size={14} />
            </div>
            <span>Outfit Recommendation</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {recommendation.outfit}
          </p>
        </div>

        {/* Outdoor & Leisure */}
        <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-slate-100">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Compass size={14} />
            </div>
            <span>Outdoor & Recreation</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {recommendation.activity}
          </p>
        </div>

        {/* Commute & Transit */}
        <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-sky-300 dark:hover:border-sky-800 transition-colors">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-slate-100">
            <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Car size={14} />
            </div>
            <span>Commute & Transit</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {recommendation.commute}
          </p>
        </div>
      </div>

      {/* Recommended Gear Checklist */}
      {recommendation.gear.length > 0 && (
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-1">
            <Umbrella size={14} className="text-sky-500" />
            Essential Gear:
          </span>
          {recommendation.gear.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
            >
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
