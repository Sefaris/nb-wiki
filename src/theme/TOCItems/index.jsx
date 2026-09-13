import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import TOCItems from '@theme-original/TOCItems';
import useWikiTOCHighlight from './useWikiTOCHighlight';

export default function WikiTOCItems({
  toc,
  linkClassName = 'table-of-contents__link',
  linkActiveClassName,
  ...props
}) {
  const {siteConfig} = useDocusaurusContext();
  const hideOnScroll = siteConfig.themeConfig.navbar?.hideOnScroll ?? false;
  useWikiTOCHighlight({toc, linkClassName, linkActiveClassName, hideOnScroll});

  return <TOCItems
    {...props}
    toc={toc}
    linkClassName={linkClassName}
    // The wiki hook owns highlighting; do not run two competing scroll handlers.
    linkActiveClassName={undefined}
  />;
}
