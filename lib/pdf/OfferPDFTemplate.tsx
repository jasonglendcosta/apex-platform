import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
} from '@react-pdf/renderer';
import { Unit, Customer, User, PaymentPlan, PaymentMilestone } from '../../types';

// Register fonts (using system fonts as fallback)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2', fontWeight: 700 },
  ],
});

// One Development brand colors
const colors = {
  primary: '#D86DCB', // Strategy pink
  secondary: '#1a1a2e',
  gold: '#C5A572',
  dark: '#1a1a2e',
  light: '#f8f9fa',
  gray: '#6c757d',
  white: '#ffffff',
  black: '#000000',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    padding: 0,
    backgroundColor: colors.white,
  },
  // Cover Page
  coverPage: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 50,
    justifyContent: 'space-between',
  },
  coverHeader: {
    alignItems: 'flex-start',
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 180,
    height: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 20,
  },
  logoText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 700,
  },
  coverTitle: {
    fontSize: 42,
    fontWeight: 700,
    color: colors.white,
    marginTop: 80,
    lineHeight: 1.2,
  },
  coverSubtitle: {
    fontSize: 18,
    color: colors.primary,
    marginTop: 15,
    fontWeight: 600,
  },
  coverDetails: {
    marginTop: 'auto',
  },
  coverUnit: {
    fontSize: 24,
    color: colors.gold,
    fontWeight: 700,
  },
  coverProject: {
    fontSize: 14,
    color: colors.white,
    marginTop: 8,
    opacity: 0.9,
  },
  coverDate: {
    fontSize: 11,
    color: colors.white,
    marginTop: 30,
    opacity: 0.7,
  },
  // Content Pages
  contentPage: {
    padding: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  headerLogo: {
    width: 120,
    height: 40,
  },
  headerLogoPlaceholder: {
    width: 120,
    height: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  headerLogoText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 700,
  },
  headerInfo: {
    textAlign: 'right',
  },
  offerNumber: {
    fontSize: 10,
    color: colors.gray,
  },
  offerDate: {
    fontSize: 9,
    color: colors.gray,
    marginTop: 2,
  },
  // Section styles
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.dark,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  sectionContent: {
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.dark,
  },
  // Cover Letter
  coverLetter: {
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 4,
    marginBottom: 25,
  },
  greeting: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 15,
    color: colors.dark,
  },
  letterText: {
    fontSize: 10,
    lineHeight: 1.7,
    color: colors.dark,
    textAlign: 'justify',
  },
  signature: {
    marginTop: 20,
    fontSize: 10,
  },
  // Unit Details
  unitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  unitItem: {
    width: '50%',
    flexDirection: 'row',
    marginBottom: 8,
  },
  unitLabel: {
    width: 100,
    fontSize: 9,
    color: colors.gray,
  },
  unitValue: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.dark,
  },
  // Floor Plan
  floorPlanContainer: {
    marginTop: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    alignItems: 'center',
  },
  floorPlanPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  floorPlanText: {
    fontSize: 11,
    color: colors.gray,
  },
  // Pricing Table
  pricingTable: {
    marginTop: 10,
  },
  pricingRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
  },
  pricingRowHighlight: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    marginTop: 5,
  },
  pricingLabel: {
    flex: 1,
    fontSize: 10,
    color: colors.dark,
  },
  pricingValue: {
    width: 120,
    fontSize: 10,
    fontWeight: 600,
    textAlign: 'right',
    color: colors.dark,
  },
  pricingLabelWhite: {
    flex: 1,
    fontSize: 11,
    fontWeight: 600,
    color: colors.white,
    paddingLeft: 10,
  },
  pricingValueWhite: {
    width: 120,
    fontSize: 12,
    fontWeight: 700,
    textAlign: 'right',
    color: colors.white,
    paddingRight: 10,
  },
  discountRow: {
    backgroundColor: '#f0fff0',
  },
  discountLabel: {
    color: '#228b22',
  },
  discountValue: {
    color: '#228b22',
  },
  // Payment Plan
  milestoneTable: {
    marginTop: 10,
  },
  milestoneHeader: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 5,
  },
  milestoneHeaderText: {
    fontSize: 9,
    fontWeight: 600,
    color: colors.white,
  },
  milestoneRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  milestoneRowAlt: {
    backgroundColor: colors.light,
  },
  milestoneText: {
    fontSize: 9,
    color: colors.dark,
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'center' },
  col4: { width: '20%', textAlign: 'right' },
  // Terms
  termsList: {
    marginTop: 10,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  termBullet: {
    width: 15,
    fontSize: 10,
    color: colors.primary,
  },
  termText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.5,
    color: colors.dark,
  },
  // Agent Contact
  agentCard: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    padding: 20,
    borderRadius: 6,
    marginTop: 10,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.white,
    marginBottom: 4,
  },
  agentRole: {
    fontSize: 10,
    color: colors.primary,
    marginBottom: 10,
  },
  agentContact: {
    fontSize: 9,
    color: colors.white,
    marginBottom: 4,
    opacity: 0.9,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 8,
    color: colors.gray,
  },
  pageNumber: {
    fontSize: 8,
    color: colors.gray,
  },
  // Validity Banner
  validityBanner: {
    backgroundColor: colors.gold,
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
    alignItems: 'center',
  },
  validityText: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.dark,
  },
});

