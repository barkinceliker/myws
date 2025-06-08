"use client";

import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
};

export function NavLink({ href, children, className, activeClassName = 'text-primary font-semibold', ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-primary",
        className,
        isActive && activeClassName
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
