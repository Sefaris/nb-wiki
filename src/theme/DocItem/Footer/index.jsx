import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DocItemFooter from '@theme-original/DocItem/Footer';
import {SourceNote} from '@site/src/components/Wiki';

export default function Footer(props) {
  const {metadata} = useDoc();
  const {siteConfig: {customFields: {profile}}} = useDocusaurusContext();
  const sourcePath = metadata.source.replace(/^@site\/docs\//, '');
  return <>{!profile.prototype && <SourceNote path={sourcePath}/>}<DocItemFooter {...props}/></>;
}
