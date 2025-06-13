import type { FC } from "react";
import { Modal } from "@/components/Modal/Modal";
import type {
  EditAiModelHostRequestSchema,
  AiModelResponseForAdminSchema,
} from "~/openapi/requests/types.gen";
import HostForm from "./HostForm";

interface IAddHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: EditAiModelHostRequestSchema;
  onAddHost: (data: EditAiModelHostRequestSchema) => void;
  isAdding: boolean;
  models?: AiModelResponseForAdminSchema[];
  modelsLoading?: boolean;
}

const AddHostModal: FC<IAddHostModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onAddHost,
  isAdding,
  models,
  modelsLoading,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Add Host">
    <HostForm
      initialData={initialData}
      onSubmit={onAddHost}
      models={models}
      modelsLoading={modelsLoading}
      idPrefix="add-"
      submitLabel="Add Host"
      isSubmitting={isAdding}
      onCancel={onClose}
    />
  </Modal>
);

export default AddHostModal;
