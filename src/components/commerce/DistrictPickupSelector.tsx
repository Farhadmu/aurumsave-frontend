'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import { MapPin, Building2, Phone, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export interface PickupPoint {
  pointId: string;
  nameEn: string;
  nameBn: string;
  division: string;
  district: string;
  addressEn: string;
  addressBn: string;
  contactPerson: string;
  phone: string;
  operatingHours: string;
  dailyCapacity: number;
  status: string;
  securityFeatures?: string[];
}

export const BANGLADESH_DIVISIONS: Record<string, string[]> = {
  Dhaka: [
    'Dhaka',
    'Gazipur',
    'Narayanganj',
    'Tangail',
    'Narsingdi',
    'Manikganj',
    'Munshiganj',
    'Faridpur',
    'Gopalganj',
    'Madaripur',
    'Rajbari',
    'Shariatpur',
    'Kishoreganj',
  ],
  Chattogram: [
    'Chattogram',
    'Cox\'s Bazar',
    'Cumilla',
    'Feni',
    'Brahmanbaria',
    'Noakhali',
    'Chandpur',
    'Lakshmipur',
    'Rangamati',
    'Khagrachhari',
    'Bandarban',
  ],
  Sylhet: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  Rajshahi: [
    'Rajshahi',
    'Bogura',
    'Pabna',
    'Sirajganj',
    'Naogaon',
    'Natore',
    'Joypurhat',
    'Chapainawabganj',
  ],
  Khulna: [
    'Khulna',
    'Jashore',
    'Kushtia',
    'Satkhira',
    'Bagerhat',
    'Jhenaidah',
    'Chuadanga',
    'Magura',
    'Meherpur',
    'Narail',
  ],
  Barishal: ['Barishal', 'Bhola', 'Patuakhali', 'Pirojpur', 'Barguna', 'Jhalokathi'],
  Rangpur: [
    'Rangpur',
    'Dinajpur',
    'Gaibandha',
    'Kurigram',
    'Lalmonirhat',
    'Nilphamari',
    'Panchagarh',
    'Thakurgaon',
  ],
  Mymensingh: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
};

interface DistrictPickupSelectorProps {
  selectedPointId?: string;
  onSelectPoint: (point: PickupPoint) => void;
  lang?: 'en' | 'bn';
}

