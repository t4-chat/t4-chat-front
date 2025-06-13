import { useAdminServiceGetApiAdminBudget } from "~/openapi/queries/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BudgetCard = () => {
  const { data: budget, isLoading: budgetLoading } =
    useAdminServiceGetApiAdminBudget();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget</CardTitle>
      </CardHeader>
      <CardContent>
        {budgetLoading ? (
          <p>Loading...</p>
        ) : budget ? (
          <p className="font-medium text-lg">
            {budget.usage} used of {budget.budget}
          </p>
        ) : (
          <p>No budget data.</p>
        )}
      </CardContent>
    </Card>
  );
};
