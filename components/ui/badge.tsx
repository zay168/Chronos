import React from 'react';

export function Badge({ className = '', children, ...props }: React.HTMLProps<HTMLSpanElement>) {
  return <span className={`px-2 py-1 text-xs rounded ${className}`} {...props}>{children}</span>;
}
export default Badge;
