"use client";
import {
  LayoutHeadContainer,
  LayoutTitle,
} from "@/components/common/theme/dashboard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "@/lib/url";
import { EDGE_CONFIG_GROUP_ID, TEdgeConfigGroupId } from "@/static/edge-config";
import { SiteConfigBoolean } from "./inputs";

export default function SiteConfigClient() {
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
        className="flex-1 space-y-3"
      >
        <TabsList>
          {EDGE_CONFIG_GROUP_ID.map((group) => (
            <TabsTrigger value={group} key={group}>
              {group}
            </TabsTrigger>
          ))}
        </TabsList>
        <Card className="py-3 px-4">
          <TabsContent value={EDGE_CONFIG_GROUP_ID[0]}>
            <SiteConfigBoolean id="allowSignUp" />
          </TabsContent>
        </Card>
      </Tabs>
    </>
  );
}
