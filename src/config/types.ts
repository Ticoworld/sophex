// Define types for the NFT items
export type NFTItem = {
  id: number;
  name: string;
  utility: string;
  rarity: "Common" | "Rare" | "Legendary";
};

// Define types for the workflow steps
export type WorkflowStep = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

// Define types for the value propositions
export type ValueProp = {
  title: string;
  description: string;
  icon: string;
};