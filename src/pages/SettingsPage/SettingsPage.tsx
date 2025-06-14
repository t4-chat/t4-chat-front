import type { FC } from "react";
import { useState, useContext } from "react";
import { useForm } from "@tanstack/react-form";
import { SidebarContext } from "@/components/Layout/Layout";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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

export const SettingsPage: FC = () => {
  const [activeTab, setActiveTab] = useState<"utilization" | "api-keys">(
    "utilization",
  );
  const [editingKey, setEditingKey] = useState<HostApiKeyResponseSchema | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const { isOpen: isSidebarOpen } = useContext(SidebarContext);

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
        refetchApiKeys();
      },
    },
  );

  const inputClassName =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

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
                <label htmlFor="host-id" className="font-medium text-sm">
                  Model Host <span className="text-red-500">*</span>
                </label>
                <select
                  id="host-id"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={inputClassName}
                  disabled={!!initialData || modelHostsLoading}
                >
                  <option value="">Select Model Host</option>
                  {modelHosts.map((host) => (
                    <option key={host.id} value={host.id}>
                      {host.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="name">
            {(field) => (
              <div className="space-y-1.5">
                <label htmlFor="key-name" className="font-medium text-sm">
                  Key Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="key-name"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={inputClassName}
                  placeholder="My API Key"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="api_key">
            {(field) => (
              <div className="space-y-1.5">
                <label htmlFor="api-key" className="font-medium text-sm">
                  API Key{" "}
                  {!initialData && <span className="text-red-500">*</span>}
                </label>
                <input
                  id="api-key"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={inputClassName}
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
                  <input
                    type="checkbox"
                    id="is-active"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                  <label htmlFor="is-active" className="font-medium text-sm">
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
        "space-y-6 mx-auto p-6 container transition-all duration-300",
        { "md:pl-64": isSidebarOpen },
      )}
    >
      <div className="space-y-2">
        <h1 className="font-bold text-3xl">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and API keys
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "utilization" | "api-keys")
        }
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="utilization">Usage & Limits</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Usage</CardTitle>
            </CardHeader>
            <CardContent>
              {utilizationLoading ? (
                <p className="text-muted-foreground">
                  Loading utilization data...
                </p>
              ) : utilization ? (
                <div className="space-y-4">
                  {utilization.utilizations.map((util) => (
                    <div
                      key={util.model_id}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Model: {util.model_id}</p>
                        <p className="text-muted-foreground text-sm">
                          Tokens used: {util.total_tokens.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {util.percentage}%
                        </div>
                        <div className="bg-gray-200 rounded-full w-20 h-2">
                          <div
                            className="bg-primary rounded-full h-2"
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
                <p className="text-muted-foreground">
                  No utilization data available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Bring Your Own API Keys</CardTitle>
                <p className="mt-1 text-muted-foreground text-sm">
                  Add your own API keys to use with supported models
                </p>
              </div>
              <Button
                onClick={() => setIsCreating(true)}
                disabled={isCreating || !!editingKey}
              >
                Add API Key
              </Button>
            </CardHeader>
            <CardContent>
              {(isCreating || editingKey) && (
                <div className="bg-muted/10 mb-6 p-4 border rounded-lg">
                  <h3 className="mb-4 font-medium text-lg">
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
                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{key.name}</h4>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              key.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {key.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Host:{" "}
                          {modelHosts.find((h) => h.id === key.host_id)?.name ||
                            key.host_id}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Created:{" "}
                          {new Date(key.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingKey(key)}
                          disabled={isCreating || !!editingKey}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete "${key.name}"?`,
                              )
                            ) {
                              deleteApiKeyMutation.mutate({ keyId: key.id });
                            }
                          }}
                          disabled={deleteApiKeyMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-muted-foreground text-center">
                  <p>No API keys configured yet.</p>
                  <p className="text-sm">
                    Add your first API key to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
