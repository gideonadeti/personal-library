"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  User,
  Tag,
  Plus,
  LibraryBig,
  MoreHorizontal,
  BookHeart,
  Library,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import CreateGroup from "@/app/components/create-group";
import DeleteGroup from "@/app/components/delete-group";
import { Group } from "@/app/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggler } from "./theme-toggler";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
  SidebarFooter,
  SidebarMenuAction,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const defaultGroups = [
  { name: "All Books", href: "/groups/all-books", icon: LibraryBig },
  { name: "Favorites", href: "/groups/favorites", icon: BookHeart },
  { name: "Authors", href: "/authors", icon: User },
  { name: "Genres", href: "/genres", icon: Tag },
];

export function AppSidebar() {
  const { groupId } = useParams<{ groupId: string }>();
  const { status, data: groups } = useQuery<Group[]>({ queryKey: ["groups"] });

  const pathname = usePathname();
  const personalGroups = groups?.filter((group) => !group.default) || [];

  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [openDeleteGroup, setOpenDeleteGroup] = useState(false);
  const [updateGroupId, setUpdateGroupId] = useState("");
  const [deleteGroupId, setDeleteGroupId] = useState("");
  const [initialName, setInitialName] = useState("");

  function handleUpdateGroup(id: string, name: string) {
    setUpdateGroupId(id);
    setInitialName(name);
    setOpenCreateGroup(true);
  }

  function handleCreateGroup() {
    setUpdateGroupId("");
    setInitialName("");
    setOpenCreateGroup(true);
  }

  function handleDeleteGroup(id: string) {
    setDeleteGroupId(id);
    setOpenDeleteGroup(true);
  }

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
                    {(defaultGroup.name === "Authors" ||
                      defaultGroup.name === "Genres") && (
                      <SidebarMenuAction
                        showOnHover
                        title={`Create ${defaultGroup.name.slice(0, -1)}`}
                      >
                        <Plus />
                      </SidebarMenuAction>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Personal Groups</SidebarGroupLabel>
          <SidebarGroupAction title="Create Group" onClick={handleCreateGroup}>
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {status === "pending" ? (
                <SidebarMenuItem>
                  <Skeleton className="h-8 w-full rounded-md" />
                </SidebarMenuItem>
              ) : (
                personalGroups.map((group) => (
                  <SidebarMenuItem key={group.id}>
                    <SidebarMenuButton asChild isActive={groupId === group.id}>
                      <Link href={`/groups/${group.id}`}>
                        <Library />
                        <span>{group.name}</span>
                      </Link>
                    </SidebarMenuButton>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <MoreHorizontal />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateGroup(group.id, group.name)
                          }
                        >
                          <span>Update</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup className="flex flex-row items-center justify-between">
          <ThemeToggler />
        </SidebarGroup>
        <CreateGroup
          open={openCreateGroup}
          onOpenChange={setOpenCreateGroup}
          groupId={updateGroupId}
          initialName={initialName}
        />
        <DeleteGroup
          open={openDeleteGroup}
          onOpenChange={setOpenDeleteGroup}
          groupId={deleteGroupId}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
