import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EULA_URL, MANAGE_SUBSCRIPTIONS_URL, PRIVACY_URL, PRODUCT_IDS, TERMS_URL, type ProductId } from './products';
import { useIapContext } from './IapProvider';

type Props = {
  visible: boolean;
  onClose: () => void;
  openLink: (url: string) => void;
  accent: string;
  colors: { bg: string; card: string; text: string; sub: string; border: string };
};

const PLANS: { id: ProductId; name: string; length: string; detail: (price: string) => string }[] = [
  {
    id: PRODUCT_IDS.monthly,
    name: 'Monthly',
    length: '1 month',
    detail: (price) => `7-day free trial, then ${price} billed every month`,
  },
  {
    id: PRODUCT_IDS.yearly,
    name: 'Yearly',
    length: '1 year',
    detail: (price) => `7-day free trial, then ${price} billed every year`,
  },
  {
    id: PRODUCT_IDS.lifetime,
    name: 'Lifetime',
    length: 'Does not renew',
    detail: (price) => `${price} once. No trial and no renewal.`,
  },
];

export function Paywall({ visible, onClose, openLink, accent, colors }: Props) {
  const iap = useIapContext();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScrollView testID="paywall-screen" style={[styles.wrap, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <Text style={[styles.title, { color: colors.text }]}>Unlock Pro</Text>
          <TouchableOpacity testID="paywall-close" onPress={onClose} style={styles.closeBtn}>
            <Text style={[styles.closeText, { color: colors.sub }]}>Close</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.lead, { color: colors.sub }]}>
          Days 1 to 7 are free. Pro unlocks days 8 to 45 of the plan, including later workouts and recovery days.
        </Text>

        {PLANS.map((plan) => {
          const selected = iap.selectedId === plan.id;
          const price = iap.priceLabel(plan.id);
          return (
            <Pressable
              key={plan.id}
              testID={`paywall-${plan.id === PRODUCT_IDS.monthly ? 'monthly' : plan.id === PRODUCT_IDS.yearly ? 'yearly' : 'lifetime'}`}
              onPress={() => iap.setSelectedId(plan.id)}
              style={[
                styles.plan,
                { backgroundColor: colors.card, borderColor: selected ? accent : colors.border },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
                <Text style={[styles.planLength, { color: colors.text }]}>{plan.length}</Text>
                <Text style={[styles.planDetail, { color: colors.sub }]}>{plan.detail(price)}</Text>
              </View>
              <Text style={[styles.planPrice, { color: accent }]}>{price}</Text>
            </Pressable>
          );
        })}

        <Text style={[styles.legal, { color: colors.sub }]}>
          Monthly is $2.99 every month after a 7-day free trial. Yearly is $19.99 every year after a 7-day free trial.
          Lifetime is $39.99 once, with no trial. A subscription renews automatically unless you cancel at least 24 hours
          before the trial or the current period ends. Payment is charged to your Apple Account when you confirm the
          purchase. The account is charged for renewal within 24 hours before the period ends.
        </Text>

        <View style={styles.links}>
          <TouchableOpacity testID="paywall-terms" onPress={() => openLink(TERMS_URL)}>
            <Text style={[styles.link, { color: accent }]}>Terms of Use</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.sub }}>  |  </Text>
          <TouchableOpacity testID="paywall-eula" onPress={() => openLink(EULA_URL)}>
            <Text style={[styles.link, { color: accent }]}>Apple EULA</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.sub }}>  |  </Text>
          <TouchableOpacity testID="paywall-privacy" onPress={() => openLink(PRIVACY_URL)}>
            <Text style={[styles.link, { color: accent }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          testID="paywall-subscribe"
          onPress={() => void iap.buy()}
          disabled={iap.busy}
          style={[styles.cta, { backgroundColor: accent, opacity: iap.busy ? 0.6 : 1 }]}
        >
          <Text style={styles.ctaText}>{iap.busy ? 'Please wait' : 'Continue'}</Text>
        </TouchableOpacity>

        <TouchableOpacity testID="paywall-restore" onPress={() => void iap.restore()} disabled={iap.busy}>
          <Text style={[styles.restore, { color: accent }]}>Restore Purchases</Text>
        </TouchableOpacity>

        <TouchableOpacity testID="paywall-manage" onPress={() => openLink(MANAGE_SUBSCRIPTIONS_URL)}>
          <Text style={[styles.restore, { color: accent }]}>Manage Subscriptions</Text>
        </TouchableOpacity>

        {iap.message ? <Text style={[styles.message, { color: colors.text }]}>{iap.message}</Text> : null}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { flex: 1, fontSize: 26, fontWeight: '800' },
  closeBtn: { padding: 8 },
  closeText: { fontSize: 16, fontWeight: '600' },
  lead: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  plan: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 14, padding: 14, marginBottom: 10 },
  planName: { fontSize: 17, fontWeight: '700' },
  planLength: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  planDetail: { fontSize: 13, marginTop: 4 },
  planPrice: { fontSize: 22, fontWeight: '800', marginLeft: 12 },
  cta: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  restore: { textAlign: 'center', fontSize: 16, fontWeight: '600', marginTop: 14, marginBottom: 8 },
  message: { textAlign: 'center', fontSize: 13, marginBottom: 8 },
  legal: { fontSize: 11, lineHeight: 16, marginTop: 8 },
  links: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16, alignItems: 'center' },
  link: { fontSize: 14, fontWeight: '600' },
});
