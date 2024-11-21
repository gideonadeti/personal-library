"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { BookOpen, Bookmark, Book, CheckCircle, User, Tag } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const defaultGroups = [
  { name: "All Books", href: "/groups/all-books", icon: BookOpen },
  { name: "Unread", href: "/groups/unread", icon: Bookmark },
  { name: "Reading", href: "/groups/reading", icon: Book },
  { name: "Read", href: "/groups/read", icon: CheckCircle },
  { name: "Authors", href: "/authors", icon: User },
  { name: "Genres", href: "/genres", icon: Tag },
];

export function AppSidebar() {
  const { groupId } = useParams<{ groupId: string }>();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Default Groups</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {defaultGroups.map((defaultGroup) => {
                // Check if groupId matches the group name or if the pathname is one of the special cases
                const isActive =
                  groupId === defaultGroup.name.toLowerCase() ||
                  (groupId === "all-books" &&
                    defaultGroup.name === "All Books") ||
                  (pathname === "/authors" &&
                    defaultGroup.name === "Authors") ||
                  (pathname === "/genres" && defaultGroup.name === "Genres");

                return (
                  <SidebarMenuItem key={defaultGroup.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={defaultGroup.href}>
                        <defaultGroup.icon />
                        <span>{defaultGroup.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
