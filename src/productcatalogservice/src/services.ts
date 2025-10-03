// src/services/catalogLoader.ts
import fs from 'fs/promises';
import path from 'path';
import { Product, ListProductsResponse } from './types.js';

// Mutex-like flag for thread safety (Node.js is single-threaded, but async operations need coordination)
let isLoading = false;
let loadQueue: Array<(catalog: ListProductsResponse) => void> = [];

/**
 * Load catalog from local JSON file
 */
async function loadCatalogFromLocalFile(): Promise<ListProductsResponse> {
  console.log('Loading catalog from local products.json file...');
  
  try {
    const filePath = path.join(process.cwd(), 'products.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    console.log('Successfully parsed product catalog JSON');
    return data as ListProductsResponse;
  } catch (error) {
    console.error('Failed to load or parse product catalog:', error);
    throw error;
  }
}

/**
 * Load catalog from AWS RDS PostgreSQL
 * This will be implemented when we add database support
 */
async function loadCatalogFromRDS(): Promise<ListProductsResponse> {
  console.log('Loading catalog from AWS RDS...');
  
  // TODO: Implement RDS connection
  // - Get database credentials from AWS Secrets Manager
  // - Connect to RDS PostgreSQL
  // - Query products table
  // - Map rows to Product objects
  
  throw new Error('RDS loading not yet implemented');
}

/**
 * Main catalog loader function
 * Determines source (local file or RDS) based on environment variables
 */
export async function loadCatalog(): Promise<ListProductsResponse> {
  // Prevent concurrent loading
  if (isLoading) {
    return new Promise((resolve) => {
      loadQueue.push(resolve);
    });
  }

  isLoading = true;

  try {
    let catalog: ListProductsResponse;

    // Check if RDS configuration exists
    const rdsClusterName = process.env.RDS_CLUSTER_NAME;
    
    if (rdsClusterName) {
      catalog = await loadCatalogFromRDS();
    } else {
      catalog = await loadCatalogFromLocalFile();
    }

    // Resolve any queued requests
    loadQueue.forEach(resolve => resolve(catalog));
    loadQueue = [];

    return catalog;
  } catch (error) {
    isLoading = false;
    loadQueue = [];
    throw error;
  } finally {
    isLoading = false;
  }
}

/**
 * Validate product data structure
 */
export function validateProduct(product: any): product is Product {
  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.picture === 'string' &&
    product.priceUsd &&
    typeof product.priceUsd.currencyCode === 'string' &&
    typeof product.priceUsd.units === 'number' &&
    typeof product.priceUsd.nanos === 'number' &&
    Array.isArray(product.categories)
  );
}