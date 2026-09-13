// Coordinates are relative to the viewport; only headings present in the TOC qualify.
export function getActiveHeadingId(headings, {scrollTop, scrollHeight, viewportHeight, topOffset}) {
  if (!headings.length) return null;

  const maxScroll = scrollHeight - viewportHeight;
  // Fractional scroll positions need a small tolerance. A page that fits on
  // screen is also at its beginning, so it must not jump to the last heading.
  if (maxScroll > 2 && scrollTop > 0 && scrollTop >= maxScroll - 2) {
    return headings[headings.length - 1].id;
  }

  // Keep Docusaurus' reading position: the next heading in the upper half,
  // otherwise the section whose text is still being read above it.
  const next = headings.findIndex(heading => heading.top >= topOffset);
  if (next === -1) return headings[headings.length - 1].id;
  if (headings[next].top > 0 && headings[next].bottom < viewportHeight / 2) {
    return headings[next].id;
  }
  return headings[next - 1]?.id ?? null;
}
