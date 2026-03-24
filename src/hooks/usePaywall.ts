import { usePaywallStore } from "@/stores/paywallStore";

export function usePaywall() {
  const isOpen = usePaywallStore((s) => s.isOpen);
  const params = usePaywallStore((s) => s.params);
  const open = usePaywallStore((s) => s.open);
  const close = usePaywallStore((s) => s.close);

  return { isOpen, params, open, close };
}
