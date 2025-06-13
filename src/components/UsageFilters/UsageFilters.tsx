import type { AggregationType } from "~/openapi/requests/types.gen";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, BarChart3 } from "lucide-react";

interface UsageFiltersProps {
  aggregation: AggregationType;
  onAggregationChange: (aggregation: AggregationType) => void;
  startDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  endDate?: Date;
  onEndDateChange: (date: Date | undefined) => void;
  userId: string;
  onUserIdChange: (userId: string) => void;
  modelId: string;
  onModelIdChange: (modelId: string) => void;
  viewMode: "table" | "chart";
  onViewModeChange: (mode: "table" | "chart") => void;
}

export const UsageFilters = ({
  aggregation,
  onAggregationChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  userId,
  onUserIdChange,
  modelId,
  onModelIdChange,
  viewMode,
  onViewModeChange,
}: UsageFiltersProps) => {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div>
        <label className="block mb-1 text-sm" htmlFor="aggregation">
          Aggregation
        </label>
        <Select
          value={aggregation}
          onValueChange={(value) =>
            onAggregationChange(value as AggregationType)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["minute", "hour", "day", "week", "month", "model", "user"].map(
              (a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1 text-sm" htmlFor="start">
          Start
        </label>
        <DatePicker date={startDate} onDateChange={onStartDateChange} />
      </div>
      <div>
        <label className="block mb-1 text-sm" htmlFor="end">
          End
        </label>
        <DatePicker date={endDate} onDateChange={onEndDateChange} />
      </div>
      <div>
        <label className="block mb-1 text-sm" htmlFor="user">
          User ID
        </label>
        <input
          id="user"
          type="text"
          className="p-2 border rounded"
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm" htmlFor="model">
          Model ID
        </label>
        <input
          id="model"
          type="number"
          className="p-2 border rounded"
          value={modelId}
          onChange={(e) => onModelIdChange(e.target.value)}
        />
      </div>
      <div>
        <div className="block mb-1 font-medium text-sm">View</div>
        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("table")}
            className="border-0 rounded-none"
          >
            <Table className="mr-1 w-4 h-4" />
            Table
          </Button>
          <Button
            variant={viewMode === "chart" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("chart")}
            className="border-0 rounded-none"
          >
            <BarChart3 className="mr-1 w-4 h-4" />
            Chart
          </Button>
        </div>
      </div>
    </div>
  );
};
