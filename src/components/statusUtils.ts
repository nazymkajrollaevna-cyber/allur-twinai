import type { StationStatus } from '@/types';

export function statusColor(status: StationStatus): string {
  switch (status) {
    case 'NORMAL':
      return 'text-emerald-400';
    case 'WARNING':
      return 'text-yellow-400';
    case 'CRITICAL':
      return 'text-red-400';
  }
}

export function statusBg(status: StationStatus): string {
  switch (status) {
    case 'NORMAL':
      return 'bg-emerald-500/15 border-emerald-500/30';
    case 'WARNING':
      return 'bg-yellow-500/15 border-yellow-500/30';
    case 'CRITICAL':
      return 'bg-red-500/15 border-red-500/30';
  }
}

export function statusGlow(status: StationStatus): string {
  switch (status) {
    case 'NORMAL':
      return 'glow-green';
    case 'WARNING':
      return 'glow-yellow';
    case 'CRITICAL':
      return 'glow-red';
  }
}

export function statusDot(status: StationStatus): string {
  switch (status) {
    case 'NORMAL':
      return 'bg-emerald-400';
    case 'WARNING':
      return 'bg-yellow-400';
    case 'CRITICAL':
      return 'bg-red-400';
  }
}

export function statusLabel(status: StationStatus): string {
  return status;
}

export function equipmentStatusColor(
  status: 'Warning' | 'Critical' | 'Maintenance',
): string {
  switch (status) {
    case 'Warning':
      return 'text-yellow-400';
    case 'Critical':
      return 'text-red-400';
    case 'Maintenance':
      return 'text-blue-400';
  }
}

export function equipmentStatusBg(
  status: 'Warning' | 'Critical' | 'Maintenance',
): string {
  switch (status) {
    case 'Warning':
      return 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400';
    case 'Critical':
      return 'bg-red-500/15 border-red-500/30 text-red-400';
    case 'Maintenance':
      return 'bg-blue-500/15 border-blue-500/30 text-blue-400';
  }
}
