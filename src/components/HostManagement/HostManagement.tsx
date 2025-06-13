import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAdminServiceDeleteApiAdminModelHostsByHostId,
  useAdminServiceGetApiAdminModelHosts,
  useAdminServicePostApiAdminModelHosts,
  useAdminServicePutApiAdminModelHostsByHostId,
  useAdminServiceGetApiAdminAiModels,
} from "~/openapi/queries/queries";
import type { EditAiModelHostRequestSchema } from "~/openapi/requests/types.gen";
import HostTable from "./HostTable";
import AddHostModal from "./AddHostModal";
import EditHostModal from "./EditHostModal";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { useMutationErrorHandler } from "@/hooks/useMutationErrorHandler";

interface IEditingHost {
  id: string;
  data: EditAiModelHostRequestSchema;
}

const HostManagement: FC = () => {
  const { handleError, handleSuccess } = useMutationErrorHandler();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHost, setEditingHost] = useState<IEditingHost | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    hostId: string | null;
  }>({ isOpen: false, hostId: null });

  const defaultHostData: EditAiModelHostRequestSchema = {
    name: "",
    slug: "",
    is_active: true,
    model_associations: [],
  };

  const {
    data: hosts,
    isLoading: hostsLoading,
    refetch: refetchHosts,
  } = useAdminServiceGetApiAdminModelHosts();

  const { data: models, isLoading: modelsLoading } =
    useAdminServiceGetApiAdminAiModels();

  const addHostMutation = useAdminServicePostApiAdminModelHosts({
    onSuccess: () => {
      setIsAddModalOpen(false);
      refetchHosts();
      handleSuccess("Host added successfully");
    },
    onError: (error) => handleError(error, "Failed to add host"),
  });

  const updateHostMutation = useAdminServicePutApiAdminModelHostsByHostId({
    onSuccess: () => {
      setIsEditModalOpen(false);
      setEditingHost(null);
      refetchHosts();
      handleSuccess("Host updated successfully");
    },
    onError: (error) => handleError(error, "Failed to update host"),
  });

  const deleteHostMutation = useAdminServiceDeleteApiAdminModelHostsByHostId({
    onSuccess: () => {
      refetchHosts();
      handleSuccess("Host deleted successfully");
    },
    onError: (error) => handleError(error, "Failed to delete host"),
  });

  const handleAddHost = (data: EditAiModelHostRequestSchema) => {
    addHostMutation.mutate({ requestBody: data });
  };

  const handleUpdateHost = (data: EditAiModelHostRequestSchema) => {
    if (editingHost) {
      updateHostMutation.mutate({ hostId: editingHost.id, requestBody: data });
    }
  };

  const handleEditHost = (host: {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
  }) => {
    // Find the full host data from the API response to get model associations
    const fullHost = hosts?.find((h) => h.id === host.id);

    setEditingHost({
      id: host.id,
      data: {
        name: host.name,
        slug: host.slug,
        is_active: host.is_active,
        model_associations: fullHost?.model_associations || [],
      },
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteHost = (hostId: string) => {
    setDeleteModalState({ isOpen: true, hostId });
  };

  const confirmDeleteHost = () => {
    if (deleteModalState.hostId) {
      deleteHostMutation.mutate({ hostId: deleteModalState.hostId });
      setDeleteModalState({ isOpen: false, hostId: null });
    }
  };

  const transformedHosts = hosts?.map((host) => ({
    id: host.id,
    name: host.name,
    slug: host.slug,
    is_active: host.is_active,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Host Management</CardTitle>
          <Button onClick={() => setIsAddModalOpen(true)}>Add Host</Button>
        </div>
      </CardHeader>
      <CardContent>
        <HostTable
          hosts={transformedHosts || []}
          isLoading={hostsLoading}
          onEditHost={handleEditHost}
          onDeleteHost={handleDeleteHost}
        />
      </CardContent>

      <AddHostModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialData={defaultHostData}
        onAddHost={handleAddHost}
        isAdding={addHostMutation.isPending}
        models={models}
        modelsLoading={modelsLoading}
      />

      <EditHostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingHost={editingHost}
        onUpdateHost={handleUpdateHost}
        isUpdating={updateHostMutation.isPending}
        models={models}
        modelsLoading={modelsLoading}
      />

      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, hostId: null })}
        onConfirm={confirmDeleteHost}
        title="Delete Host"
        message="Are you sure you want to delete this host? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger={true}
      />
    </Card>
  );
};

export default HostManagement;
