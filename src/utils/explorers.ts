import { chainIdToMetadata } from '@ortege/sdk';

import { fetchWithTimeout } from './timeout';

export interface ExplorerQueryResponse<R> {
  status: string;
  message: string;
  result: R;
}

export function getExplorerUrl(chainId: number) {
  const chain = chainIdToMetadata[chainId];
  if (!chain?.blockExplorers?.length) return null;
  return chain.blockExplorers[0].url;
}

export function getExplorerApiUrl(chainId: number) {
  const chain = chainIdToMetadata[chainId];
  if (!chain?.blockExplorers?.length) return null;
  return chain.blockExplorers[0].apiUrl || chain.blockExplorers[0].url;
}

export function getTxExplorerUrl(chainId: number, hash?: string) {
  const baseUrl = getExplorerUrl(chainId);
  if (!hash || !baseUrl) return null;
  return `${baseUrl}/tx/${hash}`;
}

export async function queryExplorer<P>(
  chainId: number,
  path: string,
  apiKey?: string,
  timeout?: number,
) {
  const baseUrl = getExplorerApiUrl(chainId);
  if (!baseUrl) throw new Error(`No URL found for explorer for chain ${chainId}`);

  let url = `${baseUrl}/${path}`;
  console.debug('Querying explorer url:', url);

  if (apiKey) {
    url += `&apikey=${apiKey}`;
  }

  const result = await executeExplorerQuery<P>(url, timeout);
  return result;
}

export async function executeExplorerQuery<P>(url: string, timeout?: number) {
  const response = await fetchWithTimeout(url, undefined, timeout);
  if (!response.ok) {
    throw new Error(`Fetch response not okay: ${response.status}`);
  }
  const json = (await response.json()) as ExplorerQueryResponse<P>;

  if (!json.result) {
    const responseText = await response.text();
    throw new Error(`Invalid result format: ${responseText}`);
  }

  return json.result;
}

interface PartialBlock {
  hash: string;
  number: number;
  timestamp: number;
  nonce: string;
}

export async function queryExplorerForBlock(chainId: number, blockNumber?: number | string) {
  const path = `?module=proxy&action=eth_getBlockByNumber&tag=${
    blockNumber || 'latest'
  }&boolean=false`;
  const block = await queryExplorer<PartialBlock>(chainId, path);
  if (!block?.number || parseInt(block.number.toString()) < 0) {
    const msg = 'Invalid block result';
    console.error(msg, JSON.stringify(block), path);
    throw new Error(msg);
  }
  return block;
}
