import * as React from 'react';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = 'rounded-xl border border-zinc-200 bg-white shadow-sm';
  return <div className={[base, className].filter(Boolean).join(' ')} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = 'px-4 py-3 border-b border-zinc-200';
  return <div className={[base, className].filter(Boolean).join(' ')} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = 'px-4 py-3';
  return <div className={[base, className].filter(Boolean).join(' ')} {...props} />;
}


