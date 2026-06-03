import { Product } from "@/lib/types";

function make(p: Partial<Product> & Pick<Product, "id" | "title">): Product {
    return {
      vendor: "Acme",
      productType: "Supplement",
      description: "",
      handle: p.title.toLowerCase().replace(/\s+/g, "-"),
      status: "ACTIVE",
      price: 10,
      maxPrice: 10,
      currency: "GBP",
      available: true,
      totalInventory: 5,
      imageUrl: null,
      imageAlt: null,
      tags: [],
      ...p,
    };
  }

  export const FIXTURE: Product[] =[
    make({ id: "1", title: "Magnesium Glycinate", vendor: "Thorne", price: 20 }),
  make({ id: "2", title: "Vitamin D3", vendor: "Thorne", price: 12 }),
  make({
    id: "3",
    title: "Daily Greens",
    vendor: "Healf",
    price: 35,
    description: "Contains magnesium and vitamin c",
  }),
  make({
    id: "4",
    title: "Sleep Aid",
    vendor: "NOW Foods",
    price: 8,
    available: false,
    totalInventory: 0,
  }),
  make({ id: "5", title: "Protein Powder", vendor: "Acme", price: 45 }),
];
