import { useAdminServiceGetApiAdminUsage } from "~/openapi/queries/queries";
import { LoadingOverlay } from "@/components/LoadingOverlay/LoadingOverlay";
import type { AggregationType } from "~/openapi/requests/types.gen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { UsageFilters } from "@/components/UsageFilters/UsageFilters";
import { UsageTable } from "@/components/UsageTable/UsageTable";
import { UsageCharts } from "@/components/UsageCharts";
import { keepPreviousData } from "@tanstack/react-query";

export const UsageCard = () => {
  const [aggregation, setAggregation] = useState<AggregationType>("day");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [userId, setUserId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  const {
    data: usage,
    isLoading: usageLoading,
    isFetching: usageFetching,
  } = useAdminServiceGetApiAdminUsage(
    {
      aggregation,
      startDate: startDate ? startDate.toISOString().split("T")[0] : undefined,
      endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
      userId: userId || undefined,
      modelId: modelId || undefined,
    },
    undefined,
    { staleTime: 5000, placeholderData: keepPreviousData },
  );

  const usageKey = JSON.stringify({
    aggregation,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    userId,
    modelId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsageFilters
          aggregation={aggregation}
          onAggregationChange={setAggregation}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          userId={userId}
          onUserIdChange={setUserId}
          modelId={modelId}
          onModelIdChange={setModelId}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        {usageLoading && !usage ? (
          <p>Loading...</p>
        ) : usage ? (
          <div className="relative">
            {usageFetching && <LoadingOverlay />}
            {viewMode === "table" ? (
              <UsageTable usage={usage} usageKey={usageKey} />
            ) : (
              <UsageCharts usage={usage} aggregation={aggregation} />
            )}
          </div>
        ) : (
          <p>No usage data.</p>
        )}
      </CardContent>
    </Card>
  );
};
