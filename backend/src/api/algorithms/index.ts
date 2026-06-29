/**
 * Algorithms — pure math/data-structure implementations
 * No database, no Express, no business logic
 *
 * tfidf.ts       → TF-IDF + Cosine Similarity   O(n×m)
 * bloomFilter.ts → Bloom Filter fast-reject      O(1)
 * lsh.ts         → Locality-Sensitive Hashing    O(n)
 */

export {
  rankJobsForCandidate,
  rankCandidatesForJob,
  computeMatch,
} from './tfidf';

export type { JobMatchResult, CandidateMatchResult, MatchResult } from './tfidf';

export {
  BloomFilter,
  getJobFilter,
  applicationKey,
  mightBeDuplicate,
  registerApplication,
} from './bloomFilter';

export {
  LSHIndex,
  applicationLSHIndex,
} from './lsh';

export type { LSHDocument, DuplicateGroup } from './lsh';
