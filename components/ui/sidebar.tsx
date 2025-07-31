import React from 'react';

export function Sidebar({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <aside className={className}>{children}</aside>;
}
export function SidebarContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function SidebarGroup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function SidebarGroupContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function SidebarGroupLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function SidebarMenu({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function SidebarMenuButton({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
export function SidebarMenuItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function SidebarHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function SidebarProvider({ children }: { children: React.ReactNode }) { return <>{children}</>; }
export function SidebarTrigger({ className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={className} {...props}>☰</button>;
}