export function DistrictPickupSelector({
  selectedPointId,
  onSelectPoint,
  lang = 'en',
}: DistrictPickupSelectorProps) {
  const [division, setDivision] = useState<string>('Dhaka');
  const [district, setDistrict] = useState<string>('Dhaka');
  const [allPoints, setAllPoints] = useState<PickupPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPickupPoints() {
      setLoading(true);
      try {
        const res = await apiRequest<{ success: boolean; data: PickupPoint[] }>(
          '/commerce/pickup-points',
        );
        if (res?.data) {
          setAllPoints(res.data);
          // Auto select first point if available
          const matching = res.data.find(
            (p) => p.division === division && p.district === district,
          );
          if (matching && !selectedPointId) {
            onSelectPoint(matching);
          }
        }
      } catch (err) {
        console.error('Failed to load pickup points', err);
      } finally {
        setLoading(false);
      }
    }
    loadPickupPoints();
  }, []);

  const handleDivisionChange = (newDivision: string) => {
    setDivision(newDivision);
    const firstDistrict = BANGLADESH_DIVISIONS[newDivision]?.[0] || '';
    setDistrict(firstDistrict);
  };

  const activePointsInDistrict = allPoints.filter(
    (p) =>
      p.division.toLowerCase() === division.toLowerCase() &&
      p.district.toLowerCase() === district.toLowerCase(),
  );

  const fallbackDivisionalPoints = allPoints.filter(
    (p) => p.division.toLowerCase() === division.toLowerCase(),
  );

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Division Selector */}
        <div>
          <label className="block text-xs font-semibold text-aurum-text-muted mb-1.5 uppercase tracking-wider">
            {lang === 'bn' ? 'বিভাগ নির্বাচন করুন' : '1. Select Division'}
          </label>
          <select
            value={division}
            onChange={(e) => handleDivisionChange(e.target.value)}
            className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-sm text-aurum-text focus:outline-none focus:border-aurum-gold transition-colors font-medium"
          >
            {Object.keys(BANGLADESH_DIVISIONS).map((divName) => (
              <option key={divName} value={divName} className="bg-aurum-midnight text-white">
                {divName} Division
              </option>
            ))}
          </select>
        </div>

        {/* District Selector */}
        <div>
          <label className="block text-xs font-semibold text-aurum-text-muted mb-1.5 uppercase tracking-wider">
            {lang === 'bn' ? 'জেলা নির্বাচন করুন' : '2. Select District'}
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full bg-aurum-card-bg/80 border border-aurum-border rounded-xl px-3.5 py-2.5 text-sm text-aurum-text focus:outline-none focus:border-aurum-gold transition-colors font-medium"
          >
            {BANGLADESH_DIVISIONS[division]?.map((distName) => (
              <option key={distName} value={distName} className="bg-aurum-midnight text-white">
                {distName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results / Desks */}
      <div className="mt-2">
        <label className="block text-xs font-semibold text-aurum-text-muted mb-2 uppercase tracking-wider">
          {lang === 'bn' ? 'নির্ধারিত পিকআপ ও অ্যাসে ডেস্ক' : 'Designated Bullion Depository Desk'}
        </label>

        {loading ? (
          <div className="p-4 rounded-xl border border-aurum-border bg-aurum-card-bg/40 animate-pulse text-xs text-aurum-text-muted">
            Checking district depository network...
          </div>
        ) : activePointsInDistrict.length > 0 ? (
          <div className="space-y-2.5">
            {activePointsInDistrict.map((point) => {
              const isSelected = selectedPointId === point.pointId;
              return (
                <div
                  key={point.pointId}
                  onClick={() => onSelectPoint(point)}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-aurum-gold bg-aurum-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-aurum-gold'
                      : 'border-aurum-border/60 bg-aurum-card-bg/60 hover:border-aurum-gold/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-aurum-gold/20 flex items-center justify-center text-aurum-gold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-aurum-text">
                          {lang === 'bn' ? point.nameBn : point.nameEn}
                        </h4>
                        <p className="text-xs text-aurum-text-muted flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 text-aurum-gold shrink-0" />
                          {lang === 'bn' ? point.addressBn : point.addressEn}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-aurum-gold text-aurum-midnight">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-aurum-border/40 grid grid-cols-2 gap-2 text-[11px] text-aurum-text-dim">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-aurum-gold/70" />
                      <span>{point.operatingHours}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 justify-end">
                      <Phone className="w-3.5 h-3.5 text-aurum-gold/70" />
                      <span className="font-mono">{point.phone}</span>
                    </div>
                  </div>

                  {point.securityFeatures && point.securityFeatures.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {point.securityFeatures.map((sec, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center"
                        >
                          <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                          {sec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Honest No Desk Fallback */
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-start space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-amber-300">
                  {lang === 'bn'
                    ? `${district} জেলায় এখনও সরাসরি অরামসেভ ভল্ট ডেস্ক নেই`
                    : `No active AurumSave depository desk in ${district} yet`}
                </h5>
                <p className="text-xs text-aurum-text-muted mt-1 leading-relaxed">
                  {lang === 'bn'
                    ? `নিরাপত্তা ও গুণগত মান নিশ্চিত করতে অনুগ্রহ করে ${division} বিভাগের প্রধান রিজিওনাল হাব থেকে সংগ্রহ করুন:`
                    : `To maintain LBMA purity and dual-custody security, please collect from the nearest regional division hub:`}
                </p>
              </div>
            </div>

            {fallbackDivisionalPoints.length > 0 && (
              <div className="mt-2 space-y-2">
                <span className="text-[10px] uppercase font-bold text-aurum-gold tracking-wider">
                  Recommended Regional Hub ({division} Division):
                </span>
                {fallbackDivisionalPoints.slice(0, 1).map((hub) => (
                  <div
                    key={hub.pointId}
                    onClick={() => onSelectPoint(hub)}
                    className="cursor-pointer p-3 rounded-lg border border-aurum-gold/40 bg-aurum-gold/10 hover:bg-aurum-gold/20 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-aurum-gold">
                        {lang === 'bn' ? hub.nameBn : hub.nameEn}
                      </p>
                      <p className="text-[11px] text-aurum-text-muted mt-0.5">{hub.addressEn}</p>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-aurum-gold text-aurum-midnight shrink-0 ml-2"
                    >
                      Select Hub
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
