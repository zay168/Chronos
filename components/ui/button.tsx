import React from 'react';

export function Button({ className = '', children, ...props }: React.HTMLProps<HTMLButtonElement>) {
  return (
    <button className={`px-3 py-2 rounded border ${className}`} {...props}>
      {children}
    </button>
  );
}
export default Button;
