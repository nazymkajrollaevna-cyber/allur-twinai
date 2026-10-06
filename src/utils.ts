import {
  DATES,
  DEFECT_NORM,
  PRODUCTION_DATA,
  QUALITY_DATA,
  EQUIPMENT,
  DOWNTIME_LIMIT,
} from './data';
import type { AIResult, DateKey, StationStatus } from './types';

export function qualityStatus(rate: number): StationStatus {
  if (rate <= DEFECT_NORM) return 'NORMAL';
  if (rate <= DEFECT_NORM * 2) return 'WARNING';
  return 'CRITICAL';
}

export function qualityLabel(rate: number): string {
  const s = qualityStatus(rate);
  if (s === 'NORMAL') return 'В норме';
  if (s === 'WARNING') return 'Внимание';
  return 'Критично';
}

export interface DashboardKPI {
  plan: number;
  fact: number;
  fulfillment: number;
  avgUtilization: number;
  activeDeviations: number;
  criticalRisks: number;
}

export function calcKPI(date: DateKey): DashboardKPI {
  const prod = PRODUCTION_DATA[date];
  const quality = QUALITY_DATA[date];
  const plan = prod.reduce((s, l) => s + l.plan, 0);
  const fact = prod.reduce((s, l) => s + l.fact, 0);
  const avgUtilization = Math.round(
    prod.reduce((s, l) => s + l.utilization, 0) / prod.length * 10,
  ) / 10;

  const activeDeviations = quality.filter(
    (q) => q.defectRate > DEFECT_NORM,
  ).length + EQUIPMENT.filter((e) => e.status === 'Critical' || e.status === 'Warning').length;

  const criticalRisks = quality.filter(
    (q) => q.defectRate > DEFECT_NORM * 2,
  ).length + EQUIPMENT.filter((e) => e.status === 'Critical').length;

  return {
    plan,
    fact,
    fulfillment: Math.round((fact / plan) * 1000) / 10,
    avgUtilization,
    activeDeviations,
    criticalRisks,
  };
}

export function totalDowntime(): number {
  return EQUIPMENT.reduce((s, e) => s + e.downtime, 0);
}

export function downtimeProgress(item: { downtime: number }): number {
  return Math.min(100, Math.round((item.downtime / DOWNTIME_LIMIT) * 100));
}

export function runAIAnalysis(date: DateKey): AIResult[] {
  const quality = QUALITY_DATA[date];
  const prevDate = DATES.find((d) => d !== date);
  const prevQuality = prevDate ? QUALITY_DATA[prevDate] : null;

  const results: AIResult[] = [];

  const painting = quality.find((q) => q.station === 'Окраска');
  const prevPainting = prevQuality?.find((q) => q.station === 'Окраска');
  if (painting && painting.defectRate > DEFECT_NORM) {
    results.push({
      id: 1,
      level: 'КРИТИЧЕСКИЙ РИСК',
      station: 'Окраска',
      indicator: 'Показатель брака',
      value: `${painting.defectRate.toFixed(1)}%`,
      norm: '≤2%',
      dynamic: prevPainting
        ? `${prevPainting.defectRate.toFixed(1)}% → ${painting.defectRate.toFixed(1)}%`
        : undefined,
      reason:
        'рост доли брака и значительное превышение допустимого порога.',
      recommendation:
        'провести внеплановую проверку параметров процесса окраски и состояния оборудования.',
    });
  }

  const welding = quality.find((q) => q.station === 'Сварка');
  if (welding && welding.defectRate > DEFECT_NORM) {
    results.push({
      id: 2,
      level: 'ПОВЫШЕННЫЙ РИСК',
      station: 'Сварка',
      indicator: 'Брак',
      value: `${welding.defectRate.toFixed(1)}%`,
      norm: '≤2%',
      reason:
        'превышение нормативного порога брака на участке сварки.',
      recommendation:
        'проверить причины снижения качества и сопоставить их с событиями оборудования.',
    });
  }

  const conv = EQUIPMENT.find((e) => e.id === 'Конвейер-03');
  if (conv) {
    results.push({
      id: 3,
      level: 'РИСК ПРОСТОЯ',
      station: 'Конвейер-03',
      indicator: 'Простой',
      value: `${conv.downtime} минут`,
      norm: '≤60 минут',
      reason:
        'простой приближается к критическому лимиту в 60 минут.',
      recommendation:
        'приоритизировать диагностику конвейера и исключить повторный простой в текущей смене.',
    });
  }

  return results;
}

export function defectExceedsNorm(date: DateKey): { station: string; rate: number; exceedRatio: number } | null {
  const painting = QUALITY_DATA[date].find((q) => q.station === 'Окраска');
  if (painting && painting.defectRate > DEFECT_NORM) {
    return {
      station: painting.station,
      rate: painting.defectRate,
      exceedRatio: Math.round((painting.defectRate / DEFECT_NORM) * 10) / 10,
    };
  }
  return null;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU');
}
