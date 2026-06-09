/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ConnectionType = 'domestic' | 'commercial' | 'industrial' | 'agricultural';

export interface Consumer {
  id: string; // e.g., "CON-1001"
  name: string;
  email: string;
  phone: string;
  meterNo: string; // e.g., "MTR-88219"
  address: string;
  connectionType: ConnectionType;
  dateJoined: string;
}

export interface Bill {
  id: string; // e.g., "BILL-5001"
  consumerId: string;
  consumerName: string;
  connectionType: ConnectionType;
  billingMonth: string; // e.g., "June 2026"
  prevReading: number;
  currReading: number;
  unitsConsumed: number;
  slabAmount: number;
  fixedCharges: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface TariffSlab {
  minUnits: number;
  maxUnits: number; // Use Infinity for the top slab
  rate: number;
}

export interface TariffConfig {
  connectionType: ConnectionType;
  baseCharge: number;
  taxPercentage: number;
  slabs: TariffSlab[];
}

export interface JavaFile {
  name: string;
  code: string;
  description: string;
}
