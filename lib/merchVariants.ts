export type MerchVariantKey = "ascend" | "pulse" | "ignite";

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
    key: "ascend",
    title: "Aakar Ascend",
    tag: "CORE DROP",
    price: 399,
    modelUrl: "/model/aakarnew1.glb",
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
    modelUrl: "/model/aakarnew2.glb",
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
    modelUrl: "/model/aakarnew3.glb",
    description:
      "Subtle composition with bold cultural influence, blending Japanese wave motion with sharp contrast elements for a refined streetwear presence.",
    features: [
      "Iconic wave graphic focus",
      "Balanced minimal + detailed layout",
      "Floral accent integration",
      "Limited edition street drop",
    ],
  },
];

export const defaultMerchVariantKey: MerchVariantKey = "ascend";

export const getMerchVariant = (key: string | null | undefined): MerchVariant => {
  const found = merchVariants.find((variant) => variant.key === key);
  return found ?? merchVariants[0];
};
