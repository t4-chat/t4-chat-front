import { useAdminServiceGetApiAdminBudget, useAdminServiceGetApiAdminUsage } from "~/openapi/queries/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils/date";

export const AdminPage = () => {
  const { data: budget, isLoading: budgetLoading } = useAdminServiceGetApiAdminBudget();
  const { data: usage, isLoading: usageLoading } = useAdminServiceGetApiAdminUsage();

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
        <CardContent>
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
                      <TableCell>{row.date ? formatDate(new Date(row.date)) : "-"}</TableCell>
                      <TableCell>{row.user_email || row.user_id || "-"}</TableCell>
                      <TableCell>{row.model_name || row.model_id || "-"}</TableCell>
                      <TableCell className="text-right">{row.prompt_tokens}</TableCell>
                      <TableCell className="text-right">{row.completion_tokens}</TableCell>
                      <TableCell className="text-right">{row.total_tokens}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="font-semibold">Total</TableCell>
                    <TableCell className="text-right font-semibold">{usage.total.prompt_tokens}</TableCell>
                    <TableCell className="text-right font-semibold">{usage.total.completion_tokens}</TableCell>
                    <TableCell className="text-right font-semibold">{usage.total.total_tokens}</TableCell>
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
