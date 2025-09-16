import * as React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  const base =
    'block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';
  return <input className={[base, className].filter(Boolean).join(' ')} {...props} />;
}


