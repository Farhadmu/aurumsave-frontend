'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../lib/language-context';
import { Badge } from '../../components/ui/Badge';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Scale,
  Award,
  ChevronRight,
  Calculator,
} from 'lucide-react';

export default function AcademyPage() {
  const { language, t, toLocalizedDigits } = useLanguage();

  // Unit Converter state
  const [convertUnit, setConvertUnit] = useState<'bhori' | 'grams' | 'milligrams' | 'ounce'>('bhori');
  const [convertValue, setConvertValue] = useState<number>(1);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Conversion calculations
  const getGrams = (): number => {
    switch (convertUnit) {
      case 'bhori':
        return convertValue * 11.664;
      case 'milligrams':
        return convertValue / 1000;
      case 'ounce':
        return convertValue * 31.1035; // Troy ounce
      default:
        return convertValue;
    }
  };

  const grams = getGrams();
  const bhori = (grams / 11.664).toFixed(3);
  const milligrams = Math.round(grams * 1000);
  const ounce = (grams / 31.1035).toFixed(4);

  const quizQuestions = [
    {
      questionEn: 'What is the benchmark purity percentage of 24K pure gold bullion?',
      questionBn: '২৪ ক্যারেট খাঁটি স্বর্ণের বিশুদ্ধতার শতকরা হার কত?',
      optionsEn: ['91.6%', '99.9%', '75.0%', '87.5%'],
      optionsBn: ['৯১.৬%', '৯৯.৯%', '৭৫.০%', '৮৭.৫%'],
      correct: 1,
    },
    {
      questionEn: 'In Bangladesh, how many grams equal exactly one traditional Bhori (Tola)?',
      questionBn: 'বাংলাদেশে ঐতিহ্যবাহী ১ ভরি সমান ঠিক কত গ্রাম স্বর্ণ?',
      optionsEn: ['10.000 g', '11.664 g', '12.500 g', '15.000 g'],
      optionsBn: ['১০.০০০ গ্রাম', '১১.৬৬৪ গ্রাম', '১২.৫০০ গ্রাম', '১৫.০০০ গ্রাম'],
      correct: 1,
    },
    {
      questionEn: 'Where is your physical gold physically held when you buy on AurumSave?',
      questionBn: 'AurumSave-এ স্বর্ণ কেনার পর আসল স্বর্ণ কোথায় সংরক্ষিত থাকে?',
      optionsEn: [
        'Unbacked digital promissory notes',
        'Bank-grade insured physical vault in segregated custody',
        'General company trading pool',
        'Uninsured retail store shelf',
      ],
      optionsBn: [
        'অসমর্থিত ডিজিটাল প্রমিসরি নোটে',
        'ব্যাংক-গ্রেড বীমাকৃত ভল্টে ক্লায়েন্টের নামে সংরক্ষিত',
        'কোম্পানির সাধারণ ট্রেডিং ফান্ডে',
        'অনিরাপদ সাধারণ শো-রুমে',
      ],
      correct: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-aurum-midnight text-aurum-text py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-aurum-border/60">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="gold" size="sm">
                <GraduationCap className="w-3.5 h-3.5 mr-1" />
                {language === 'bn' ? 'স্বর্ণ জ্ঞান ও সুরক্ষা' : 'Financial Literacy'}
              </Badge>
              <span className="text-xs text-aurum-text-muted font-mono">
                {language === 'bn' ? 'বাজুস ও আন্তর্জাতিক মান' : 'Standard Bullion Guide'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-aurum-text">
              {t('academy.title')}
            </h1>
            <p className="text-aurum-text-muted text-sm sm:text-base mt-1.5 max-w-2xl">
              {t('academy.subtitle')}
            </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center font-bold font-serif-luxury">
              24K
            </div>
            <h3 className="font-bold text-base text-aurum-text">
              {language === 'bn' ? '২৪ ক্যারেট (৯৯.৯%)' : '24K (99.9% Purity)'}
            </h3>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              {language === 'bn'
                ? 'সবচেয়ে খাঁটি বিনিয়োগ-গ্রেড স্বর্ণ বার। কোনো খাদ বা সংকর ধাতু নেই। আন্তর্জাতিকভাবে সর্বজনস্বীকৃত সম্পদ।'
                : 'Highest investment-grade bullion bars with zero alloys. Globally recognized standard for wealth preservation.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-aurum-gold/15 text-aurum-gold flex items-center justify-center font-bold font-serif-luxury">
              22K
            </div>
            <h3 className="font-bold text-base text-aurum-text">
              {language === 'bn' ? '২২ ক্যারেট (৯১.৬%)' : '22K (91.6% Purity)'}
            </h3>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              {language === 'bn'
                ? 'ঐতিহ্যবাহী অলংকার তৈরির সবচেয়ে জনপ্রিয় মান। কিছুটা তাম্র বা রূপার মিশ্রণ থাকে যাতে দৃঢ়তা বজায় থাকে।'
                : 'Traditional standard widely favored across South Asia. Contains 8.4% reinforcing alloy for durability.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-aurum-text">
              {language === 'bn' ? 'স্বচ্ছ বাজার স্প্রেড' : 'Transparent Spread'}
            </h3>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              {language === 'bn'
                ? 'ক্রয় ও বিক্রয় মূল্যের ব্যবধানই স্প্রেড। কোনো গোপন চার্জ বা অন্যায্য কাটিং চার্জ ছাড়া লাইভ রেট দেখুন।'
                : 'Difference between purchase and liquidation prices. Complete fee breakdown before every confirmation.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-aurum-card border border-aurum-border hover:border-aurum-gold/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-aurum-text">
              {language === 'bn' ? 'ভল্ট হেফাজত ও অডিট' : 'Segregated Vaulting'}
            </h3>
            <p className="text-xs text-aurum-text-muted leading-relaxed">
              {language === 'bn'
                ? 'প্রতিটি মিলিগ্রাম স্বর্ণ শীর্ষ ব্যাংকের গ্রেড-১ ভল্টে সুরক্ষিত এবং তৃতীয় পক্ষের অডিটর দ্বারা প্রতি মাসে যাচাইকৃত।'
                : 'Physical gold stored in Grade-1 bullion vaults, fully insured and audited under strict dual controls.'}
            </p>
          </div>
        </div>

        {/* Interactive Unit Conversion Tool */}
        <div className="bg-aurum-card rounded-3xl p-6 sm:p-8 border border-aurum-border shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurum-border/60">
            <div>
              <div className="flex items-center space-x-2 text-aurum-gold text-xs font-bold uppercase tracking-wider mb-1">
                <ArrowRightLeft className="w-4 h-4" />
                <span>{language === 'bn' ? 'পরিমাপ রূপান্তর টুল' : 'Bullion Unit Converter'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-aurum-text">
                {language === 'bn' ? 'স্বর্ণের একক ক্যালকুলেটর (ভরি / গ্রাম / মিলিগ্রাম)' : 'Gold Measurement Converter'}
              </h2>
            </div>
            <Badge variant="gold" size="sm">
              1 Bhori = 11.664 g
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-3">
              <label className="block text-xs font-bold text-aurum-text">
                {language === 'bn' ? 'পরিমাণ লিখুন ও একক নির্বাচন করুন' : 'Input Value & Unit'}
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="any"
                  min="0.001"
                  value={convertValue}
                  onChange={(e) => setConvertValue(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-4 py-3 rounded-xl bg-aurum-surface border border-aurum-border focus:border-aurum-gold text-aurum-text font-bold text-base outline-none font-mono"
                />
                <select
                  value={convertUnit}
                  onChange={(e: any) => setConvertUnit(e.target.value)}
                  className="px-3 py-3 rounded-xl bg-aurum-surface border border-aurum-border text-aurum-text text-sm font-semibold outline-none"
                >
                  <option value="bhori">{language === 'bn' ? 'ভরি (Bhori)' : 'Bhori / Tola'}</option>
                  <option value="grams">{language === 'bn' ? 'গ্রাম (Grams)' : 'Grams (g)'}</option>
                  <option value="milligrams">{language === 'bn' ? 'মিলিগ্রাম (mg)' : 'Milligrams (mg)'}</option>
                  <option value="ounce">{language === 'bn' ? 'ট্রয় আউন্স (oz)' : 'Troy Ounce (oz)'}</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-aurum-surface border border-aurum-border text-center">
                <span className="text-[10px] text-aurum-text-dim uppercase font-bold block">
                  {language === 'bn' ? 'ভরি' : 'Bhori'}
                </span>
                <span className="text-base font-bold text-aurum-gold font-mono mt-1 block">
                  {toLocalizedDigits(bhori)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-aurum-surface border border-aurum-border text-center">
                <span className="text-[10px] text-aurum-text-dim uppercase font-bold block">
                  {language === 'bn' ? 'গ্রাম' : 'Grams'}
                </span>
                <span className="text-base font-bold text-aurum-text font-mono mt-1 block">
                  {toLocalizedDigits(grams.toFixed(3))} g
                </span>
              </div>

              <div className="p-4 rounded-xl bg-aurum-surface border border-aurum-border text-center">
                <span className="text-[10px] text-aurum-text-dim uppercase font-bold block">
                  {language === 'bn' ? 'মিলিগ্রাম' : 'Milligrams'}
                </span>
                <span className="text-base font-bold text-aurum-text font-mono mt-1 block">
                  {toLocalizedDigits(milligrams.toLocaleString())} mg
                </span>
              </div>

              <div className="p-4 rounded-xl bg-aurum-surface border border-aurum-border text-center">
                <span className="text-[10px] text-aurum-text-dim uppercase font-bold block">
                  {language === 'bn' ? 'ট্রয় আউন্স' : 'Troy Oz'}
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono mt-1 block">
                  {toLocalizedDigits(ounce)} oz
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Check Quiz */}
        <div className="bg-aurum-card rounded-3xl p-6 sm:p-8 border border-aurum-border shadow-xl space-y-6">
          <div className="flex items-center space-x-2 text-aurum-gold text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{language === 'bn' ? 'স্বর্ণ জ্ঞান যাচাই কুইজ' : 'Gold Knowledge Check'}</span>
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, qIndex) => {
              const questionText = language === 'bn' ? q.questionBn : q.questionEn;
              const options = language === 'bn' ? q.optionsBn : q.optionsEn;
              const isSelected = selectedAnswers[qIndex] !== undefined;
              const isCorrect = selectedAnswers[qIndex] === q.correct;

              return (
                <div key={qIndex} className="p-5 rounded-2xl bg-aurum-surface/70 border border-aurum-border space-y-3">
                  <h4 className="text-sm font-bold text-aurum-text">
                    {toLocalizedDigits(qIndex + 1)}. {questionText}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {options.map((opt, optIndex) => {
                      const isOptionSelected = selectedAnswers[qIndex] === optIndex;
                      let btnStyle = 'bg-aurum-card border-aurum-border hover:border-aurum-gold/40 text-aurum-text';

                      if (quizSubmitted) {
                        if (optIndex === q.correct) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-aurum-gold/20 border-aurum-gold text-aurum-gold font-bold';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => {
                            if (!quizSubmitted) {
                              setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex });
                            }
                          }}
                          className={`text-left px-4 py-2.5 rounded-xl border text-xs transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-aurum-border/60">
            <span className="text-xs text-aurum-text-muted">
              {quizSubmitted
                ? language === 'bn'
                  ? 'আপনার স্কোর যাচাই করুন।'
                  : 'Review correct answers above.'
                : language === 'bn'
                ? 'সমস্ত প্রশ্নের উত্তর নির্বাচন করুন।'
                : 'Select an answer for each question.'}
            </span>

            <button
              onClick={() => setQuizSubmitted(true)}
              disabled={quizSubmitted || Object.keys(selectedAnswers).length < quizQuestions.length}
              className="px-6 py-2.5 rounded-xl bg-aurum-gold text-aurum-midnight font-bold text-xs shadow-gold-glow hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {language === 'bn' ? 'কুইজ সাবমিট করুন' : 'Submit Answers'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
