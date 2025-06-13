import { Modal } from "@/components/Modal/Modal";
import AiModelForm from "./AiModelForm";
import type { EditAiModelRequestSchema } from "~/openapi/requests/types.gen";

type Provider = {
  id: string;
  name: string;
};

type Host = {
  id: string;
  name: string;
  slug: string;
};

type EditingModel = {
  id: string;
  data: EditAiModelRequestSchema;
};

type EditModelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingModel: EditingModel | null;
  providers?: Provider[];
  hosts?: Host[];
  providersLoading: boolean;
  hostsLoading: boolean;
  onUpdateModel: (data: EditAiModelRequestSchema) => void;
  isUpdating: boolean;
};

const EditModelModal = ({
  isOpen,
  onClose,
  editingModel,
  providers,
  hosts,
  providersLoading,
  hostsLoading,
  onUpdateModel,
  isUpdating,
}: EditModelModalProps) => {
  if (!editingModel) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit AI Model"
      className="w-full! max-w-[40rem]!"
    >
      <AiModelForm
        initialData={editingModel.data}
        onSubmit={onUpdateModel}
        providers={providers}
        hosts={hosts}
        providersLoading={providersLoading}
        hostsLoading={hostsLoading}
        idPrefix="edit-"
        submitLabel="Update Model"
        isSubmitting={isUpdating}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default EditModelModal;
