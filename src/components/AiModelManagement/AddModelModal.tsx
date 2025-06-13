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

type AddModelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: EditAiModelRequestSchema;
  providers?: Provider[];
  hosts?: Host[];
  providersLoading: boolean;
  hostsLoading: boolean;
  onAddModel: (data: EditAiModelRequestSchema) => void;
  isAdding: boolean;
};

const AddModelModal = ({
  isOpen,
  onClose,
  initialData,
  providers,
  hosts,
  providersLoading,
  hostsLoading,
  onAddModel,
  isAdding,
}: AddModelModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add AI Model"
      className="w-full! max-w-[40rem]!"
    >
      <AiModelForm
        initialData={initialData}
        onSubmit={onAddModel}
        providers={providers}
        hosts={hosts}
        providersLoading={providersLoading}
        hostsLoading={hostsLoading}
        idPrefix="add-"
        submitLabel="Add Model"
        isSubmitting={isAdding}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default AddModelModal;
