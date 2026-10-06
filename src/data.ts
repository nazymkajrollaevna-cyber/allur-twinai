import type {
  DateKey,
  EquipmentItem,
  FactoryStation,
  ProductionLine,
  QualityData,
  CarModel,
} from './types';

export const DATES: DateKey[] = ['01.10.2026', '02.10.2026'];

export const PRODUCTION_DATA: Record<DateKey, ProductionLine[]> = {
  '01.10.2026': [
    { name: 'Сварка-1', plan: 120, fact: 118, workHours: 7.8, utilization: 98 },
    { name: 'Окраска-1', plan: 120, fact: 115, workHours: 7.5, utilization: 94 },
    { name: 'Сборка-1', plan: 120, fact: 121, workHours: 8.0, utilization: 100 },
  ],
  '02.10.2026': [
    { name: 'Сварка-1', plan: 120, fact: 111, workHours: 7.2, utilization: 91 },
    { name: 'Окраска-1', plan: 120, fact: 116, workHours: 7.7, utilization: 96 },
    { name: 'Сборка-1', plan: 120, fact: 119, workHours: 7.9, utilization: 99 },
  ],
};

export const QUALITY_DATA: Record<DateKey, QualityData[]> = {
  '01.10.2026': [
    { station: 'Сварка', produced: 118, defects: 2, defectRate: 1.7 },
    { station: 'Окраска', produced: 115, defects: 4, defectRate: 3.5 },
    { station: 'Сборка', produced: 121, defects: 1, defectRate: 0.8 },
  ],
  '02.10.2026': [
    { station: 'Сварка', produced: 111, defects: 3, defectRate: 2.7 },
    { station: 'Окраска', produced: 116, defects: 6, defectRate: 5.2 },
    { station: 'Сборка', produced: 119, defects: 2, defectRate: 1.7 },
  ],
};

export const EQUIPMENT: EquipmentItem[] = [
  { id: 'ABB-01', station: 'Сварка', cause: 'Ошибка датчика', downtime: 25, status: 'Warning' },
  { id: 'Камера-02', station: 'Окраска', cause: 'Замена фильтра', downtime: 40, status: 'Warning' },
  { id: 'Конвейер-03', station: 'Сборка', cause: 'Обрыв цепи', downtime: 55, status: 'Critical' },
  { id: 'ABB-04', station: 'Сварка', cause: 'Плановое ТО', downtime: 30, status: 'Maintenance' },
];

export const STATIONS: FactoryStation[] = [
  {
    id: 'warehouse-in',
    name: 'Склад комплектующих',
    shortName: 'Склад',
    status: 'NORMAL',
    description: 'Комплектующие и материалы поступают на производственную линию.',
    metrics: [
      { label: 'Номенклатура', value: '1 240 позиций' },
      { label: 'Резерв', value: '12 дней' },
      { label: 'Статус', value: 'В норме' },
    ],
  },
  {
    id: 'welding',
    name: 'Сварка',
    shortName: 'Сварка',
    status: 'WARNING',
    description: 'Роботизированная сварка кузовных элементов.',
    metrics: [
      { label: 'Роботов', value: '8' },
      { label: 'Брак', value: '2,7%' },
      { label: 'Простой', value: '25 мин' },
    ],
  },
  {
    id: 'painting',
    name: 'Окраска',
    shortName: 'Окраска',
    status: 'CRITICAL',
    description: 'Катфорезная и грунт-покраска кузова.',
    metrics: [
      { label: 'Брак', value: '5,2%' },
      { label: 'Норма', value: '≤2%' },
      { label: 'Простой', value: '40 мин' },
    ],
  },
  {
    id: 'assembly',
    name: 'Сборка',
    shortName: 'Сборка',
    status: 'WARNING',
    description: 'Финальная сборка агрегатов и узлов.',
    metrics: [
      { label: 'Загрузка', value: '99%' },
      { label: 'Брак', value: '1,7%' },
      { label: 'Простой', value: '55 мин' },
    ],
  },
  {
    id: 'quality',
    name: 'Контроль качества',
    shortName: 'Качество',
    status: 'NORMAL',
    description: 'Входной и выходной контроль параметров.',
    metrics: [
      { label: 'Точек контроля', value: '14' },
      { label: 'Проход', value: '98,2%' },
      { label: 'Статус', value: 'В норме' },
    ],
  },
  {
    id: 'warehouse-out',
    name: 'Склад готовой продукции',
    shortName: 'Гот. склад',
    status: 'NORMAL',
    description: 'Отгрузка готовых автомобилей заказчикам.',
    metrics: [
      { label: 'В наличии', value: '89 авто' },
      { label: 'К отгрузке', value: '34 авто' },
      { label: 'Статус', value: 'В норме' },
    ],
  },
];

export const CAR_MODELS: CarModel[] = [
  { name: 'Chevrolet Onix', planPerMonth: 2500 },
  { name: 'Chevrolet Cobalt', planPerMonth: 1800 },
  { name: 'JAC J7', planPerMonth: 500 },
];

export const MONTHLY_TARGET = 5500;
export const DEFECT_NORM = 2;
export const DOWNTIME_LIMIT = 60;
