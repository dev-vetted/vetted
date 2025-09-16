import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium';
  const style =
    variant === 'primary'
      ? 'bg-black text-white hover:bg-zinc-800'
      : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300';
  return <button className={[base, style, className].filter(Boolean).join(' ')} {...props} />;
}


