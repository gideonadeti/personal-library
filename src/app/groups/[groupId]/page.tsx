"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useEffect } from "react";

import { readGroups, readAuthors } from "@/app/utils/query-functions";
import { Group, Author } from "@/app/types";

export default function Page() {
  const { user } = useUser();
  const { toast } = useToast();

  const {
    status: groupsStatus,
    data: groups,
    error: groupsError,
  } = useQuery<Group[], AxiosError>({
    queryKey: ["groups"],
    queryFn: () => readGroups(user!.id),
  });
  const { status: authorsStatus, error: authorsError } = useQuery<
    Author[],
    AxiosError
  >({
    queryKey: ["authors"],
    queryFn: () => readAuthors(user!.id),
  });

  useEffect(() => {
    if (groupsStatus === "error" || authorsStatus === "error") {
      const errorMessage =
        (groupsError?.response?.data as { errMsg: string })?.errMsg ||
        (authorsError?.response?.data as { errMsg: string })?.errMsg ||
        "Something went wrong";

      toast({
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [groupsError, groupsStatus, authorsError, authorsStatus, toast]);

  return <div>{groups?.length}</div>;
}
