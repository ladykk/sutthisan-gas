"use client";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { actionQuery, handleActionError } from "@/lib/actions";
import {
  getSiteConfigBackoffice,
  setSiteConfigBackoffice,
} from "@/server/actions/site-config";
import { EDGE_CONFIG, TEdgeConfigKey } from "@/static/edge-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const SiteConfigBoolean = ({ id }: { id: TEdgeConfigKey }) => {
  const query = useQuery({
    queryKey: ["siteConfigBackoffice", id],
    queryFn: () => actionQuery(getSiteConfigBackoffice)([id]),
  });
  const [value, setValue] = useState<boolean>(false);
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (value: boolean) =>
      actionQuery(setSiteConfigBackoffice)([
        {
          key: id,
          value: value,
        },
      ]),
    onSuccess: (_, variable) => {
      toast({
        title: "Site Config Updated",
        variant: "success",
        description: `Site Config "${EDGE_CONFIG[id].label}" has been updated`,
      });
      setValue(variable);
    },
    onError: handleActionError(toast, undefined, "Site Config Update Failed"),
  });

  // Set value when query is loaded
  useEffect(() => {
    setValue(query.data?.[id] as boolean);
  }, [query.data?.[id]]);

  return (
    <FormItem>
      <Label className="flex items-center">
        {EDGE_CONFIG[id].label}{" "}
        {(query.isLoading || mutation.isPending) && (
          <Spinner className="ml-2" />
        )}
      </Label>
      <Switch
        checked={value}
        onCheckedChange={mutation.mutate}
        disabled={query.isLoading || mutation.isPending}
      />
    </FormItem>
  );
};
