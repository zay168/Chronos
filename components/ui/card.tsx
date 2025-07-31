import React from 'react';

export function Card({ className = '', children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={`border rounded-lg ${className}`} {...props}>{children}</div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div className={`border-b p-2 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }: React.HTMLProps<HTMLHeadingElement>) {
  return <h3 className={`font-bold ${className}`} {...props}>{children}</h3>;
}

export function CardContent({ className = '', children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div className={`p-2 ${className}`} {...props}>{children}</div>;
}
