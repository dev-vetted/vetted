import * as React from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg">
        {title ? <h2 className="mb-2 text-lg font-semibold">{title}</h2> : null}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end">
          <button
            className="inline-flex items-center justify-center rounded-md bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


