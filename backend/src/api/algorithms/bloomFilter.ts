/**
 * Bloom Filter Fast duplicate application detection
 * Time Complexity: O(1) for insert and lookup
 * Space Complexity: O(m) where m = bit array size
 * False positive rate: ~1% with default settings
 *
 * Used as Tier 1 fast-rejection before DB query.
 */

// Simple hash functions

function hash1(str: string, size: number): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return Math.abs(hash) % size;
}

function hash2(str: string, size: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 6) + (hash << 16) - hash);
  }
  return Math.abs(hash) % size;
}

function hash3(str: string, size: number): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % size;
}

// Bloom Filter class

export class BloomFilter {
  private bits: Uint8Array;
  private size: number;

  /**
   * @param size  Bit array size — larger = fewer false positives
   *              10_000 bits → ~1% FP rate for up to 1000 entries
   */
  constructor(size: number = 10_000) {
    this.size = size;
    this.bits = new Uint8Array(Math.ceil(size / 8));
  }

  private setBit(pos: number): void {
    this.bits[Math.floor(pos / 8)] |= 1 << (pos % 8);
  }

  private getBit(pos: number): boolean {
    return (this.bits[Math.floor(pos / 8)] & (1 << (pos % 8))) !== 0;
  }

  /** Add a key to the filter — O(1) */
  add(key: string): void {
    this.setBit(hash1(key, this.size));
    this.setBit(hash2(key, this.size));
    this.setBit(hash3(key, this.size));
  }

  /**
   * Check if key might exist — O(1)
   * Returns false  → definitely NOT a duplicate (safe to proceed)
   * Returns true   → probably a duplicate (verify with DB)
   */
  mightContain(key: string): boolean {
    return (
      this.getBit(hash1(key, this.size)) &&
      this.getBit(hash2(key, this.size)) &&
      this.getBit(hash3(key, this.size))
    );
  }

  /** Serialize to base64 for storage/transfer */
  serialize(): string {
    return Buffer.from(this.bits).toString('base64');
  }

  /** Restore from base64 */
  static deserialize(data: string, size: number = 10_000): BloomFilter {
    const filter = new BloomFilter(size);
    filter.bits = new Uint8Array(Buffer.from(data, 'base64'));
    return filter;
  }
}

// Singleton per-job filter store 
// Keyed by jobId — each job has its own filter of applicant candidateIds

const jobFilters = new Map<number, BloomFilter>();

export function getJobFilter(jobId: number): BloomFilter {
  if (!jobFilters.has(jobId)) {
    jobFilters.set(jobId, new BloomFilter(10_000));
  }
  return jobFilters.get(jobId)!;
}

/**
 * Build application key from candidateId + jobId
 */
export function applicationKey(candidateId: number, jobId: number): string {
  return `app:${candidateId}:${jobId}`;
}

/**
 * Fast duplicate check — O(1)
 * Returns true if this application MIGHT already exist (check DB to confirm)
 * Returns false if it definitely does NOT exist
 */
export function mightBeDuplicate(candidateId: number, jobId: number): boolean {
  const filter = getJobFilter(jobId);
  return filter.mightContain(applicationKey(candidateId, jobId));
}

/**
 * Register a new application in the bloom filter
 */
export function registerApplication(candidateId: number, jobId: number): void {
  const filter = getJobFilter(jobId);
  filter.add(applicationKey(candidateId, jobId));
}
