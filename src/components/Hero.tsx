'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, MapPin, TrendingUp, Shield, Star } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const quickSearches = ['Сино', 'Фирдавсӣ', 'Исмоили Сомонӣ', 'Шоҳмансур'];

  const statLabels = {
    views: { tj: 'Эълонҳо', ru: 'Объявлений', en: 'Listings' },
    districts: { tj: 'Ноҳияҳо', ru: 'Района', en: 'Districts' },
    safe: { tj: 'Бехатар', ru: 'Безопасно', en: 'Verified' },
    rating: { tj: 'Рейтинг', ru: 'Рейтинг', en: 'Rating' },
  };

  const stats = [
    { icon: TrendingUp, value: '10,000+', label: statLabels.views[locale] },
    { icon: MapPin, value: '4', label: statLabels.districts[locale] },
    { icon: Shield, value: '100%', label: statLabels.safe[locale] },
    { icon: Star, value: '4.9', label: statLabels.rating[locale] },
  ];

  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/90 text-sm font-medium">
            {t('heroSubtitle')}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: 'Josefin Sans, sans-serif' }}
        >
          {t('heroTitle').split('\n').map((line, i) => (
            <span key={i}>
              {i === 1 ? (
                <span className="text-transparent bg-clip-text" style={{
                  backgroundImage: 'linear-gradient(90deg, #5EEAD4, #BAE6FD)'
                }}>
                  {line}
                </span>
              ) : line}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>

        {/* Search box */}
        <form
          onSubmit={handleSearch}
          className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl shadow-teal-900/20 mb-4"
        >
          <div className="flex-1 flex items-center gap-2 px-3">
            <MapPin className="w-5 h-5 text-[#0F766E] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 bg-transparent text-[#134E4A] placeholder-[#5B7F7D] text-sm py-2 outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            {t('searchBtn')}
          </button>
        </form>

        {/* Quick search */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {quickSearches.map((qs) => (
            <button
              key={qs}
              onClick={() => onSearch(qs)}
              className="px-4 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-full text-white text-sm font-medium transition-all cursor-pointer"
            >
              {qs}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={value} className="glass-dark rounded-2xl p-4 text-center">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5 text-teal-300" />
              </div>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                {value}
              </div>
              <div className="text-white/70 text-xs mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#F0FDFA" />
        </svg>
      </div>
    </section>
  );
}
