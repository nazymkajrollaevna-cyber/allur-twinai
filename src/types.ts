export type StationId =
  | 'warehouse-in'
  | 'welding'
  | 'painting'
  | 'assembly'
  | 'quality'
  | 'warehouse-out';

export type StationStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

export type DateKey = '01.10.2026' | '02.10.2026';

export interface ProductionLine {
  name: string;
  plan: number;
  fact: number;
  workHours: number;
  utilization: number;
}

export interface QualityData {
  station: string;
  produced: number;
  defects: number;
  defectRate: number;
}

export interface EquipmentItem {
  id: string;
  station: string;
  cause: string;
  downtime: number;
  status: 'Warning' | 'Critical' | 'Maintenance';
}

export interface FactoryStation {
  id: StationId;
  name: string;
  shortName: string;
  status: StationStatus;
  description: string;
  metrics: { label: string; value: string }[];
}

export interface AIResult {
  id: number;
  level: 'КРИТИЧЕСКИЙ РИСК' | 'ПОВЫШЕННЫЙ РИСК' | 'РИСК ПРОСТОЯ';
  station: string;
  indicator: string;
  value: string;
  norm: string;
  dynamic?: string;
  reason: string;
  recommendation: string;
}

export interface CarModel {
  name: string;
  planPerMonth: number;
}

export type ViewId =
  | 'home'
  | 'production'
  | 'equipment'
  | 'analytics'
  | 'incidents'
  | 'ai-center'
  | 'business'
  | 'architecture';
