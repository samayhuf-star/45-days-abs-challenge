import AsyncStorage from '@react-native-async-storage/async-storage';

import { ALL_PRODUCT_IDS, type ProductId } from './products';

const KEY = '@abs_challenge_entitlement_v1';

export type Entitlement = {
  isPro: boolean;
  productId: ProductId | null;
  updatedAt: number;
};

const EMPTY: Entitlement = { isPro: false, productId: null, updatedAt: 0 };

export async function loadEntitlement(): Promise<Entitlement> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) {
    return EMPTY;
  }
  try {
    const parsed = JSON.parse(raw) as Entitlement;
    if (typeof parsed.isPro !== 'boolean') {
      return EMPTY;
    }
    return {
      isPro: parsed.isPro,
      productId: isKnownProductId(parsed.productId) ? parsed.productId : null,
      updatedAt: parsed.updatedAt ?? 0,
    };
  } catch {
    return EMPTY;
  }
}

export async function saveEntitlement(
  next: Omit<Entitlement, 'updatedAt'>
): Promise<Entitlement> {
  const value: Entitlement = { ...next, updatedAt: Date.now() };
  await AsyncStorage.setItem(KEY, JSON.stringify(value));
  return value;
}

export async function clearEntitlement(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

export function isKnownProductId(id: string | null | undefined): id is ProductId {
  return !!id && (ALL_PRODUCT_IDS as string[]).includes(id);
}
