export type Client = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  appUrl: string;
  logoUrl?: string;
  active: boolean;
};

export const initialClients: Client[] = [
  {
    id: "1",
    name: "Swahili Beach",
    slug: "swahili-beach",
    appUrl: "https://swahili-beach-tank-calculator.vercel.app/",
    description: "Tank Mass Calculator for Swahili Beach (LPG storage)",
    active: true,
  },
  {
    id: "2",
    name: "Genesis",
    slug: "genesis",
    appUrl: "https://tank-volume-genesis.vercel.app/",
    description: "Tank Volume Calculator for Genesis",
    active: true,
  },
];

export const allowedOrigins = Array.from(
  new Set(initialClients.map((c) => new URL(c.appUrl).origin))
);
