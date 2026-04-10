<<<<<<< HEAD
export type MerchVariantKey = "classic" | "neon" | "pro";
=======
export type MerchVariantKey = "ascend" | "pulse" | "ignite";
>>>>>>> 562d52c3afe782ac9535b717e31449da5f4f3352

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
<<<<<<< HEAD
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
=======
    key: "ascend",
    title: "Aakar Ascend",
    tag: "CORE DROP",
    price: 399,
    modelUrl: "/model/aakarmodel1.glb",
    description:
      "A unified visual bringing together multiple anime identities into one powerful composition, designed to represent diversity, strength, and character-driven expression",
    features: [
      "Multi-character anime collage",
      "Monochrome high-contrast finish",
      "Balanced vertical identity layout",
      "Universe-inspired concept design",
    ],
  },
  {
    key: "pulse",
    title: "Aakar Pulse",
    tag: "NIGHT EDIT",
    price: 399,
    modelUrl: "/model/aakarmodel2.glb",
    description:
      "A high-impact composition driven by anime intensity and sharp visual contrast, built for bold presence and statement-driven styling.",
    features: [
      "Multi-panel anime graphic layout",
      "High contrast black & red theme",
      "Vertical identity typography",
      "Designed for bold street expression",
    ],
  },
  {
    key: "ignite",
    title: "Aakar Ignite",
    tag: "LIMITED CUT",
    price: 399,
    modelUrl: "/model/aakarmodel3.glb",
    description:
      "Subtle composition with bold cultural influence, blending Japanese wave motion with sharp contrast elements for a refined streetwear presence.",
    features: [
      "Iconic wave graphic focus",
      "Balanced minimal + detailed layout",
      "Floral accent integration",
      "Limited edition street drop",
>>>>>>> 562d52c3afe782ac9535b717e31449da5f4f3352
    ],
  },
];

<<<<<<< HEAD
export const defaultMerchVariantKey: MerchVariantKey = "classic";
=======
export const defaultMerchVariantKey: MerchVariantKey = "ascend";
>>>>>>> 562d52c3afe782ac9535b717e31449da5f4f3352

export const getMerchVariant = (key: string | null | undefined): MerchVariant => {
  const found = merchVariants.find((variant) => variant.key === key);
  return found ?? merchVariants[0];
};
