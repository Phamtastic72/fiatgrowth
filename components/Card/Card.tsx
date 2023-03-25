import { ReactNode } from 'react';
import classNames from '../../utils/classNames';
import CardTitle from './components/CardTitle';

export default function Card({
  title,
  intro,
  children,
  align = 'center',
  variant = 'clarity',
  className = '',
}: {
  title?: string | ReactNode;
  intro?: string | ReactNode;
  children?: ReactNode;
  align?: 'center' | 'left';
  variant?: 'clarity' | 'warmth';
  className?: string;
}) {
  return (
    <div
      className={classNames(
        className,
        'rounded-2xl py-4 text-matte',
        variant === 'clarity' && 'bg-clarity',
        variant === 'warmth' && 'bg-warmth',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left'
      )}
    >
      {(title || intro) && (
        <header className="space-y-4 px-8 py-4">
          {title && <CardTitle>{title}</CardTitle>}
          {intro && (
            <div className="mx-auto max-w-md text-lg leading-snug text-matte/40">
              {intro}
            </div>
          )}
        </header>
      )}
      {children && <div className="space-y-8 px-8 py-4">{children}</div>}
    </div>
  );
}
