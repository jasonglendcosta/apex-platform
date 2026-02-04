'use client';

import { useState, useEffect, useCallback } from 'react';
import { Offer, OfferFormData, OfferStatus, GenerateOfferResponse } from '../types';

interface UseOffersOptions {
  initialOffers?: Offer[];
  autoFetch?: boolean;
}

interface UseOffersReturn {
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
  fetchOffers: () => Promise<void>;
  generateOffer: (data: OfferFormData & { agent_id: string }) => Promise<GenerateOfferResponse>;
  updateStatus: (offerId: string, status: OfferStatus) => Promise<void>;
  downloadPdf: (offer: Offer) => void;
  copyLink: (offer: Offer) => void;
}

export function useOffers(options: UseOffersOptions = {}): UseOffersReturn {
  const { initialOffers = [], autoFetch = true } = options;
  
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/offers/generate');
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      const data = await response.json();
      setOffers(data.offers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateOffer = useCallback(async (
    data: OfferFormData & { agent_id: string }
  ): Promise<GenerateOfferResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/offers/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unit_id: data.unit_id,
          customer_id: data.customer_id,
          price: data.price,
          discount_amount: data.discount_amount,
          discount_reason: data.discount_reason,
          payment_plan_id: data.payment_plan_id,
          valid_days: data.valid_days,
          notes: data.notes,
          agent_id: data.agent_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate offer');
      }

      const result = await response.json();
      
      // Add to local state
      if (result.offer) {
        setOffers((prev) => [result.offer, ...prev]);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (offerId: string, status: OfferStatus) => {
    try {
      const response = await fetch(`/api/offers/${offerId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === offerId ? { ...offer, status } : offer
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  const downloadPdf = useCallback((offer: Offer) => {
    if (offer.pdf_url) {
      // If it's a data URL, create a download link
      if (offer.pdf_url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = offer.pdf_url;
        link.download = `Offer-${offer.offer_number}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For remote URLs, open in new tab or fetch and download
        window.open(offer.pdf_url, '_blank');
      }
    }
  }, []);

  const copyLink = useCallback((offer: Offer) => {
    const link = `${window.location.origin}/offers/view/${offer.id}`;
    navigator.clipboard.writeText(link);
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && initialOffers.length === 0) {
      fetchOffers();
    }
  }, [autoFetch, fetchOffers, initialOffers.length]);

  return {
    offers,
    isLoading,
    error,
    fetchOffers,
    generateOffer,
    updateStatus,
    downloadPdf,
    copyLink,
  };
}

export default useOffers;
