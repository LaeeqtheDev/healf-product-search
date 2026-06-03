import { createReadStream } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse";
import type { Product } from "@/lib/types";
import { rawRowToProduct, type RawRow } from "./normalizer";

const CSV_PATH = join(process.cwd(), "data", "products.csv");


let productsPromise: Promise<readonly Product[]> | null = null;

function loadFromDisk(): Promise<readonly Product[]> {
  return new Promise((resolve, reject) => {
    const products: Product[] = [];

    const parser = parse({
      columns: true,
      skipEmptyLines: true,
      relaxQuotes: true,
      relaxColumnCount: true,
    });

    parser.on("readable", () => {
      let record: RawRow | null;
      while ((record = parser.read() as RawRow | null) !== null) {
        const product = rawRowToProduct(record);
        if (product) products.push(product);
      }
    });

    parser.on("error", reject);
    parser.on("end", () => resolve(products));

    createReadStream(CSV_PATH) //cache here
      .on("error", reject)
      .pipe(parser);
  });
}


export function getProducts(): Promise<readonly Product[]> {
  if (!productsPromise) {
    productsPromise = loadFromDisk().catch((err) => {
     
      productsPromise = null;
      throw err;
    });
  }
  return productsPromise;
}
