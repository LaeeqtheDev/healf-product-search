import { Product } from "../types";

export interface IndexedProduct {
    product: Product
    titleLc: string;
    vendorLc: string;
    descriptionLc: string;
}



export function toIndexed(product: Product): IndexedProduct {
    return {
      product,
      titleLc: product.title.toLowerCase(),
      vendorLc: product.vendor.toLowerCase(),
      descriptionLc: product.description.toLowerCase(),
    };
  }


  export function tokenize(query: string): string[] {
    const seen = new Set<string>();
    for (const tok of query.toLowerCase().trim().split(/\s+/)) {
      if (tok.length > 0) seen.add(tok);
    }
    return [...seen];
  }

const WEIGHT_TITLE = 10;
const WEIGHT_VENDOR = 5;
const WEIGHT_DESCRIPTION = 1;


export function scoreProduct(item: IndexedProduct, tokens: string[]): number {
    if (tokens.length === 0) return 1; // no query → everything "matches" equally
  
    let score = 0;
    for (const token of tokens) {
      let tokenScore = 0;
      if (item.titleLc.includes(token)) tokenScore += WEIGHT_TITLE;
      if (item.vendorLc.includes(token)) tokenScore += WEIGHT_VENDOR;
      if (item.descriptionLc.includes(token)) tokenScore += WEIGHT_DESCRIPTION;
  
      // AND semantics: a token that matches nowhere disqualifies the product.
      if (tokenScore === 0) return 0;
      score += tokenScore;
    }
    return score;
  }