import { createClient } from "@sanity/client";
import type { SanityClient } from "@sanity/client";

interface SanityEnvironmentConfig {
  projectId: string;
  dataset: string;
  token?: string;
  apiVersion: string;
  useCdn: boolean;
}

let cachedClient: SanityClient | null = null;
let cachedSignature: string | null = null;

function resolveEnvironmentConfig(): SanityEnvironmentConfig | null {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    return null;
  }

  return {
    projectId,
    dataset,
    token: process.env.SANITY_READ_TOKEN,
    apiVersion: process.env.SANITY_API_VERSION ?? "2023-10-01",
    useCdn: process.env.NODE_ENV === "production"
  };
}

export function getSanityClient(): SanityClient | null {
  const config = resolveEnvironmentConfig();
  if (!config) {
    return null;
  }

  const signature = JSON.stringify(config);

  if (!cachedClient || cachedSignature !== signature) {
    cachedClient = createClient({
      projectId: config.projectId,
      dataset: config.dataset,
      token: config.token,
      apiVersion: config.apiVersion,
      useCdn: config.useCdn,
      perspective: "published"
    });
    cachedSignature = signature;
  }

  return cachedClient;
}

export function isSanityConfigured(): boolean {
  return Boolean(resolveEnvironmentConfig());
}
