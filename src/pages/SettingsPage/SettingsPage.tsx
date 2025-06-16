import type { FC } from "react";
import { useState, useContext, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { SidebarContext } from "@/components/Layout/Layout";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BarChart3,
  Shield,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Zap,
  TrendingUp,
  CheckCircle,
  Key,
  Server,
} from "lucide-react";
import { providerIconPaths } from "@/assets/icons/ai-providers/index";
import {
  useUtilizationServiceGetApiUtilization,
  useHostApiKeysServiceGetApiHostApiKeys,
  useHostApiKeysServicePostApiHostApiKeys,
  useHostApiKeysServicePutApiHostApiKeysByKeyId,
  useHostApiKeysServiceDeleteApiHostApiKeysByKeyId,
  useAdminServiceGetApiAdminModelHosts,
  useAiModelsServiceGetApiAiModels,
} from "../../../openapi/queries/queries";
import type {
  HostApiKeyCreateSchema,
  HostApiKeyResponseSchema,
  HostApiKeyUpdateSchema,
} from "~/openapi/requests/types.gen";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";

const SettingsPage: FC = () => {
  const [activeTab, setActiveTab] = useState<"utilization" | "api-keys">(
    "utilization",
  );
  const [editingKey, setEditingKey] = useState<HostApiKeyResponseSchema | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    keyId: string | null;
    keyName: string;
  }>({
    isOpen: false,
    keyId: null,
    keyName: "",
  });
  const { isOpen: isSidebarOpen } = useContext(SidebarContext);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch utilization data
  const { data: utilization, isLoading: utilizationLoading } =
    useUtilizationServiceGetApiUtilization();

  // Fetch API keys
  const {
    data: apiKeys = [],
    isLoading: apiKeysLoading,
    refetch: refetchApiKeys,
  } = useHostApiKeysServiceGetApiHostApiKeys();
  // Fetch model hosts for the dropdown
  const { data: modelHosts = [], isLoading: modelHostsLoading } =
    useAdminServiceGetApiAdminModelHosts();

  // Fetch model information
  const { data: models = [] } = useAiModelsServiceGetApiAiModels();

  // Mutations
  const createApiKeyMutation = useHostApiKeysServicePostApiHostApiKeys({
    onSuccess: () => {
      setIsCreating(false);
      refetchApiKeys();
    },
  });

  const updateApiKeyMutation = useHostApiKeysServicePutApiHostApiKeysByKeyId({
    onSuccess: () => {
      setEditingKey(null);
      refetchApiKeys();
    },
  });

  const deleteApiKeyMutation = useHostApiKeysServiceDeleteApiHostApiKeysByKeyId(
    {
      onSuccess: () => {
        setEditingKey(null);
        setDeleteModalState({ isOpen: false, keyId: null, keyName: "" });
        refetchApiKeys();
      },
    },
  );

  const handleDeleteModal = (keyId: string, keyName: string) => {
    setDeleteModalState({ isOpen: true, keyId, keyName });
  };

  const handleDeleteApiKey = async () => {
    if (deleteModalState.keyId) {
      deleteApiKeyMutation.mutate({ keyId: deleteModalState.keyId });
    }
  };

  // Helper function to get host icon based on name/slug
  const getHostIcon = (hostName: string) => {
    const name = hostName.toLowerCase();
    let iconPath = providerIconPaths.default;

    if (name.includes("openai") || name.includes("gpt")) {
      iconPath = providerIconPaths.openai;
    } else if (name.includes("anthropic") || name.includes("claude")) {
      iconPath = providerIconPaths.anthropic;
    } else if (
      name.includes("google") ||
      name.includes("gemini") ||
      name.includes("bard")
    ) {
      iconPath = providerIconPaths.gemini;
    } else if (name.includes("meta") || name.includes("llama")) {
      iconPath = providerIconPaths.meta;
    } else if (name.includes("mistral")) {
      iconPath = providerIconPaths.mistral;
    } else if (name.includes("deepseek")) {
      iconPath = providerIconPaths.deepseek;
    } else if (name.includes("xai") || name.includes("grok")) {
      iconPath = providerIconPaths.xai;
    } else if (name.includes("aws") || name.includes("nova")) {
      iconPath = providerIconPaths.awsnova;
    } else if (name.includes("ollama")) {
      iconPath = providerIconPaths.ollama;
    } else if (name.includes("openrouter")) {
      iconPath = providerIconPaths.openrouter;
    } else if (name.includes("groq")) {
      iconPath = providerIconPaths.groq;
    }

    return (
      <img
        src={iconPath}
        alt={`${hostName} icon`}
        className="w-4 h-4 object-contain"
      />
    );
  };

  // Helper function to get model name from ID
  const getModelName = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    return model?.name || modelId;
  };

  // Helper function to get status color, icon, and explanation
  const getUtilizationStatus = (percentage: number) => {
    if (percentage >= 90)
      return {
        border: "border-red-400 dark:border-red-500",
        fill: "bg-red-400 dark:bg-red-500",
        icon: (
          <AlertTriangle className="w-4 h-4 text-red-400 dark:text-red-300" />
        ),
        status: "Critical",
        explanation: "Near or over token limit",
      };
    if (percentage >= 70)
      return {
        border: "border-orange-400 dark:border-orange-500",
        fill: "bg-orange-400 dark:bg-orange-500",
        icon: <Zap className="w-5 h-5 text-orange-400 dark:text-orange-300" />,
        status: "High",
        explanation: "High usage, approaching limit",
      };
    if (percentage >= 40)
      return {
        border: "border-blue-400 dark:border-blue-500",
        fill: "bg-blue-400 dark:bg-blue-500",
        icon: (
          <BarChart3 className="w-5 h-5 text-blue-400 dark:text-blue-300" />
        ),
        status: "Moderate",
        explanation: "Moderate usage",
      };
    return {
      border: "border-green-400 dark:border-green-500",
      fill: "bg-green-400 dark:bg-green-500",
      icon: (
        <CheckCircle className="w-5 h-5 text-green-400 dark:text-green-300" />
      ),
      status: "Healthy",
      explanation: "Low usage",
    };
  };

  const ApiKeyForm: FC<{
    initialData?: HostApiKeyResponseSchema;
    onSubmit: (data: HostApiKeyCreateSchema | HostApiKeyUpdateSchema) => void;
    onCancel: () => void;
    isSubmitting: boolean;
  }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const form = useForm({
      defaultValues: {
        host_id: initialData?.host_id || "",
        name: initialData?.name || "",
        api_key: "",
        is_active: initialData?.is_active ?? true,
      },
      onSubmit: async ({ value }) => {
        if (initialData) {
          // Update - only include changed fields
          const updateData: HostApiKeyUpdateSchema = {};
          if (value.name !== initialData.name) updateData.name = value.name;
          if (value.api_key) updateData.api_key = value.api_key;
          if (value.is_active !== initialData.is_active)
            updateData.is_active = value.is_active;
          onSubmit(updateData);
        } else {
          // Create
          onSubmit(value as HostApiKeyCreateSchema);
        }
      },
    });

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="gap-4 grid">
          <form.Field name="host_id">
            {(field) => (
              <div className="space-y-1.5">
                <label
                  htmlFor="host-id"
                  className="font-medium text-[var(--text-color)] text-base"
                >
                  Model Host <span className="text-red-500">*</span>
                </label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                  disabled={modelHostsLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Model Host" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelHosts.map((host) => (
                      <SelectItem
                        key={host.id}
                        value={host.id}
                        className="pl-2"
                      >
                        <div className="flex items-center gap-2">
                          {getHostIcon(host.name)}
                          <span>{host.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="name">
            {(field) => (
              <div className="space-y-1.5">
                <label
                  htmlFor="key-name"
                  className="font-medium text-[var(--text-color)] text-sm"
                >
                  Key Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="key-name"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="My API Key"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="api_key">
            {(field) => (
              <div className="space-y-1.5">
                <label
                  htmlFor="api-key"
                  className="font-medium text-[var(--text-color)] text-sm"
                >
                  API Key{" "}
                  {!initialData && <span className="text-red-500">*</span>}
                </label>
                <Input
                  id="api-key"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={
                    initialData
                      ? "Leave empty to keep current key"
                      : "Enter your API key"
                  }
                />
              </div>
            )}
          </form.Field>

          {initialData && (
            <form.Field name="is_active">
              {(field) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-active"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                  />
                  <label
                    htmlFor="is-active"
                    className="font-medium text-[var(--text-color)] text-sm"
                  >
                    Active
                  </label>
                </div>
              )}
            </form.Field>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-[var(--background-color)] transition-all duration-75",
        { "md:pl-64": isSidebarOpen },
      )}
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="mx-auto p-8 max-w-5xl">
        <div className="space-y-3 mb-8">
          <h1 className="font-bold text-[var(--text-color)] text-4xl tracking-tight">
            Settings
          </h1>
          <p className="text-[var(--text-secondary-color)] text-lg leading-relaxed">
            Manage your account settings and API keys
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "utilization" | "api-keys")
          }
        >
          <TabsList className="grid grid-cols-2 bg-[var(--component-bg-color)] mx-auto p-1 border border-[var(--border-color)] rounded-xl w-full max-w-md">
            <TabsTrigger
              value="utilization"
              className={cn(
                "data-[state=active]:bg-[var(--primary-color)] data-[state=active]:shadow-sm rounded-lg font-medium text-[var(--text-secondary-color)] data-[state=active]:text-white",
                isMounted && "transition-all duration-100",
              )}
            >
              Usage & Limits
            </TabsTrigger>
            <TabsTrigger
              value="api-keys"
              className={cn(
                "data-[state=active]:bg-[var(--primary-color)] data-[state=active]:shadow-sm rounded-lg font-medium text-[var(--text-secondary-color)] data-[state=active]:text-white",
                isMounted && "transition-all duration-100",
              )}
            >
              API Keys
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="utilization"
            className={cn(
              "space-y-6 mt-8",
              isMounted &&
                "animate-in fade-in-0 slide-in-from-bottom-2 duration-75",
            )}
          >
            <Card className="bg-[var(--component-bg-color)] shadow-lg border-[var(--border-color)] rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[var(--primary-color)]/5 to-[var(--primary-color)]/10 pb-6 border-[var(--border-color)] border-b">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-[var(--primary-color)]/10 rounded-lg w-10 h-10">
                    <BarChart3 className="w-5 h-5 text-[var(--primary-color)]" />
                  </div>
                  <div>
                    <CardTitle className="font-semibold text-[var(--text-color)] text-xl">
                      Current Usage
                    </CardTitle>
                    <p className="mt-1 text-[var(--text-secondary-color)] text-sm">
                      Monitor your model token consumption
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {utilizationLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="space-y-3 text-center">
                      <div className="mx-auto border-[var(--primary-color)] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
                      <p className="text-[var(--text-secondary-color)]">
                        Loading utilization data...
                      </p>
                    </div>
                  </div>
                ) : utilization ? (
                  // Group utilization by provider
                  (() => {
                    // Map model_id to model and provider
                    const modelMap = models.reduce(
                      (acc, model) => {
                        acc[model.id] = model;
                        return acc;
                      },
                      {} as Record<string, (typeof models)[number]>,
                    );
                    // Group by provider name
                    const grouped: Record<
                      string,
                      {
                        providerName: string;
                        providerSlug: string;
                        utilizations: typeof utilization.utilizations;
                      }
                    > = {};
                    for (const util of utilization.utilizations) {
                      const model = modelMap[util.model_id];
                      const providerName = model?.provider?.name || "Unknown";
                      const providerSlug = model?.provider?.slug || "unknown";
                      if (!grouped[providerName]) {
                        grouped[providerName] = {
                          providerName,
                          providerSlug,
                          utilizations: [],
                        };
                      }
                      grouped[providerName].utilizations.push(util);
                    }
                    return (
                      <div className="space-y-8">
                        {Object.values(grouped).map((group) => (
                          <div key={group.providerName}>
                            <div className="flex items-center gap-2 mb-4">
                              <img
                                src={
                                  providerIconPaths[
                                    group.providerSlug as keyof typeof providerIconPaths
                                  ] || providerIconPaths.default
                                }
                                alt={`${group.providerName} icon`}
                                className="w-6 h-6 object-contain"
                              />
                              <span className="font-semibold text-[var(--text-color)] text-lg">
                                {group.providerName}
                              </span>
                            </div>
                            <div className="gap-4 grid md:grid-cols-1 lg:grid-cols-2">
                              {group.utilizations.map((util) => {
                                const modelName = getModelName(util.model_id);
                                const modelIcon = getHostIcon(modelName);
                                return (
                                  <div
                                    key={util.model_id}
                                    className="relative to-[var(--component-bg-color)]/30 bg-gradient-to-br from-[var(--background-color)] p-6 border border-[var(--border-color)] rounded-xl"
                                  >
                                    <div className="flex justify-between items-start mb-4">
                                      <div className="flex items-center gap-3">
                                        <span className="flex justify-center items-center w-5 h-5">
                                          {modelIcon}
                                        </span>
                                        <span className="font-bold text-[var(--text-color)] text-lg">
                                          {modelName}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary-color)]">
                                          Tokens used
                                        </span>
                                        <span className="font-medium text-[var(--text-color)]">
                                          {util.total_tokens.toLocaleString()} /{" "}
                                          {util.max_tokens.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="relative">
                                        <div className="bg-[var(--border-color)] rounded-full h-2 overflow-hidden">
                                          <div
                                            className={`relative rounded-full h-2 overflow-hidden transition-all duration-1000 ease-out ${getUtilizationStatus(util.percentage).fill}`}
                                            style={{
                                              width: `${Math.min(util.percentage * 100, 100)}%`,
                                            }}
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex justify-between text-[var(--text-secondary-color)] text-xs">
                                        <span>0%</span>
                                        <span>100%</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex flex-col justify-center items-center py-12 text-center">
                    <div className="flex justify-center items-center bg-[var(--component-bg-color)] mb-4 rounded-full w-16 h-16">
                      <TrendingUp className="w-8 h-8 text-[var(--text-secondary-color)]" />
                    </div>
                    <p className="mb-2 text-[var(--text-secondary-color)] text-lg">
                      No utilization data available.
                    </p>
                    <p className="text-[var(--text-secondary-color)] text-sm">
                      Usage statistics will appear here once you start using
                      models.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="api-keys"
            className={cn(
              "space-y-6 mt-8",
              isMounted &&
                "animate-in fade-in-0 slide-in-from-bottom-2 duration-75",
            )}
          >
            <Card className="bg-[var(--component-bg-color)] shadow-lg border-[var(--border-color)] rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row justify-between items-center bg-gradient-to-r from-[var(--primary-color)]/5 to-[var(--primary-color)]/10 pb-6 border-[var(--border-color)] border-b">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-[var(--primary-color)]/10 rounded-lg w-10 h-10">
                    <Shield className="w-5 h-5 text-[var(--primary-color)]" />
                  </div>
                  <div>
                    <CardTitle className="font-semibold text-[var(--text-color)] text-xl">
                      Bring Your Own API Keys
                    </CardTitle>
                    <p className="mt-1 text-[var(--text-secondary-color)] text-sm leading-relaxed">
                      Add your own API keys to use with supported models
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsCreating(true)}
                  disabled={isCreating || !!editingKey}
                  className="px-6 py-2"
                >
                  <Plus className="w-4 h-4" />
                  Add API Key
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {(isCreating || editingKey) && (
                  <div className="bg-gradient-to-br from-[var(--background-color)] to-[var(--background-color)]/50 shadow-md mb-6 p-6 border border-[var(--primary-color)]/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex justify-center items-center bg-[var(--primary-color)]/10 rounded-lg w-8 h-8">
                        {editingKey ? (
                          <Edit2 className="w-4 h-4 text-[var(--text-color)]" />
                        ) : (
                          <Plus className="w-4 h-4 text-[var(--text-color)]" />
                        )}
                      </div>
                      <h3 className="font-semibold text-[var(--text-color)] text-lg">
                        {editingKey ? "Edit API Key" : "Add New API Key"}
                      </h3>
                    </div>
                    <ApiKeyForm
                      initialData={editingKey || undefined}
                      onSubmit={(data) => {
                        if (editingKey) {
                          updateApiKeyMutation.mutate({
                            keyId: editingKey.id,
                            requestBody: data as HostApiKeyUpdateSchema,
                          });
                        } else {
                          createApiKeyMutation.mutate({
                            requestBody: data as HostApiKeyCreateSchema,
                          });
                        }
                      }}
                      onCancel={() => {
                        setIsCreating(false);
                        setEditingKey(null);
                      }}
                      isSubmitting={
                        createApiKeyMutation.isPending ||
                        updateApiKeyMutation.isPending
                      }
                    />
                  </div>
                )}

                {apiKeysLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="space-y-3 text-center">
                      <div className="mx-auto border-[var(--primary-color)] border-2 border-t-transparent rounded-full w-8 h-8 animate-spin" />
                      <p className="text-[var(--text-secondary-color)]">
                        Loading API keys...
                      </p>
                    </div>
                  </div>
                ) : apiKeys.length > 0 ? (
                  <div className="gap-6 grid md:grid-cols-1 lg:grid-cols-2">
                    {apiKeys.map((key) => {
                      const hostName =
                        modelHosts.find((h) => h.id === key.host_id)?.name ||
                        key.host_id;
                      return (
                        <div
                          key={key.id}
                          className="group relative to-[var(--component-bg-color)]/30 bg-gradient-to-br from-[var(--background-color)] p-6 border border-[var(--border-color)] rounded-xl transition-all duration-200"
                        >
                          {/* Header Section */}
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-start gap-4">
                              <div className="flex justify-center items-center bg-gradient-to-br from-[var(--primary-color)]/15 rounded-xl w-12 h-12 transition-colors duration-200">
                                <Key className="w-6 h-6 text-[var(--primary-color)]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="mb-2 font-bold text-[var(--text-color)] text-lg truncate leading-tight">
                                  {key.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                                      key.is_active
                                        ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/30"
                                        : "bg-gray-50 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/30"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        key.is_active
                                          ? "bg-green-500 dark:bg-green-400"
                                          : "bg-gray-400 dark:bg-gray-500"
                                      }`}
                                    />
                                    {key.is_active ? "Active" : "Inactive"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-[var(--text-secondary-color)] text-sm">
                                Provider
                              </span>
                              <div className="flex items-center gap-2 bg-[var(--component-bg-color)] px-3 py-2 rounded-lg font-medium text-[var(--text-color)] text-sm transition-colors">
                                {getHostIcon(hostName)}
                                <span className="max-w-32 truncate">
                                  {hostName}
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="font-medium text-[var(--text-secondary-color)] text-sm">
                                Created
                              </span>
                              <span className="font-medium text-[var(--text-color)] text-sm">
                                {new Date(key.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Actions Section */}
                          <div className="flex gap-3 pt-4 border-[var(--border-color)] border-t">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setEditingKey(key)}
                              disabled={isCreating || !!editingKey}
                              className="flex-1 gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteModal(key.id, key.name)
                              }
                              disabled={deleteApiKeyMutation.isPending}
                              className="flex-1 gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center py-16 text-center">
                    <div className="flex justify-center items-center bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--primary-color)]/5 mb-6 rounded-2xl w-20 h-20">
                      <Shield className="w-12 h-12 text-[var(--text-secondary-color)]" />
                    </div>
                    <h3 className="mb-2 font-semibold text-[var(--text-color)] text-xl">
                      No API keys configured yet
                    </h3>
                    <p className="mb-6 max-w-sm text-[var(--text-secondary-color)] text-sm">
                      Add your first API key to start using your own model
                      providers and get better control over costs.
                    </p>
                    <Button
                      onClick={() => setIsCreating(true)}
                      className="px-6 py-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First API Key
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() =>
          setDeleteModalState({ isOpen: false, keyId: null, keyName: "" })
        }
        onConfirm={handleDeleteApiKey}
        title="Delete API Key"
        message={`Are you sure you want to delete "${deleteModalState.keyName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger={true}
      />
    </div>
  );
};

export default SettingsPage;
