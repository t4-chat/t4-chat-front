import type { AdminServiceGetApiAdminUsageDefaultResponse } from "~/openapi/queries/common";
import type { AggregationType } from "~/openapi/requests/types.gen";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { formatDate } from "@/utils/date";

interface UsageChartsProps {
  usage: NonNullable<AdminServiceGetApiAdminUsageDefaultResponse>;
  aggregation: AggregationType;
}

// Better looking color palette
const COLORS = {
  chart1: "#3b82f6", // Blue
  chart2: "#10b981", // Emerald
  chart3: "#f59e0b", // Amber
  chart4: "#ef4444", // Red
  chart5: "#8b5cf6", // Violet
};

const chartConfig = {
  prompt_tokens: {
    label: "Prompt Tokens",
    color: COLORS.chart1,
  },
  completion_tokens: {
    label: "Completion Tokens",
    color: COLORS.chart2,
  },
  total_tokens: {
    label: "Total Tokens",
    color: COLORS.chart3,
  },
};

export const UsageCharts = ({ usage, aggregation }: UsageChartsProps) => {
  // Check for empty data state
  if (!usage.data || usage.data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 h-[400px] text-muted-foreground">
        <div className="text-center">
          <div className="mb-4 text-6xl">📊</div>
          <h3 className="mb-2 font-medium text-foreground text-lg">
            No Data Available
          </h3>
          <p className="max-w-md text-sm">
            There's no usage data to display for the selected {aggregation}{" "}
            aggregation period. Try selecting a different time range or check
            back later.
          </p>
        </div>
      </div>
    );
  }

  // Time-based aggregations use line charts
  const isTimeBased = ["minute", "hour", "day", "week", "month"].includes(
    aggregation,
  );

  // Model aggregation uses pie chart
  const isModelAggregation = aggregation === "model";

  // User aggregation uses bar chart
  const isUserAggregation = aggregation === "user";

  if (isTimeBased) {
    // Prepare data for time-based line chart
    const lineData = usage.data.map((item) => ({
      date: item.date ? formatDate(new Date(item.date)) : "Unknown",
      prompt_tokens: item.prompt_tokens,
      completion_tokens: item.completion_tokens,
      total_tokens: item.total_tokens,
    }));

    return (
      <div className="space-y-4">
        <ChartContainer config={chartConfig} className="w-full h-[400px]">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="prompt_tokens"
              stroke={COLORS.chart1}
              strokeWidth={2}
              dot={{ fill: COLORS.chart1, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: COLORS.chart1 }}
            />
            <Line
              type="monotone"
              dataKey="completion_tokens"
              stroke={COLORS.chart2}
              strokeWidth={2}
              dot={{ fill: COLORS.chart2, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: COLORS.chart2 }}
            />
            <Line
              type="monotone"
              dataKey="total_tokens"
              stroke={COLORS.chart3}
              strokeWidth={2}
              dot={{ fill: COLORS.chart3, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: COLORS.chart3 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    );
  }

  if (isModelAggregation) {
    // Prepare data for model horizontal bar chart
    const barData = usage.data
      .map((item, index) => ({
        name: item.model_name || item.model_id || `Model ${index + 1}`,
        total_tokens: item.total_tokens,
        prompt_tokens: item.prompt_tokens,
        completion_tokens: item.completion_tokens,
      }))
      .sort((a, b) => b.total_tokens - a.total_tokens); // Sort by total tokens descending

    // Calculate total tokens across all models for percentage calculation
    const totalTokensAllModels = barData.reduce(
      (sum, item) => sum + item.total_tokens,
      0,
    );

    // Add percentage to each item
    const barDataWithPercentage = barData.map((item) => ({
      ...item,
      percentage:
        totalTokensAllModels > 0
          ? (item.total_tokens / totalTokensAllModels) * 100
          : 0,
    }));

    return (
      <div className="space-y-4">
        <ChartContainer config={chartConfig} className="w-full h-[600px]">
          <BarChart data={barDataWithPercentage} maxBarSize={40}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, textAnchor: "end" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              angle={-45}
              height={80}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0]?.payload;
                  if (!data) return null;
                  return (
                    <div className="bg-background shadow-xl px-3 py-2 border border-border/50 rounded-lg">
                      <div className="font-medium">{data.name}</div>
                      <div className="gap-1 grid text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Total Tokens:
                          </span>
                          <span className="font-mono">
                            {data.total_tokens.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Percentage:
                          </span>
                          <span className="font-mono font-bold text-primary">
                            {data.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prompt:</span>
                          <span className="font-mono">
                            {data.prompt_tokens.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Completion:
                          </span>
                          <span className="font-mono">
                            {data.completion_tokens.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="prompt_tokens"
              stackId="tokens"
              fill={COLORS.chart1}
              name="Prompt Tokens"
            />
            <Bar
              dataKey="completion_tokens"
              stackId="tokens"
              fill={COLORS.chart2}
              name="Completion Tokens"
            />
          </BarChart>
        </ChartContainer>
      </div>
    );
  }

  if (isUserAggregation) {
    // Prepare data for user stacked bar chart
    const barData = usage.data.map((item, index) => ({
      name: item.user_email || item.user_id || `User ${index + 1}`,
      prompt_tokens: item.prompt_tokens,
      completion_tokens: item.completion_tokens,
      total_tokens: item.total_tokens,
    }));

    return (
      <div className="space-y-4">
        <ChartContainer config={chartConfig} className="w-full h-[400px]">
          <BarChart data={barData} maxBarSize={40}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="prompt_tokens"
              stackId="tokens"
              fill={COLORS.chart1}
              name="Prompt Tokens"
            />
            <Bar
              dataKey="completion_tokens"
              stackId="tokens"
              fill={COLORS.chart2}
              name="Completion Tokens"
            />
          </BarChart>
        </ChartContainer>
      </div>
    );
  }

  // Fallback for unknown aggregation types
  return (
    <div className="flex justify-center items-center h-[400px] text-muted-foreground">
      <p>Chart visualization not available for this aggregation type.</p>
    </div>
  );
};
