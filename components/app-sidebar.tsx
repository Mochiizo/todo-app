"use client";
import {
  LayoutDashboard,
  Plus,
  History,
  CheckSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  {
    label: "Tableau de bord",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "Nouvelle liste",
    icon: Plus,
    path: "/new-list",
  },
  {
    label: "Historique",
    icon: History,
    path: "/history",
  },
];

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar className="bg-[#0b1b3a] text-white border-r border-white/10">

      {/* Header */}
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#b57edc] text-white shadow-md">
            <CheckSquare className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              Tâchable
            </h1>
            <p className="text-sm text-white/70">
              Vos listes, organisées
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="px-4">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  onClick={() => router.push(item.path)}
                  className={`
                    flex items-center gap-3 h-12 rounded-xl text-base p-3
                    transition-all
                    ${
                      isActive
                        ? "bg-[#b57edc] text-white shadow-md"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-6 mt-auto border-t border-white/10">
        <p className="text-sm text-white/50">
          Données stockées localement
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}