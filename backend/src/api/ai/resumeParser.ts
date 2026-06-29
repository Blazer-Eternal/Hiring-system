/**
 * Resume Parser Extract structured data from raw CV text
 * Used for autofill of candidate profile fields
 */

//Patterns 

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /(\+?[\d\s\-().]{7,20})/;
const NAME_PATTERN = /^([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/m;

const SECTION_HEADERS = {
  skills:     /skills?|technical\s+skills?|core\s+competencies|technologies/i,
  experience: /experience|work\s+history|employment|professional\s+background/i,
  education:  /education|academic|qualification/i,
  summary:    /summary|objective|profile|about/i,
};

const COMMON_SKILLS = [
  'javascript','typescript','python','java','c#','c++','go','rust','php','ruby',
  'react','angular','vue','node','express','django','flask','spring','laravel',
  'sql','mysql','postgresql','mongodb','redis','elasticsearch',
  'aws','azure','gcp','docker','kubernetes','terraform','ci/cd','git',
  'html','css','rest','graphql','microservices','agile','scrum',
  'machine learning','deep learning','tensorflow','pytorch','nlp',
  'leadership','communication','teamwork','problem solving','project management',
];

//Helpers

function extractEmail(text: string): string | null {
  const match = text.match(EMAIL_PATTERN);
  return match ? match[0] : null;
}

function extractPhone(text: string): string | null {
  const match = text.match(PHONE_PATTERN);
  if (!match) return null;
  const cleaned = match[0].replace(/\s+/g, '').trim();
  return cleaned.length >= 7 ? cleaned : null;
}

function extractName(text: string): string | null {
  const match = text.match(NAME_PATTERN);
  return match ? match[1].trim() : null;
}

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return COMMON_SKILLS.filter(skill => lower.includes(skill));
}

function extractExperienceYears(text: string): number {
  // Look for patterns like "5 years", "3+ years", "2-4 years experience"
  const patterns = [
    /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i,
    /experience\s+of\s+(\d+)\+?\s*years?/i,
    /(\d+)\s*-\s*\d+\s*years?\s+(?:of\s+)?experience/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return parseInt(match[1], 10);
  }
  return 0;
}

function extractSection(text: string, headerPattern: RegExp): string {
  const lines = text.split('\n');
  let inSection = false;
  const sectionLines: string[] = [];

  for (const line of lines) {
    if (headerPattern.test(line)) {
      inSection = true;
      continue;
    }
    // Stop at next section header
    if (inSection) {
      const isNewSection = Object.values(SECTION_HEADERS).some(p => p.test(line) && !headerPattern.test(line));
      if (isNewSection) break;
      sectionLines.push(line);
    }
  }
  return sectionLines.join('\n').trim();
}

// Public API

export interface ParsedResume {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  skills: string[];
  experienceYears: number;
  summary: string;
  rawText: string;
  confidence: number;   // 0–100 how complete the parse was
}

export function parseResume(rawText: string): ParsedResume {
  const name = extractName(rawText);
  const email = extractEmail(rawText);
  const phoneNumber = extractPhone(rawText);
  const skills = extractSkills(rawText);
  const experienceYears = extractExperienceYears(rawText);
  const summary = extractSection(rawText, SECTION_HEADERS.summary);

  // Confidence score based on how many fields were extracted
  const fields = [name, email, phoneNumber, skills.length > 0, experienceYears > 0];
  const confidence = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  return {
    name,
    email,
    phoneNumber,
    skills,
    experienceYears,
    summary,
    rawText,
    confidence,
  };
}

/**
 * Build a searchable profile text from candidate data
 * Used as input for TF-IDF matching
 */
export function buildCandidateProfileText(candidate: {
  name: string;
  temporaryAddress?: string;
  permanentAddress?: string;
  cvText?: string;
}): string {
  return [
    candidate.name,
    candidate.temporaryAddress ?? '',
    candidate.permanentAddress ?? '',
    candidate.cvText ?? '',
  ].join(' ').trim();
}
