import { ReactNode } from 'react';

export default function CardTitle({ children }: { children?: ReactNode }) {
  return <h2 className="font-display text-3xl leading-none">{children}</h2>;
}
