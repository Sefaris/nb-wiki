import {useEffect} from 'react';
import {getActiveHeadingId} from './activeHeading.mjs';

export default function useWikiTOCHighlight({toc, linkClassName, linkActiveClassName, hideOnScroll}) {
  useEffect(() => {
    // Inline and mobile TOCs do not request scroll highlighting.
    if (!linkClassName || !linkActiveClassName) return undefined;

    let frame = null;
    let activeLink = null;

    function update() {
      frame = null;
      const links = Array.from(document.getElementsByClassName(linkClassName));
      // Read actual TOC links so custom heading levels and omitted headings
      // are respected without maintaining a second copy of the TOC filter.
      const entries = links.flatMap(link => {
        const id = decodeURIComponent(link.hash.slice(1));
        const heading = document.getElementById(id);
        if (!heading || !heading.getClientRects().length) return [];
        const {top, bottom} = heading.getBoundingClientRect();
        return [{link, id, top, bottom}];
      });
      const scroller = document.scrollingElement || document.documentElement;
      const id = getActiveHeadingId(entries, {
        scrollTop: scroller.scrollTop,
        scrollHeight: scroller.scrollHeight,
        viewportHeight: document.documentElement.clientHeight,
        topOffset: hideOnScroll ? 0 : (document.querySelector('.navbar')?.clientHeight || 0),
      });
      const nextLink = entries.find(entry => entry.id === id)?.link || null;
      if (activeLink === nextLink) return;
      activeLink?.classList.remove(linkActiveClassName);
      activeLink?.removeAttribute('aria-current');
      nextLink?.classList.add(linkActiveClassName);
      nextLink?.setAttribute('aria-current', 'location');
      activeLink = nextLink;
    }

    function scheduleUpdate() {
      if (frame === null) frame = window.requestAnimationFrame(update);
    }

    document.addEventListener('scroll', scheduleUpdate, {passive: true});
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    // Images, callouts and tabs can change the page height without a scroll.
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.documentElement);
    const article = document.querySelector('article');
    if (article) observer.observe(article);
    scheduleUpdate();

    return () => {
      document.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', scheduleUpdate);
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
      activeLink?.classList.remove(linkActiveClassName);
      activeLink?.removeAttribute('aria-current');
    };
  }, [toc, linkClassName, linkActiveClassName, hideOnScroll]);
}
