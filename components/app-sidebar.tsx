"use client";
import {
  LayoutDashboard,
  Plus,
  History,
  CheckSquare,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

import DecorativeFlower from "@/components/decorative-flower";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

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

  const handleLogout = () => {
    signOut({ redirectTo: "/login" });
  };

  return (
    <Sidebar className="border-r border-white/10">

      {/* Header */}
      <SidebarHeader className="relative overflow-hidden p-6">
        <DecorativeFlower
          color="#b57edc"
          className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rotate-[20deg] opacity-20"
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#b57edc] text-white shadow-md">
            <CheckSquare className="h-7 w-7" />
          </div>

          <div>
            <h1 className="font-heading text-2xl font-bold tracking-wide">
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
                    flex items-center gap-3 h-12 rounded-2xl text-base p-3
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#b57edc] text-white shadow-md"
                        : "text-white/80 hover:translate-x-0.5 hover:bg-white/10 hover:text-white"
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
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}