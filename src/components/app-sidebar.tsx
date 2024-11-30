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
import { useState, useCallback, useMemo } from "react";

import CreateGroup from "@/app/components/create-group";
import DeleteGroup from "@/app/components/delete-group";
import CreateAuthor from "@/app/components/create-author";
import CreateGenre from "@/app/components/create-genre";
import CreateBook from "@/app/components/create-book";
import useBooksData from "@/app/hooks/use-books-data";
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

// Type definitions to improve type safety
interface DefaultGroup {
  name: string;
  href: string;
  icon: React.ComponentType;
}

const DEFAULT_GROUPS: DefaultGroup[] = [
  { name: "All Books", href: "/groups/all-books", icon: LibraryBig },
  { name: "Favorites", href: "/groups/favorites", icon: BookHeart },
  { name: "Authors", href: "/authors", icon: User },
  { name: "Genres", href: "/genres", icon: Tag },
];

export function AppSidebar() {
  const { groupId } = useParams();
  const { groupsQuery, booksQuery, authorsQuery, genresQuery, isLoading } =
    useBooksData();

  const pathname = usePathname();

  // State management for modals
  const [modalState, setModalState] = useState({
    createGroup: { isOpen: false, groupId: "", initialName: "" },
    deleteGroup: { isOpen: false, groupId: "" },
    createAuthor: { isOpen: false },
    createGenre: { isOpen: false },
    createBook: { isOpen: false },
  });

  // Memoized personal groups to avoid unnecessary re-renders
  const personalGroups = useMemo(
    () => groupsQuery.data?.filter((group) => !group.default) || [],
    [groupsQuery.data]
  );

  // Centralized modal management functions
  const openModal = useCallback(
    (modalName: keyof typeof modalState, params = {}) => {
      setModalState((prev) => ({
        ...prev,
        [modalName]: {
          ...prev[modalName],
          isOpen: true,
          ...params,
        },
      }));
    },
    []
  );

  const closeModal = useCallback((modalName: keyof typeof modalState) => {
    setModalState((prev) => ({
      ...prev,
      [modalName]: {
        ...prev[modalName],
        isOpen: false,
      },
    }));
  }, []);

  // Helper function to determine active state for default groups
  const isDefaultGroupActive = useCallback(
    (defaultGroup: DefaultGroup) => {
      return (
        groupId === defaultGroup.name.toLowerCase() ||
        (groupId === "all-books" && defaultGroup.name === "All Books") ||
        (pathname === "/authors" && defaultGroup.name === "Authors") ||
        (pathname === "/genres" && defaultGroup.name === "Genres")
      );
    },
    [groupId, pathname]
  );

  // Helper function to get badge count for default groups
  const getDefaultGroupBadgeCount = useCallback(
    (groupName: string) => {
      switch (groupName) {
        case "Authors":
          return authorsQuery.data?.length || 0;
        case "Genres":
          return genresQuery.data?.length || 0;
        case "All Books":
          return (
            groupsQuery.data?.find((group) => group.default)?.books.length || 0
          );
        case "Favorites":
          return booksQuery.data?.filter((book) => book.favorite).length || 0;
        default:
          return 0;
      }
    },
    [authorsQuery.data, genresQuery.data, groupsQuery.data, booksQuery.data]
  );

  return (
    <Sidebar>
      <SidebarContent>
        {/* Default Groups Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Default Groups</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DEFAULT_GROUPS.map((defaultGroup) => {
                const isActive = isDefaultGroupActive(defaultGroup);
                const badgeCount = getDefaultGroupBadgeCount(defaultGroup.name);

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
                        {badgeCount > 0 && (
                          <SidebarMenuBadge className="me-5">
                            {badgeCount}
                          </SidebarMenuBadge>
                        )}
                        <SidebarMenuAction
                          showOnHover
                          title={`Create ${defaultGroup.name.slice(0, -1)}`}
                          onClick={() => {
                            if (defaultGroup.name === "Authors") {
                              openModal("createAuthor");
                            } else if (defaultGroup.name === "Genres") {
                              openModal("createGenre");
                            }
                          }}
                        >
                          <Plus />
                        </SidebarMenuAction>
                      </>
                    ) : (
                      badgeCount > 0 && (
                        <SidebarMenuBadge>{badgeCount}</SidebarMenuBadge>
                      )
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Personal Groups Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Personal Groups</SidebarGroupLabel>
          <SidebarGroupAction
            title="Create Group"
            onClick={() => openModal("createGroup")}
          >
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
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

                    {group.books.length > 0 && (
                      <SidebarMenuBadge className="me-5">
                        {group.books.length}
                      </SidebarMenuBadge>
                    )}

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
                            openModal("createGroup", {
                              groupId: group.id,
                              initialName: group.name,
                            })
                          }
                        >
                          <span>Update</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            openModal("deleteGroup", {
                              groupId: group.id,
                            })
                          }
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

      {/* Sidebar Footer */}
      <SidebarFooter>
        <SidebarGroup className="flex flex-row items-center justify-between space-x-4">
          <ThemeToggler />
          <Button
            variant="outline"
            onClick={() => openModal("createBook")}
            className="w-full"
            disabled={isLoading}
          >
            Create Book
          </Button>
        </SidebarGroup>

        {/* Modal Components */}
        <CreateGroup
          open={modalState.createGroup.isOpen}
          onOpenChange={(open) =>
            open ? openModal("createGroup") : closeModal("createGroup")
          }
          groupId={modalState.createGroup.groupId}
          initialName={modalState.createGroup.initialName}
        />
        <DeleteGroup
          open={modalState.deleteGroup.isOpen}
          onOpenChange={(open) =>
            open ? openModal("deleteGroup") : closeModal("deleteGroup")
          }
          groupId={modalState.deleteGroup.groupId}
        />
        <CreateAuthor
          open={modalState.createAuthor.isOpen}
          onOpenChange={(open) =>
            open ? openModal("createAuthor") : closeModal("createAuthor")
          }
        />
        <CreateGenre
          open={modalState.createGenre.isOpen}
          onOpenChange={(open) =>
            open ? openModal("createGenre") : closeModal("createGenre")
          }
        />
        <CreateBook
          open={modalState.createBook.isOpen}
          onOpenChange={(open) =>
            open ? openModal("createBook") : closeModal("createBook")
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
