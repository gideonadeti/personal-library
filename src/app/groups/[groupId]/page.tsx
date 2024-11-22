"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useEffect } from "react";

import { readGroups } from "@/app/utils/query-functions";
import { Group } from "@/app/types";

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

  useEffect(() => {
    if (groupsStatus === "error") {
      const errorMessage =
        (groupsError?.response?.data as { error: string })?.error ||
        "Something went wrong";

      toast({
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [groupsError, groupsStatus, toast]);

  return <div>{groups?.length}</div>;
}
