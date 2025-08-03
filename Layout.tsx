
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock, Settings, History, Cog } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Schedule",
    url: createPageUrl("Schedule"),
    icon: History,
  },
  {
    title: "Admin Panel",
    url: createPageUrl("Admin"),
    icon: Settings,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Cog,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <style>{`
          :root {
            --primary-navy: #1e293b;
            --accent-gold: #f59e0b;
            --soft-gray: #f8fafc;
            --text-primary: #0f172a;
            --text-secondary: #64748b;
          }
        `}</style>
        
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/80">
          <SidebarHeader className="border-b border-slate-200/60 p-6 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg dark:text-slate-100">Chronos</h2>
                <p className="text-xs text-slate-500 font-medium dark:text-slate-400">Daily Schedule</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 py-3 dark:text-slate-300">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className={`transition-all duration-300 rounded-xl px-4 py-3 ${
                          location.pathname === item.url
                            ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg dark:from-slate-700 dark:to-slate-600'
                            : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/60 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 md:hidden dark:bg-slate-900/60 dark:border-slate-700/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-xl transition-colors duration-200 dark:hover:bg-slate-700" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Chronos</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
