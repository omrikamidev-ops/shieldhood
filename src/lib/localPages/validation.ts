/**
 * Content validation and safety flagging for Local SEO pages
 */

import type { LocalPageContent, SafetyFlag } from './types';

export function validateContent(content: LocalPageContent, city: string, state: string): SafetyFlag[] {
  const flags: SafetyFlag[] = [];

  // Count non-FAQ words
  const mainText = `${content.shortIntro} ${content.longIntro} ${content.mainBody} ${content.whatTypicallyHappensNext} ${content.servicesIntro}`;
  const wordCount = mainText.split(/\s+/).filter((w) => w.length > 0).length;
  if (wordCount < 750) {
    flags.push('low_word_count');
  }

  // Count city/state mentions
  const cityMentions = (mainText.toLowerCase().match(new RegExp(city.toLowerCase(), 'g')) || []).length;
  const stateMentions = (mainText.toLowerCase().match(new RegExp(state.toLowerCase(), 'g')) || []).length;
  if (cityMentions + stateMentions < 6) {
    flags.push('low_city_mentions');
  }

  // Check for local context (paragraphs mentioning location)
  const paragraphs = mainText.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const localParagraphs = paragraphs.filter(
    (p) => p.toLowerCase().includes(city.toLowerCase()) || p.toLowerCase().includes(state.toLowerCase()),
  );
  if (localParagraphs.length < 2) {
    flags.push('low_local_context');
  }

  // Check for required sections
  const sections = [
    content.shortIntro,
    content.longIntro,
    content.mainBody,
    content.whatTypicallyHappensNext,
    content.servicesIntro,
  ].filter((s) => s && s.trim().length > 0);
  if (sections.length < 4) {
    flags.push('insufficient_sections');
  }

  // Check FAQ count
  if (!content.locationFAQ || content.locationFAQ.length < 5) {
    flags.push('insufficient_faq');
  }

  // Check for prohibited claims (law firm, guarantees, etc.)
  const prohibitedPatterns = [
    /\bguarantee\b/i,
    /\bpromise\b.*\bresult\b/i,
    /\blaw firm\b/i,
    /\battorney\b/i,
    /\bwe will win\b/i,
    /\b100% success\b/i,
  ];
  const allText = `${mainText} ${content.locationFAQ?.map((f) => `${f.question} ${f.answer}`).join(' ') || ''}`;
  if (prohibitedPatterns.some((pattern) => pattern.test(allText))) {
    flags.push('prohibited_claims');
  }

  return flags;
}
