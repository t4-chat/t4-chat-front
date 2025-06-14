import type { FC } from "react";
import { useState, useContext, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { SidebarContext } from "@/components/Layout/Layout";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  useUtilizationServiceGetApiUtilization,
  useHostApiKeysServiceGetApiHostApiKeys,
  useHostApiKeysServicePostApiHostApiKeys,
  useHostApiKeysServicePutApiHostApiKeysByKeyId,
  useHostApiKeysServiceDeleteApiHostApiKeysByKeyId,
  useAdminServiceGetApiAdminModelHosts,
} from "../../../openapi/queries/queries";
import type {
  HostApiKeyCreateSchema,
  HostApiKeyResponseSchema,
  HostApiKeyUpdateSchema,
} from "~/openapi/requests/types.gen";
import { LoadingOverlay } from "@/components/LoadingOverlay/LoadingOverlay";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";

export const SettingsPage: FC = () => {
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
                  className="font-medium text-[var(--text-color)] text-sm"
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
                      <SelectItem key={host.id} value={host.id}>
                        {host.name}
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
          <Button type="button" variant="outline" onClick={onCancel}>
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
                <CardTitle className="font-semibold text-[var(--text-color)] text-xl">
                  Current Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {utilizationLoading ? (
                  <p className="py-8 text-[var(--text-secondary-color)] text-center">
                    Loading utilization data...
                  </p>
                ) : utilization ? (
                  <div className="space-y-4">
                    {utilization.utilizations.map((util) => (
                      <div
                        key={util.model_id}
                        className="flex justify-between items-center bg-[var(--background-color)] hover:shadow-md p-5 border border-[var(--border-color)] rounded-xl transition-all duration-100"
                      >
                        <div>
                          <p className="font-semibold text-[var(--text-color)] text-lg">
                            Model: {util.model_id}
                          </p>
                          <p className="mt-1 text-[var(--text-secondary-color)] text-sm">
                            Tokens used: {util.total_tokens.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="mb-2 font-bold text-[var(--primary-color)] text-xl">
                            {util.percentage}%
                          </div>
                          <div className="bg-[var(--border-color)] rounded-full w-24 h-3">
                            <div
                              className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-hover)] rounded-full h-3 transition-all duration-75"
                              style={{
                                width: `${Math.min(util.percentage, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-[var(--text-secondary-color)] text-center">
                    No utilization data available.
                  </p>
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
                <div>
                  <CardTitle className="font-semibold text-[var(--text-color)] text-xl">
                    Bring Your Own API Keys
                  </CardTitle>
                  <p className="mt-2 text-[var(--text-secondary-color)] text-sm leading-relaxed">
                    Add your own API keys to use with supported models
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreating(true)}
                  disabled={isCreating || !!editingKey}
                  className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] shadow-md hover:shadow-lg px-6 py-2 rounded-lg font-medium text-white transition-all duration-100"
                >
                  Add API Key
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {(isCreating || editingKey) && (
                  <div className="bg-[var(--background-color)] shadow-md mb-6 p-6 border border-[var(--border-color)] rounded-xl">
                    <h3 className="mb-6 font-semibold text-[var(--text-color)] text-lg">
                      {editingKey ? "Edit API Key" : "Add New API Key"}
                    </h3>
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
                  <div className="relative">
                    <LoadingOverlay />
                    <p className="text-muted-foreground">Loading API keys...</p>
                  </div>
                ) : apiKeys.length > 0 ? (
                  <div className="space-y-4">
                    {apiKeys.map((key) => (
                      <div
                        key={key.id}
                        className="flex justify-between items-center bg-[var(--background-color)] hover:shadow-md p-5 border border-[var(--border-color)] rounded-xl transition-all duration-100"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-[var(--text-color)] text-lg">
                              {key.name}
                            </h4>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                key.is_active
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}
                            >
                              {key.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-[var(--text-secondary-color)] text-sm">
                            Host:{" "}
                            <span className="font-medium text-[var(--text-color)]">
                              {modelHosts.find((h) => h.id === key.host_id)
                                ?.name || key.host_id}
                            </span>
                          </p>
                          <p className="text-[var(--text-secondary-color)] text-xs">
                            Created:{" "}
                            {new Date(key.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingKey(key)}
                            disabled={isCreating || !!editingKey}
                            className="hover:bg-[var(--hover-color)] px-4 py-2 border-[var(--border-color)] font-medium text-[var(--text-color)]"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteModal(key.id, key.name)}
                            disabled={deleteApiKeyMutation.isPending}
                            className="bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg px-4 py-2 font-medium text-white transition-all duration-100"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="mb-2 text-[var(--text-secondary-color)] text-lg">
                      No API keys configured yet.
                    </p>
                    <p className="text-[var(--text-secondary-color)] text-sm">
                      Add your first API key to get started.
                    </p>
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
