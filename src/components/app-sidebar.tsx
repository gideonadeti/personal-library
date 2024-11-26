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
import CreateAuthor from "@/app/components/create-author";
import CreateGenre from "@/app/components/create-genre";
import CreateBook from "@/app/components/create-book";
import { Group, Author, Genre, Book } from "@/app/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggler } from "./theme-toggler";
import { Button } from "./ui/button";
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
  SidebarMenuBadge,
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
  const { data: authors } = useQuery<Author[]>({ queryKey: ["authors"] });
  const { data: genres } = useQuery<Genre[]>({ queryKey: ["genres"] });
  const { data: books } = useQuery<Book[]>({ queryKey: ["books"] });

  const pathname = usePathname();
  const personalGroups = groups?.filter((group) => !group.default) || [];

  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [openCreateAuthor, setOpenCreateAuthor] = useState(false);
  const [openCreateGenre, setOpenCreateGenre] = useState(false);
  const [openCreateBook, setOpenCreateBook] = useState(false);
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
                    {defaultGroup.name === "Authors" ||
                    defaultGroup.name === "Genres" ? (
                      <>
                        <SidebarMenuBadge className="me-5">
                          {defaultGroup.name === "Authors" &&
                            authors &&
                            authors.length > 0 &&
                            authors.length}
                          {defaultGroup.name === "Genres" &&
                            genres &&
                            genres.length > 0 &&
                            genres.length}
                        </SidebarMenuBadge>
                        <SidebarMenuAction
                          showOnHover
                          title={`Create ${defaultGroup.name.slice(0, -1)}`}
                          onClick={() => {
                            if (defaultGroup.name === "Authors") {
                              setOpenCreateAuthor(true);
                            } else if (defaultGroup.name === "Genres") {
                              setOpenCreateGenre(true);
                            }
                          }}
                        >
                          <Plus />
                        </SidebarMenuAction>
                      </>
                    ) : (
                      <SidebarMenuBadge>
                        {defaultGroup.name === "All Books" &&
                          groups &&
                          groups.length > 0 &&
                          groups.find((group) => group.default)?.books.length}
                        {defaultGroup.name === "Favorites" &&
                          books &&
                          books.length > 0 &&
                          books.filter((book) => book.favorite).length}
                      </SidebarMenuBadge>
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

                    <SidebarMenuBadge className="me-5">
                      {group.books.length > 0 && group.books.length}
                    </SidebarMenuBadge>

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
        <SidebarGroup className="flex flex-row items-center justify-between space-x-4">
          <ThemeToggler />
          <Button
            variant="outline"
            onClick={() => setOpenCreateBook(true)}
            className="w-full"
          >
            Create Book
          </Button>
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
        <CreateAuthor
          open={openCreateAuthor}
          onOpenChange={setOpenCreateAuthor}
        />
        <CreateGenre open={openCreateGenre} onOpenChange={setOpenCreateGenre} />
        <CreateBook open={openCreateBook} onOpenChange={setOpenCreateBook} />
      </SidebarFooter>
    </Sidebar>
  );
}
