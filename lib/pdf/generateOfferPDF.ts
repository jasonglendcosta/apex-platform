import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { OfferPDFTemplate } from './OfferPDFTemplate';
import { Unit, Customer, User, PaymentPlan } from '../../types';

interface GeneratePDFOptions {
  offer: {
    offer_number: string;
    price_quoted: number;
    discount_amount: number;
    discount_reason?: string;
    valid_until: string;
    notes?: string;
    created_at: string;
  };
  unit: Unit;
  customer: Customer;
  agent: User;
  paymentPlan: PaymentPlan;
  coverLetter?: string;
}

/**
 * Generate a PDF buffer for the offer
 */
export async function generateOfferPDF(options: GeneratePDFOptions): Promise<Buffer> {
  const element = React.createElement(OfferPDFTemplate, options);
  const buffer = await renderToBuffer(element);
  return buffer;
}

/**
 * Generate offer number in format: OFF-YYYYMMDD-XXXX
 */
export function generateOfferNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `OFF-${year}${month}${day}-${random}`;
}

/**
 * Calculate valid until date based on days from now
 */
export function calculateValidUntil(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

/**
 * Get default payment plans
 */
export function getDefaultPaymentPlans(): PaymentPlan[] {
  return [
    {
      id: 'pp-standard-60-40',
      org_id: 'default',
      name: '60/40 Payment Plan',
      description: '60% during construction, 40% on handover',
      milestones: [
        { name: 'Booking Deposit', percent: 10, due_days: 0 },
        { name: '1st Installment', percent: 10, due_days: 30 },
        { name: '2nd Installment', percent: 10, due_days: 90 },
        { name: '3rd Installment', percent: 10, due_days: 180 },
        { name: '4th Installment', percent: 10, due_days: 270 },
        { name: '5th Installment', percent: 10, due_days: 360 },
        { name: 'On Handover', percent: 40, due_days: 720 },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 'pp-standard-80-20',
      org_id: 'default',
      name: '80/20 Payment Plan',
      description: '80% during construction, 20% on handover',
      milestones: [
        { name: 'Booking Deposit', percent: 10, due_days: 0 },
        { name: '1st Installment', percent: 10, due_days: 30 },
        { name: '2nd Installment', percent: 15, due_days: 90 },
        { name: '3rd Installment', percent: 15, due_days: 180 },
        { name: '4th Installment', percent: 15, due_days: 270 },
        { name: '5th Installment', percent: 15, due_days: 360 },
        { name: 'On Handover', percent: 20, due_days: 720 },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 'pp-post-handover',
      org_id: 'default',
      name: 'Post-Handover Plan',
      description: '50% construction, 50% post-handover over 3 years',
      milestones: [
        { name: 'Booking Deposit', percent: 10, due_days: 0 },
        { name: '1st Installment', percent: 10, due_days: 90 },
        { name: '2nd Installment', percent: 10, due_days: 180 },
        { name: '3rd Installment', percent: 10, due_days: 360 },
        { name: 'On Handover', percent: 10, due_days: 540 },
        { name: 'Post-Handover 1', percent: 10, due_days: 720 },
        { name: 'Post-Handover 2', percent: 10, due_days: 900 },
        { name: 'Post-Handover 3', percent: 10, due_days: 1080 },
        { name: 'Post-Handover 4', percent: 10, due_days: 1260 },
        { name: 'Final Payment', percent: 10, due_days: 1440 },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 'pp-cash',
      org_id: 'default',
      name: 'Cash Payment',
      description: 'Full payment within 30 days',
      milestones: [
        { name: 'Booking Deposit', percent: 10, due_days: 0 },
        { name: 'Balance Payment', percent: 90, due_days: 30 },
      ],
      created_at: new Date().toISOString(),
    },
  ];
}

export default generateOfferPDF;
