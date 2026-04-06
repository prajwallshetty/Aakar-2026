export type MerchVariantKey = "classic" | "neon" | "pro";

export interface MerchVariant {
  key: MerchVariantKey;
  title: string;
  tag: string;
  price: number;
  modelUrl: string;
  description: string;
  features: string[];
}

export const merchVariants: MerchVariant[] = [
  {
    key: "classic",
    title: "AAKAR CLASSIC",
    tag: "CORE DROP",
    price: 499,
    modelUrl: "/model/aakarmodel1.glb",
    description:
      "The original fest tee with clean front branding and everyday comfort. Built for full-day campus wear.",
    features: [
      "Minimal front logo layout",
      "Balanced regular fit",
      "Breathable cotton blend",
      "Best for daily fest use",
    ],
  },
  {
    key: "neon",
    title: "AAKAR NEON STRIKE",
    tag: "NIGHT EDIT",
    price: 549,
    modelUrl: "/model/aakarmodel2.glb",
    description:
      "High-contrast neon graphics with bolder placement for evening events and stage-heavy moments.",
    features: [
      "Neon themed print style",
      "High visibility event look",
      "Soft-touch interior finish",
      "Designed for night events",
    ],
  },
  {
    key: "pro",
    title: "AAKAR PRO GRID",
    tag: "LIMITED CUT",
    price: 599,
    modelUrl: "/model/aakarmodel3.glb",
    description:
      "Premium variant with denser fabric feel and sharper graphic blocks for a collector-grade look.",
    features: [
      "Premium dense knit feel",
      "Structured silhouette",
      "Sharper multi-panel print",
      "Limited run variant",
    ],
  },
];

export const defaultMerchVariantKey: MerchVariantKey = "classic";

export const getMerchVariant = (key: string | null | undefined): MerchVariant => {
  const found = merchVariants.find((variant) => variant.key === key);
  return found ?? merchVariants[0];
};
