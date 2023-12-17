"use client";
import {
  LayoutHeadContainer,
  LayoutTitle,
} from "@/components/backoffice/theme";
import { Card } from "@/components/ui/card";
import { Form, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { actionQuery, handleActionError } from "@/lib/actions";
import { useSearchParams } from "@/lib/url";
import {
  getSiteConfigBackoffice,
  setSiteConfigBackoffice,
} from "@/server/actions/site-config";
import {
  EDGE_CONFIG,
  EDGE_CONFIG_GROUP_ID,
  TEdgeConfigGroupId,
  TEdgeConfigKey,
} from "@/static/edge-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function BackofficeSystemPreferencesSiteConfigClient() {
  const searchParams = useSearchParams({
    group: EDGE_CONFIG_GROUP_ID[0] as TEdgeConfigGroupId,
  });
  return (
    <>
      <LayoutHeadContainer
        left={
          <>
            <LayoutTitle>Site Config</LayoutTitle>
          </>
        }
      />

      <Tabs
        value={searchParams.get("group")}
        onValueChange={(value) =>
          searchParams.set("group", value as TEdgeConfigGroupId)
        }
        className="flex-1 space-y-3 flex flex-col"
      >
        <Card className="w-fit">
          <TabsList>
            {EDGE_CONFIG_GROUP_ID.map((group) => (
              <TabsTrigger value={group} key={group}>
                {group}
              </TabsTrigger>
            ))}
          </TabsList>
        </Card>
        <Card className="p-5 pt-4 flex-1">
          <TabsContent value={EDGE_CONFIG_GROUP_ID[0]}>
            <SiteConfigBoolean id="allowSignUp" />
          </TabsContent>
        </Card>
      </Tabs>
    </>
  );
}

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
