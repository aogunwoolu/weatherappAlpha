import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

//data for the side bar components (paths, titles, icons, etc.)
export const SidebarData = [
  {
    title: 'Whether?',
    path: '/',
    icon: <AiIcons.AiOutlineHome />,
    cName: 'nav-text',
    colour: '#ff8cf9'
  },
  {
    title: 'Map',
    path: '/map',
    icon: <FiIcons.FiMap/>,
    cName: 'nav-text',
    colour: 'white'
  },
  {
    title: 'About',
    path: '/about',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text',
    colour: 'white'
  },
  {
    title: 'Search',
    path: '/search',
    icon: <FaIcons.FaSearch />,
    cName: 'nav-text',
    colour: 'white'
  },
  {
    title: 'Saved',
    path: '/saved',
    icon: <FaIcons.FaSave />,
    cName: 'nav-text',
    colour: 'white'
  }
];