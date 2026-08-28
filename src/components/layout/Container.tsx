import type { ElementType, ReactNode } from 'react';

export type ContainerSize = 'content' | 'wide' | 'full';

const SIZE_CLASS: Record<ContainerSize, string> = {
  content: 'max-w-content',
  wide: 'max-w-wide',
  full: 'max-w-none',
};

export interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  as?: ElementType;
  className?: string;
}

export function Container({ children, size = 'content', as: Tag = 'div', className = '' }: ContainerProps) {
  const gutter = size === 'full' ? '' : 'px-gutter';
  return <Tag className={['mx-auto w-full', SIZE_CLASS[size], gutter, className].filter(Boolean).join(' ')}>{children}</Tag>;
}
