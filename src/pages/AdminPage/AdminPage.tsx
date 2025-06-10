import {
  useAdminServiceGetApiAdminBudget,
  useAdminServiceGetApiAdminUsage,
} from "~/openapi/queries/queries";
import type { AggregationType } from "~/openapi/requests/types.gen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/date";
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

export const AdminPage = () => {
  const [aggregation, setAggregation] = useState<AggregationType>("day");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [userId, setUserId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");

  const { data: budget, isLoading: budgetLoading } =
    useAdminServiceGetApiAdminBudget();
  const { data: usage, isLoading: usageLoading } =
    useAdminServiceGetApiAdminUsage({
      aggregation,
      startDate: startDate ? startDate.toISOString().split("T")[0] : undefined,
      endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
      userId: userId || undefined,
      modelId: modelId ? Number(modelId) : undefined,
    });

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent>
          {budgetLoading ? (
            <p>Loading...</p>
          ) : budget ? (
            <p className="text-lg font-medium">
              {budget.usage} used of {budget.budget}
            </p>
          ) : (
            <p>No budget data.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm mb-1" htmlFor="aggregation">
                Aggregation
              </label>
              <select
                id="aggregation"
                className="border rounded p-2"
                value={aggregation}
                onChange={(e) =>
                  setAggregation(e.target.value as AggregationType)
                }
              >
                {[
                  "minute",
                  "hour",
                  "day",
                  "week",
                  "month",
                  "model",
                  "user",
                ].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="start">
                Start
              </label>
              <DatePicker date={startDate} onDateChange={setStartDate} />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="end">
                End
              </label>
              <DatePicker date={endDate} onDateChange={setEndDate} />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="user">
                User ID
              </label>
              <input
                id="user"
                type="text"
                className="border rounded p-2"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="model">
                Model ID
              </label>
              <input
                id="model"
                type="number"
                className="border rounded p-2"
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
              />
            </div>
          </div>
          {usageLoading ? (
            <p>Loading...</p>
          ) : usage ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className="text-right">Prompt</TableHead>
                    <TableHead className="text-right">Completion</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usage.data.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {row.date ? formatDate(new Date(row.date)) : "-"}
                      </TableCell>
                      <TableCell>
                        {row.user_email || row.user_id || "-"}
                      </TableCell>
                      <TableCell>
                        {row.model_name || row.model_id || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.prompt_tokens}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.completion_tokens}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.total_tokens}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="font-semibold">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {usage.total.prompt_tokens}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {usage.total.completion_tokens}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {usage.total.total_tokens}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No usage data.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
