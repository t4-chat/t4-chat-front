import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useAdminServiceGetApiAdminModelHosts,
  useAdminServicePostApiAdminAiModels,
  useAdminServicePutApiAdminAiModelsByAiModelId,
  useAdminServiceDeleteApiAdminAiModelsByAiModelId,
  useAdminServiceGetApiAdminAiModels,
  useAiProvidersServiceGetApiAiProviders,
} from "~/openapi/queries/queries";
import type { EditAiModelRequestSchema } from "~/openapi/requests/types.gen";
import AiModelTable from "./AiModelTable";
import AddModelModal from "./AddModelModal";
import EditModelModal from "./EditModelModal";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { useMutationErrorHandler } from "@/hooks/useMutationErrorHandler";

const AiModelManagement = () => {
  const { handleError, handleSuccess } = useMutationErrorHandler();
  const [isAddModelModalOpen, setIsAddModelModalOpen] = useState(false);
  const [isEditModelModalOpen, setIsEditModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<{
    id: string;
    data: EditAiModelRequestSchema;
  } | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    modelId: string | null;
  }>({
    isOpen: false,
    modelId: null,
  });

  // Default values for new model
  const defaultModelData: EditAiModelRequestSchema = {
    name: "",
    slug: "",
    provider_id: "",
    prompt_path: "",
    price_input_token: 0,
    price_output_token: 0,
    context_length: 0,
    is_active: true,
    tags: [],
    host_associations: [],
  };

  const {
    data: aiModels,
    isLoading: aiModelsLoading,
    refetch: refetchAiModels,
  } = useAdminServiceGetApiAdminAiModels();
  const { data: hosts, isLoading: hostsLoading } =
    useAdminServiceGetApiAdminModelHosts();
  const { data: providers, isLoading: providersLoading } =
    useAiProvidersServiceGetApiAiProviders();

  const addModelMutation = useAdminServicePostApiAdminAiModels({
    onSuccess: () => {
      setIsAddModelModalOpen(false);
      refetchAiModels();
      handleSuccess("AI model added successfully");
    },
    onError: (error) => handleError(error, "Failed to add AI model"),
  });

  const updateModelMutation = useAdminServicePutApiAdminAiModelsByAiModelId({
    onSuccess: () => {
      setIsEditModelModalOpen(false);
      setEditingModel(null);
      refetchAiModels();
      handleSuccess("AI model updated successfully");
    },
    onError: (error) => handleError(error, "Failed to update AI model"),
  });
  const deleteModelMutation = useAdminServiceDeleteApiAdminAiModelsByAiModelId({
    onSuccess: () => {
      setDeleteModalState({ isOpen: false, modelId: null });
      refetchAiModels();
      handleSuccess("AI model deleted successfully");
    },
    onError: (error) => handleError(error, "Failed to delete AI model"),
  });

  const handleAddModel = (data: EditAiModelRequestSchema) => {
    addModelMutation.mutate({ requestBody: data });
  };

  const handleUpdateModel = (data: EditAiModelRequestSchema) => {
    if (editingModel) {
      updateModelMutation.mutate({
        aiModelId: editingModel.id,
        requestBody: data,
      });
    }
  };

  const handleDeleteModel = () => {
    if (deleteModalState.modelId) {
      deleteModelMutation.mutate({ aiModelId: deleteModalState.modelId });
    }
  };

  const openDeleteModal = (modelId: string) => {
    setDeleteModalState({ isOpen: true, modelId });
  };

  const handleEditModel = (model: {
    id: string;
    name: string;
    provider: { id: string };
  }) => {
    // Find the full model data from the API response
    const fullModel = aiModels?.find((m) => m.id === model.id);

    if (fullModel) {
      // Convert host data to host_associations format
      const hostAssociations =
        fullModel.hosts?.map((host) => ({
          host_id: host.id,
          priority: host.priority || 1,
        })) || [];

      setEditingModel({
        id: model.id,
        data: {
          name: fullModel.name,
          slug: fullModel.slug,
          provider_id: fullModel.provider?.id || "",
          prompt_path: fullModel.prompt_path,
          price_input_token: fullModel.price_input_token,
          price_output_token: fullModel.price_output_token,
          context_length: fullModel.context_length,
          is_active: fullModel.is_active,
          tags: fullModel.tags || [],
          host_associations: hostAssociations,
        },
      });
    } else {
      // Fallback to basic data if full model not found
      setEditingModel({
        id: model.id,
        data: {
          name: model.name,
          slug: model.id,
          provider_id: model.provider.id,
          prompt_path: "",
          price_input_token: 0,
          price_output_token: 0,
          context_length: 0,
          is_active: true,
          tags: [],
          host_associations: [],
        },
      });
    }
    setIsEditModelModalOpen(true);
  };

  // Transform admin model data to match AiModelTable expected format
  const transformedModels = aiModels?.map((model) => ({
    id: model.id,
    name: model.name,
    provider: model.provider
      ? {
          id: model.provider.id,
          name: model.provider.name,
        }
      : { id: "", name: "Unknown" },
    tags: model.tags || [],
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>AI Models</CardTitle>
        <Button onClick={() => setIsAddModelModalOpen(true)}>Add Model</Button>
      </CardHeader>
      <CardContent>
        <AiModelTable
          models={transformedModels}
          isLoading={aiModelsLoading}
          onEditModel={handleEditModel}
          onDeleteModel={(model) => openDeleteModal(model.id)}
        />

        <AddModelModal
          isOpen={isAddModelModalOpen}
          onClose={() => setIsAddModelModalOpen(false)}
          initialData={defaultModelData}
          providers={providers}
          hosts={hosts}
          providersLoading={providersLoading}
          hostsLoading={hostsLoading}
          onAddModel={handleAddModel}
          isAdding={addModelMutation.isPending}
        />

        <EditModelModal
          isOpen={isEditModelModalOpen}
          onClose={() => setIsEditModelModalOpen(false)}
          editingModel={editingModel}
          providers={providers}
          hosts={hosts}
          providersLoading={providersLoading}
          hostsLoading={hostsLoading}
          onUpdateModel={handleUpdateModel}
          isUpdating={updateModelMutation.isPending}
        />

        <ConfirmationModal
          isOpen={deleteModalState.isOpen}
          onClose={() => setDeleteModalState({ isOpen: false, modelId: null })}
          onConfirm={handleDeleteModel}
          title="Delete model"
          message="Are you sure you want to delete this model? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isDanger={true}
        />
      </CardContent>
    </Card>
  );
};

export default AiModelManagement;
