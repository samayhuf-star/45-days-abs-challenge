export const PRODUCT_IDS = {
  monthly: 'com.momentum.abs45.monthly',
  yearly: 'com.momentum.abs45.yearly',
  lifetime: 'com.momentum.abs45.lifetime',
} as const;

export type ProductId = (typeof PRODUCT_IDS)[keyof typeof PRODUCT_IDS];

export const SUBSCRIPTION_IDS: ProductId[] = [PRODUCT_IDS.monthly, PRODUCT_IDS.yearly];
export const ALL_PRODUCT_IDS: ProductId[] = [
  PRODUCT_IDS.monthly,
  PRODUCT_IDS.yearly,
  PRODUCT_IDS.lifetime,
];

export const FALLBACK_PRICES: Record<ProductId, string> = {
  [PRODUCT_IDS.monthly]: '$2.99',
  [PRODUCT_IDS.yearly]: '$19.99',
  [PRODUCT_IDS.lifetime]: '$39.99',
};

export const PRIVACY_URL = 'https://samayhuf-star.github.io/45-days-abs-challenge/privacy/';
export const TERMS_URL = 'https://samayhuf-star.github.io/45-days-abs-challenge/terms/';
export const EULA_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
export const SUPPORT_URL = 'https://samayhuf-star.github.io/45-days-abs-challenge/support/';
export const MANAGE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';
