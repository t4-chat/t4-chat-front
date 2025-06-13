import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { formatDate } from "@/utils/date";
import type { AdminServiceGetApiAdminUsageDefaultResponse } from "~/openapi/queries/common";

interface UsageTableProps {
  usage: NonNullable<AdminServiceGetApiAdminUsageDefaultResponse>;
  usageKey: string;
}

type SortField = "date" | "user" | "model" | "prompt" | "completion" | "total";
type SortDirection = "asc" | "desc";

export const UsageTable = ({ usage, usageKey }: UsageTableProps) => {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Check for empty data state
  if (!usage.data || usage.data.length === 0) {
    return (
      <div
        key={`${usageKey}-empty`}
        className="flex flex-col justify-center items-center space-y-4 h-[400px] text-muted-foreground animate-in duration-300 fade-in"
      >
        <div className="text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h3 className="mb-2 font-medium text-foreground text-lg">
            No Usage Data
          </h3>
          <p className="max-w-md text-sm">
            There are no usage records to display for the selected period. Try
            adjusting your filters or check back later.
          </p>
        </div>
      </div>
    );
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "date" ? "desc" : "asc"); // Default to newest first for dates
    }
  };

  const sortedData = [...usage.data].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortField) {
      case "date":
        aValue = a.date ? new Date(a.date).getTime() : 0;
        bValue = b.date ? new Date(b.date).getTime() : 0;
        break;
      case "user":
        aValue = (a.user_email || a.user_id || "").toLowerCase();
        bValue = (b.user_email || b.user_id || "").toLowerCase();
        break;
      case "model":
        aValue = (a.model_name || a.model_id || "").toLowerCase();
        bValue = (b.model_name || b.model_id || "").toLowerCase();
        break;
      case "prompt":
        aValue = a.prompt_tokens || 0;
        bValue = b.prompt_tokens || 0;
        break;
      case "completion":
        aValue = a.completion_tokens || 0;
        bValue = b.completion_tokens || 0;
        break;
      case "total":
        aValue = a.total_tokens || 0;
        bValue = b.total_tokens || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-muted-foreground/50" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-muted-foreground" />
    ) : (
      <ChevronDown className="w-4 h-4 text-muted-foreground" />
    );
  };

  return (
    <>
      {/* Mobile Card Layout */}
      <div
        key={`${usageKey}-mobile`}
        className="md:hidden space-y-3 animate-in duration-300 fade-in"
      >
        {sortedData.map((row, idx) => (
          <div
            key={`${row.date ?? ""}-${row.user_id ?? ""}-${row.model_id ?? ""}-${idx}`}
            className="space-y-3 bg-card p-4 border rounded-lg"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 space-y-1 min-w-0">
                {/* Show date if available (time-based aggregations) */}
                {row.date && (
                  <h3 className="font-medium text-foreground">
                    {formatDate(new Date(row.date))}
                  </h3>
                )}

                {/* Show model if available (model aggregation or individual records) */}
                {(row.model_name || row.model_id) && (
                  <h3 className="font-medium text-foreground">
                    {row.model_name || row.model_id}
                  </h3>
                )}

                {/* Show user if available (user aggregation or individual records) */}
                {(row.user_email || row.user_id) && (
                  <h3 className="font-medium text-foreground">
                    {row.user_email || row.user_id}
                  </h3>
                )}

                {/* Show secondary info only if it exists and is different from primary */}
                <div className="space-y-1">
                  {row.date && (row.user_email || row.user_id) && (
                    <p className="text-muted-foreground text-sm truncate">
                      <span className="font-medium">User:</span>{" "}
                      {row.user_email || row.user_id}
                    </p>
                  )}
                  {row.date && (row.model_name || row.model_id) && (
                    <p className="text-muted-foreground text-sm truncate">
                      <span className="font-medium">Model:</span>{" "}
                      {row.model_name || row.model_id}
                    </p>
                  )}
                  {(row.model_name || row.model_id) &&
                    (row.user_email || row.user_id) &&
                    !row.date && (
                      <p className="text-muted-foreground text-sm truncate">
                        <span className="font-medium">User:</span>{" "}
                        {row.user_email || row.user_id}
                      </p>
                    )}
                  {(row.user_email || row.user_id) &&
                    (row.model_name || row.model_id) &&
                    !row.date && (
                      <p className="text-muted-foreground text-sm truncate">
                        <span className="font-medium">Model:</span>{" "}
                        {row.model_name || row.model_id}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Token Usage Grid */}
            <div className="gap-3 grid grid-cols-3 pt-2 border-t border-border">
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Prompt</p>
                <p className="font-mono font-medium text-sm">
                  {row.prompt_tokens?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Completion</p>
                <p className="font-mono font-medium text-sm">
                  {row.completion_tokens?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Total</p>
                <p className="font-mono font-medium text-primary dark:text-blue-400 text-sm">
                  {row.total_tokens?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Totals Card */}
        <div className="bg-muted/50 p-4 border border-border rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-foreground">Total Usage</h3>
          </div>
          <div className="gap-3 grid grid-cols-3">
            <div className="text-center">
              <p className="text-muted-foreground text-xs">Prompt</p>
              <p className="font-mono font-bold text-sm">
                {usage.total.prompt_tokens?.toLocaleString() || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-xs">Completion</p>
              <p className="font-mono font-bold text-sm">
                {usage.total.completion_tokens?.toLocaleString() || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-xs">Total</p>
              <p className="font-mono font-bold text-primary dark:text-blue-400 text-sm">
                {usage.total.total_tokens?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div
        key={`${usageKey}-desktop`}
        className="hidden md:block overflow-x-auto animate-in duration-300 fade-in"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {getSortIcon("date")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort("user")}
                >
                  User
                  {getSortIcon("user")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort("model")}
                >
                  Model
                  {getSortIcon("model")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors"
                  onClick={() => handleSort("prompt")}
                >
                  Prompt
                  {getSortIcon("prompt")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors"
                  onClick={() => handleSort("completion")}
                >
                  Completion
                  {getSortIcon("completion")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors"
                  onClick={() => handleSort("total")}
                >
                  Total
                  {getSortIcon("total")}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, idx) => (
              <TableRow
                key={`${row.date ?? ""}-${row.user_id ?? ""}-${row.model_id ?? ""}-${idx}`}
              >
                <TableCell>
                  {row.date ? formatDate(new Date(row.date)) : "-"}
                </TableCell>
                <TableCell>{row.user_email || row.user_id || "-"}</TableCell>
                <TableCell>{row.model_name || row.model_id || "-"}</TableCell>
                <TableCell className="text-right">
                  {row.prompt_tokens?.toLocaleString() || 0}
                </TableCell>
                <TableCell className="text-right">
                  {row.completion_tokens?.toLocaleString() || 0}
                </TableCell>
                <TableCell className="text-right">
                  {row.total_tokens?.toLocaleString() || 0}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="font-semibold">
                Total
              </TableCell>
              <TableCell className="font-semibold text-right">
                {usage.total.prompt_tokens?.toLocaleString() || 0}
              </TableCell>
              <TableCell className="font-semibold text-right">
                {usage.total.completion_tokens?.toLocaleString() || 0}
              </TableCell>
              <TableCell className="font-semibold text-right">
                {usage.total.total_tokens?.toLocaleString() || 0}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
};
