import React from 'react';
import clsx from 'clsx';
import NavbarSearch from '@theme-original/Navbar/Search';

export default function NavbarSearchWrapper({className, ...props}) {
  return <NavbarSearch {...props} className={clsx(className, 'wiki-navbar-search')} />;
}