interface OfferPDFProps {
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

const formatCurrency = (amount: number): string => {
  return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getBedroomLabel = (bedrooms: number): string => {
  if (bedrooms === 0) return 'Studio';
  if (bedrooms === 1) return '1 Bedroom';
  return `${bedrooms} Bedrooms`;
};

export const OfferPDFTemplate: React.FC<OfferPDFProps> = ({
  offer,
  unit,
  customer,
  agent,
  paymentPlan,
  coverLetter,
}) => {
  const basePrice = unit.current_price;
  const finalPrice = offer.price_quoted;
  const discount = offer.discount_amount || 0;
  const pricePerSqft = Math.round(finalPrice / unit.area_sqft);

  // Generate default cover letter if not provided
  const defaultCoverLetter = `Thank you for your interest in ${unit.project?.name || 'our exclusive development'}. 

We are pleased to present this exclusive offer for Unit ${unit.unit_number}, a stunning ${getBedroomLabel(unit.bedrooms)} residence featuring ${unit.area_sqft.toLocaleString()} sq.ft of premium living space with breathtaking ${unit.view_type} views.

This unit has been carefully selected based on your preferences and represents an exceptional investment opportunity in one of the most sought-after addresses in the UAE.

We have prepared a special pricing package for you, valid until ${formatDate(offer.valid_until)}. Our team is ready to assist you through every step of the acquisition process.`;

  const letter = coverLetter || defaultCoverLetter;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <View style={styles.coverHeader}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>ONE DEVELOPMENT</Text>
            </View>
          </View>

          <View>
            <Text style={styles.coverTitle}>Exclusive{'\n'}Property Offer</Text>
            <Text style={styles.coverSubtitle}>Prepared for {customer.name}</Text>
          </View>

          <View style={styles.coverDetails}>
            <Text style={styles.coverUnit}>Unit {unit.unit_number}</Text>
            <Text style={styles.coverProject}>{unit.project?.name || 'Laguna Residence'} • {unit.project?.location || 'Abu Dhabi'}</Text>
            <Text style={styles.coverDate}>Offer Date: {formatDate(offer.created_at)}</Text>
          </View>
        </View>
      </Page>

      {/* Cover Letter Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <View style={styles.header}>
            <View style={styles.headerLogoPlaceholder}>
              <Text style={styles.headerLogoText}>ONE DEV</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.offerNumber}>Offer #{offer.offer_number}</Text>
              <Text style={styles.offerDate}>{formatDate(offer.created_at)}</Text>
            </View>
          </View>

          <View style={styles.coverLetter}>
            <Text style={styles.greeting}>Dear {customer.name},</Text>
            <Text style={styles.letterText}>{letter}</Text>
            <View style={styles.signature}>
              <Text>Best Regards,</Text>
              <Text style={{ fontWeight: 600, marginTop: 5 }}>{agent.name}</Text>
              <Text style={{ color: colors.gray }}>{agent.role === 'agent' ? 'Sales Consultant' : agent.role}</Text>
            </View>
          </View>

          <View style={styles.validityBanner}>
            <Text style={styles.validityText}>
              ⏰ This offer is valid until {formatDate(offer.valid_until)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>One Development • Confidential Offer Document</Text>
          <Text style={styles.pageNumber}>Page 2</Text>
        </View>
      </Page>

      {/* Unit Details Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <View style={styles.header}>
            <View style={styles.headerLogoPlaceholder}>
              <Text style={styles.headerLogoText}>ONE DEV</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.offerNumber}>Offer #{offer.offer_number}</Text>
              <Text style={styles.offerDate}>{formatDate(offer.created_at)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Overview</Text>
            <Text style={styles.sectionContent}>
              {unit.project?.name || 'Laguna Residence'} represents the pinnacle of luxury living in {unit.project?.location || 'Abu Dhabi'}. 
              This iconic development features world-class amenities, stunning architecture, and an unparalleled lifestyle experience.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Unit Specifications</Text>
            <View style={styles.unitGrid}>
              <View style={styles.unitItem}>
                <Text style={styles.unitLabel}>Unit Number</Text>
                <Text style={styles.unitValue}>{unit.unit_number}</Text>
              </View>
              <View style={styles.unitItem}>
                <Text style={styles.unitLabel}>Floor</Text>
                <Text style={styles.unitValue}>{unit.floor}</Text>
              </View>
              <View style={styles.unitItem}>
                <Text style={styles.unitLabel}>Bedrooms</Text>
                <Text style={styles.unitValue}>{getBedroomLabel(unit.bedrooms)}</Text>
              </View>
              <View style={styles.unitItem}>
                <Text style={styles.unitLabel}>Bathrooms</Text>
                <Text style={styles.unitValue}>{unit.bathrooms}</Text>
              </View>
              <View style={styles.unitItem}>
                <Text style={styles.unitLabel}>Area (Sq.Ft)</Text>
                <Text style={styles.unitValue}>{unit.area_sqft.toLocaleString()}</Text>
              </View>
              <View style={styles.unitItem}>
                <Text style={styles.unitLabel}>Area (Sq.M)</Text>
                <Text style={styles.unitValue}>{unit.area_sqm?.toLocaleString() || Math.round(unit.area_sqft * 0.0929).toLocaleString()}</Text>
              </View>
              <View style={styles.unitItem}>
                <Text style={styles.unitLabel}>View</Text>
                <Text style={styles.unitValue}>{unit.view_type?.charAt(0).toUpperCase() + unit.view_type?.slice(1)} View</Text>
              </View>
              <View style={styles.unitItem}>
                <Text style={styles.unitLabel}>Type</Text>
                <Text style={styles.unitValue}>{unit.unit_type?.toUpperCase()}</Text>
              </View>
              <View style={styles.unitItem}>
                <Text style={styles.unitLabel}>Aspect</Text>
                <Text style={styles.unitValue}>{unit.aspect || 'N/A'}</Text>
              </View>
              <View style={styles.unitItem}>
                <Text style={styles.unitLabel}>Price/Sq.Ft</Text>
                <Text style={styles.unitValue}>{formatCurrency(pricePerSqft)}</Text>
              </View>
            </View>

            <View style={styles.floorPlanContainer}>
              <View style={styles.floorPlanPlaceholder}>
                <Text style={styles.floorPlanText}>Floor Plan</Text>
                <Text style={{ ...styles.floorPlanText, fontSize: 9, marginTop: 5 }}>
                  Unit {unit.unit_number} • {getBedroomLabel(unit.bedrooms)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>One Development • Confidential Offer Document</Text>
          <Text style={styles.pageNumber}>Page 3</Text>
        </View>
      </Page>

      {/* Pricing & Payment Plan Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <View style={styles.header}>
            <View style={styles.headerLogoPlaceholder}>
              <Text style={styles.headerLogoText}>ONE DEV</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.offerNumber}>Offer #{offer.offer_number}</Text>
              <Text style={styles.offerDate}>{formatDate(offer.created_at)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing Details</Text>
            <View style={styles.pricingTable}>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Base Price</Text>
                <Text style={styles.pricingValue}>{formatCurrency(basePrice)}</Text>
              </View>
              {discount > 0 && (
                <View style={[styles.pricingRow, styles.discountRow]}>
                  <Text style={[styles.pricingLabel, styles.discountLabel]}>
                    Discount {offer.discount_reason ? `(${offer.discount_reason})` : ''}
                  </Text>
                  <Text style={[styles.pricingValue, styles.discountValue]}>
                    - {formatCurrency(discount)}
                  </Text>
                </View>
              )}
              <View style={[styles.pricingRow, styles.pricingRowHighlight]}>
                <Text style={styles.pricingLabelWhite}>Total Price</Text>
                <Text style={styles.pricingValueWhite}>{formatCurrency(finalPrice)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Plan: {paymentPlan.name}</Text>
            {paymentPlan.description && (
              <Text style={{ ...styles.sectionContent, marginBottom: 10 }}>{paymentPlan.description}</Text>
            )}
            <View style={styles.milestoneTable}>
              <View style={styles.milestoneHeader}>
                <Text style={[styles.milestoneHeaderText, styles.col1]}>Milestone</Text>
                <Text style={[styles.milestoneHeaderText, styles.col2]}>%</Text>
                <Text style={[styles.milestoneHeaderText, styles.col3]}>Due</Text>
                <Text style={[styles.milestoneHeaderText, styles.col4]}>Amount</Text>
              </View>
              {paymentPlan.milestones.map((milestone, index) => (
                <View
                  key={index}
                  style={[styles.milestoneRow, index % 2 === 1 && styles.milestoneRowAlt]}
                >
                  <Text style={[styles.milestoneText, styles.col1]}>{milestone.name}</Text>
                  <Text style={[styles.milestoneText, styles.col2]}>{milestone.percent}%</Text>
                  <Text style={[styles.milestoneText, styles.col3]}>
                    {milestone.due_days === 0 ? 'On Booking' : `${milestone.due_days} days`}
                  </Text>
                  <Text style={[styles.milestoneText, styles.col4, { fontWeight: 600 }]}>
                    {formatCurrency(Math.round(finalPrice * (milestone.percent / 100)))}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {offer.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <Text style={styles.sectionContent}>{offer.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>One Development • Confidential Offer Document</Text>
          <Text style={styles.pageNumber}>Page 4</Text>
        </View>
      </Page>

      {/* Terms & Contact Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <View style={styles.header}>
            <View style={styles.headerLogoPlaceholder}>
              <Text style={styles.headerLogoText}>ONE DEV</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.offerNumber}>Offer #{offer.offer_number}</Text>
              <Text style={styles.offerDate}>{formatDate(offer.created_at)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <View style={styles.termsList}>
              <View style={styles.termItem}>
                <Text style={styles.termBullet}>•</Text>
                <Text style={styles.termText}>
                  This offer is valid until {formatDate(offer.valid_until)} and subject to availability at the time of booking.
                </Text>
              </View>
              <View style={styles.termItem}>
                <Text style={styles.termBullet}>•</Text>
                <Text style={styles.termText}>
                  Prices are quoted in UAE Dirhams (AED) and include standard finishing as per specification.
                </Text>
              </View>
              <View style={styles.termItem}>
                <Text style={styles.termBullet}>•</Text>
                <Text style={styles.termText}>
                  A booking deposit is required to secure the unit. The deposit is non-refundable unless the sale does not proceed due to circumstances beyond the buyer's control.
                </Text>
              </View>
              <View style={styles.termItem}>
                <Text style={styles.termBullet}>•</Text>
                <Text style={styles.termText}>
                  The Sales & Purchase Agreement (SPA) must be signed within 21 days of booking.
                </Text>
              </View>
              <View style={styles.termItem}>
                <Text style={styles.termBullet}>•</Text>
                <Text style={styles.termText}>
                  All payments must be made as per the agreed payment plan schedule.
                </Text>
              </View>
              <View style={styles.termItem}>
                <Text style={styles.termBullet}>•</Text>
                <Text style={styles.termText}>
                  The developer reserves the right to modify specifications and layouts without prior notice.
                </Text>
              </View>
              <View style={styles.termItem}>
                <Text style={styles.termBullet}>•</Text>
                <Text style={styles.termText}>
                  Handover is subject to project completion and all necessary approvals from relevant authorities.
                </Text>
              </View>
              <View style={styles.termItem}>
                <Text style={styles.termBullet}>•</Text>
                <Text style={styles.termText}>
                  This offer is personal and non-transferable without written consent from the developer.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Sales Consultant</Text>
            <View style={styles.agentCard}>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.agentRole}>Sales Consultant | One Development</Text>
                {agent.phone && (
                  <Text style={styles.agentContact}>📱 {agent.phone}</Text>
                )}
                {agent.email && (
                  <Text style={styles.agentContact}>✉️ {agent.email}</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.validityBanner}>
            <Text style={styles.validityText}>
              Ready to proceed? Contact your sales consultant to book this unit today!
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>One Development • Confidential Offer Document</Text>
          <Text style={styles.pageNumber}>Page 5</Text>
        </View>
      </Page>
    </Document>
  );
};

export default OfferPDFTemplate;
