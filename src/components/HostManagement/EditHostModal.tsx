import type { FC } from "react";
import { Modal } from "@/components/Modal/Modal";
import type {
  EditAiModelHostRequestSchema,
  AiModelResponseForAdminSchema,
} from "~/openapi/requests/types.gen";
import HostForm from "./HostForm";

interface IEditingHost {
  id: string;
  data: EditAiModelHostRequestSchema;
}

interface IEditHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingHost: IEditingHost | null;
  onUpdateHost: (data: EditAiModelHostRequestSchema) => void;
  isUpdating: boolean;
  models?: AiModelResponseForAdminSchema[];
  modelsLoading?: boolean;
}

const EditHostModal: FC<IEditHostModalProps> = ({
  isOpen,
  onClose,
  editingHost,
  onUpdateHost,
  isUpdating,
  models,
  modelsLoading,
}) => {
  if (!editingHost) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Host">
      <HostForm
        initialData={editingHost.data}
        onSubmit={onUpdateHost}
        models={models}
        modelsLoading={modelsLoading}
        idPrefix="edit-"
        submitLabel="Update Host"
        isSubmitting={isUpdating}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default EditHostModal;
