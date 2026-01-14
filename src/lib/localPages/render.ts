/**
 * HTML rendering for Local SEO pages
 */

import type { LocalPageContent } from './types';

export function renderLocalPageHtml(content: LocalPageContent, city: string, state: string): string {
  const paragraphs = (text: string) =>
    text
      .split(/\n\n+/)
      .filter((p) => p.trim().length > 0)
      .map((p) => `<p>${p.trim()}</p>`)
      .join('\n');

  let html = '';

  // H1
  html += `<h1>${content.h1}</h1>\n\n`;

  // Short intro
  if (content.shortIntro) {
    html += `<div class="intro-short">\n${paragraphs(content.shortIntro)}\n</div>\n\n`;
  }

  // Long intro
  if (content.longIntro) {
    html += `<div class="intro-long">\n${paragraphs(content.longIntro)}\n</div>\n\n`;
  }

  // Main body
  if (content.mainBody) {
    html += `<div class="main-body">\n${paragraphs(content.mainBody)}\n</div>\n\n`;
  }

  // What typically happens next
  if (content.whatTypicallyHappensNext) {
    html += `<section class="what-happens-next">\n<h2>What Typically Happens Next</h2>\n${paragraphs(content.whatTypicallyHappensNext)}\n</section>\n\n`;
  }

  // Services intro
  if (content.servicesIntro) {
    html += `<section class="services-intro">\n${paragraphs(content.servicesIntro)}\n</section>\n\n`;
  }

  // Local stats/regulation notes
  if (content.localStatsOrRegulationNotes) {
    html += `<section class="local-stats">\n${paragraphs(content.localStatsOrRegulationNotes)}\n</section>\n\n`;
  }

  // Neighborhoods/areas
  if (content.neighborhoodsOrAreas) {
    const areas = content.neighborhoodsOrAreas.split(',').map((a) => a.trim()).filter(Boolean);
    if (areas.length > 0) {
      html += `<section class="neighborhoods">\n<h2>Areas We Serve in ${city}, ${state}</h2>\n<ul>\n`;
      areas.forEach((area) => {
        html += `<li>${area}</li>\n`;
      });
      html += `</ul>\n</section>\n\n`;
    }
  }

  return html;
}
