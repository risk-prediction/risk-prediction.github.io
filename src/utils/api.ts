import { CreditRiskRequest, CreditRiskResponse } from '@/types/api';

const API_URL = 'https://home-credit-api-production.up.railway.app/predict';

export async function predictCreditRisk(request: CreditRiskRequest): Promise<CreditRiskResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling credit risk API:', error);
    throw error;
  }
}