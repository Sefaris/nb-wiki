import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import {ModIdentity, SidebarLinks} from '@site/src/components/Wiki';

export default function SidebarWrapper(props) {
  return <div className="sefaris-sidebar"><ModIdentity/><DocSidebar {...props}/><SidebarLinks/></div>;
}
