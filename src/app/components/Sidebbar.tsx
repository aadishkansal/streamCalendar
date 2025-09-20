import React, { useState } from 'react';
import Streaks from './Streaks';
import { Sidebar ,SidebarBody,SidebarLink } from '@/components/ui/sidebar';
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconCalendar,
  IconHome
} from '@tabler/icons-react';
import { motion } from 'motion/react';

interface SidebarProps {
  completionMap: Map<string, boolean>
}

export const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre text-black dark:text-white">
        StreamCalendar
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
  </a>
);

const links = [
  {
    label: 'Home',
    href: '/',
    icon: <IconHome className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  },
  {
    label: 'My Schedule',
    href: '/calendar/',
    icon: <IconCalendar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  },
  {
    label: 'Help & Support',
    href: '/support',
    icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  },
  {
    label: 'Logout',
    href: '#',
    icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  }
];

const Dashboard = () => (
  <div className="flex flex-1">
    <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      {/* Placeholder area for your dashboard content */}
      <div className="flex gap-2">
        {[...new Array(4)].map((_, idx) => (
          <div key={idx} className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
        ))}
      </div>
      <div className="flex flex-1 gap-2">
        {[...new Array(2)].map((_, idx) => (
          <div key={idx} className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
        ))}
      </div>
    </div>
  </div>
);

const Sidebbar: React.FC<SidebarProps> = ({ completionMap }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
            {/* Optionally include Streaks component below your links */}
            <div className="mt-4">
              <Streaks completionMap={completionMap} />
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: 'Stream User',
                href: '#',
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
};

export default Sidebbar;
