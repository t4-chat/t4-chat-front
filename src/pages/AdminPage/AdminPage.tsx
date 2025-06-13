import { BudgetCard } from "@/components/BudgetCard/BudgetCard";
import { UsageCard } from "@/components/UsageCard/UsageCard";
import AiModelManagement from "@/components/AiModelManagement/AiModelManagement";
import HostManagement from "@/components/HostManagement/HostManagement";

export const AdminPage = () => {
  return (
    <div className="space-y-6 p-4">
      <BudgetCard />
      <UsageCard />
      <AiModelManagement />
      <HostManagement />
    </div>
  );
};
