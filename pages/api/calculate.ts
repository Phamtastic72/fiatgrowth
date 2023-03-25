import type { NextApiRequest, NextApiResponse } from 'next';

export type CalculateParameters = {
  // Actuals
  media_spend: number | null;
  mrr: number | null;

  uniques_month: number | null;
  uniques_max: number | null;
  signup_rate: number | null;
  max_signup_rate: number | null;
  conversion_rate: number | null;
  max_conversion_rate: number | null;
  arpc: number | null;
  max_arpc: number | null;
  churn_rate: number | null;
  max_churn_rate: number | null;
};

export type CalculateResultValues = {
  arpc: number;
  churn_rate: number;
  churn_rate_2: number;
  churned_revenue: number;
  churned_revenue_baseline: number;
  conversion_rate: number;
  conversion_rate_2: number;
  mrr: number;
  mrr_baseline: number;
  mrr_delta: number;
  new_customers: number;
  new_customers_baseline: number;
  new_mrr: number;
  new_mrr_baseline: number;
  new_trials: number;
  new_trials_baseline: number;
  signup_rate: number;
  signup_rate_2: number;
  traffic: number;
  traffic_baseline: number;
  ltv: number;
  cac: number;
  cac_baseline: number;
  ltv_cac: number;
  ltv_cac_baseline: number;
};

export type CalculateRawResults = {
  groups: {
    from: number;
    is_partial: boolean;
    title: string;
    to: number;
  }[];
  results: { group: string; values: CalculateResultValues }[];
};

export type CalculateOutput = {
  ltv: {
    from: number;
    to: number;
  };
  cac: {
    from: number;
    to: number;
  };
  ltv_cac: {
    group: string;
    baseline: number;
    target: number;
  }[];
  mrr: {
    group: string;
    baseline: number;
    target: number;
  }[];
  acquisition: {
    group: string;
    trials: number;
    customers: number;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalculateOutput>
) {
  const parameters = {
    ...req.body,
  };

  if (!process.env.SUMMIT_API_URL || !process.env.SUMMIT_API_KEY) {
    res.status(500);
    return;
  }

  const simulation: CalculateRawResults = await fetch(
    process.env.SUMMIT_API_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.SUMMIT_API_KEY,
      },
      body: JSON.stringify({ parameters }),
    }
  ).then((res) => res.json());

  const { results } = simulation;

  const response = {
    ltv: {
      from: results[0].values.ltv,
      to: results[results.length - 1].values.ltv,
    },
    cac: {
      from: results[0].values.cac,
      to: results[results.length - 1].values.cac,
    },
    ltv_cac: results.map(({ group, values }) => ({
      group,
      baseline: values.ltv_cac_baseline,
      target: values.ltv_cac,
    })),
    mrr: results.map(({ group, values }) => ({
      group,
      baseline: values.mrr_baseline,
      target: values.mrr,
    })),
    acquisition: results.map(({ group, values }) => ({
      group,
      trials: values.new_trials,
      customers: values.new_customers,
    })),
  };

  return res.status(200).json(response);
}
