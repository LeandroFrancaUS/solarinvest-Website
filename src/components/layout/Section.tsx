import type { ElementType, ReactNode } from 'react';
import { Container, type ContainerSize } from './Container';

export interface SectionProps {
  children: ReactNode;
  size?: ContainerSize;
  as?: ElementType;
  id?: string;
  className?: string;
  innerClassName?: string;
  itemScope?: boolean;
  itemType?: string;
}

export function Section({ children, size = 'content', as: Tag = 'section', id, className = '', innerClassName = '', itemScope, itemType }: SectionProps) {
  return (
    <Tag id={id} itemScope={itemScope} itemType={itemType} className={['w-full', className].filter(Boolean).join(' ')}>
      <Container size={size} className={innerClassName}>{children}</Container>
    </Tag>
  );
}
