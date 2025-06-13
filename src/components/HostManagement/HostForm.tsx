import type { FC } from "react";
import { useForm } from "@tanstack/react-form";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  EditAiModelHostRequestSchema,
  AiModelResponseForAdminSchema,
} from "~/openapi/requests/types.gen";

interface IHostFormProps {
  initialData: EditAiModelHostRequestSchema;
  onSubmit: (data: EditAiModelHostRequestSchema) => void;
  models?: AiModelResponseForAdminSchema[];
  modelsLoading?: boolean;
  idPrefix?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

const HostForm: FC<IHostFormProps> = ({
  initialData,
  onSubmit,
  models = [],
  modelsLoading = false,
  idPrefix = "",
  submitLabel = "Submit",
  isSubmitting = false,
  onCancel,
}) => {
  const form = useForm({
    defaultValues: initialData,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
    validators: {
      onSubmit: ({ value }) => {
        // Validate that there's at least one model association with a valid model_id
        const validAssociations = value.model_associations.filter(
          (association) =>
            association.model_id && association.model_id.trim() !== "",
        );

        if (validAssociations.length === 0) {
          return "At least one model association with a valid model is required";
        }

        return undefined;
      },
    },
  });

  const inputClassName =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <form.Field
          name="name"
          validators={{
            onBlur: ({ value }) =>
              !value || value.length < 2
                ? "Name must be at least 2 characters"
                : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                htmlFor={`${idPrefix}host-name`}
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id={`${idPrefix}host-name`}
                name={field.name}
                type="text"
                className={inputClassName}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Host name"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="slug"
          validators={{
            onBlur: ({ value }) =>
              !value || value.length < 2
                ? "Slug must be at least 2 characters"
                : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                htmlFor={`${idPrefix}host-slug`}
              >
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id={`${idPrefix}host-slug`}
                name={field.name}
                type="text"
                className={inputClassName}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="host-slug"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="is_active">
        {(field) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${idPrefix}host-active`}
              name={field.name}
              checked={field.state.value}
              onCheckedChange={(value) => field.handleChange(value === true)}
            />
            <label
              htmlFor={`${idPrefix}host-active`}
              className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
            >
              Active
            </label>
          </div>
        )}
      </form.Field>

      <form.Field name="model_associations">
        {(field) => (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                Model Associations
              </span>
              <button
                type="button"
                onClick={() => {
                  const newAssociation = {
                    model_id: "",
                    priority: 0,
                  };
                  field.handleChange([...field.state.value, newAssociation]);
                }}
                disabled={modelsLoading}
                className="inline-flex justify-center items-center bg-primary hover:bg-primary/90 disabled:opacity-50 shadow px-3 py-1 rounded-md focus-visible:outline-none focus-visible:ring-1 h-8 font-medium text-primary-foreground text-xs transition-colors disabled:pointer-events-none"
              >
                Add Model
              </button>
            </div>

            {field.state.value.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No model associations configured.
              </p>
            )}

            <div className="space-y-2">
              {field.state.value.map((association, index) => (
                <div
                  key={`association-${index}-${association.model_id || "new"}`}
                  className="flex items-center gap-2 p-3 border rounded-md"
                >
                  <div className="flex-1">
                    <select
                      value={association.model_id}
                      onChange={(e) => {
                        const updatedAssociations = [...field.state.value];
                        updatedAssociations[index] = {
                          ...updatedAssociations[index],
                          model_id: e.target.value,
                        };
                        field.handleChange(updatedAssociations);
                      }}
                      className={`${inputClassName} ${!association.model_id ? "text-muted-foreground" : ""}`}
                      disabled={modelsLoading}
                    >
                      <option value="" className="text-muted-foreground">
                        Select Model
                      </option>
                      {models.map((model) => (
                        <option
                          key={model.id}
                          value={model.id}
                          className="text-foreground"
                        >
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Priority"
                      value={association.priority}
                      onChange={(e) => {
                        const updatedAssociations = [...field.state.value];
                        updatedAssociations[index] = {
                          ...updatedAssociations[index],
                          priority: Number.parseInt(e.target.value) || 0,
                        };
                        field.handleChange(updatedAssociations);
                      }}
                      className={inputClassName}
                      min="0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedAssociations = field.state.value.filter(
                        (_, i) => i !== index,
                      );
                      field.handleChange(updatedAssociations);
                    }}
                    className="inline-flex justify-center items-center bg-destructive hover:bg-destructive/90 disabled:opacity-50 shadow px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-1 h-8 font-medium text-destructive-foreground text-xs transition-colors disabled:pointer-events-none"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [
          state.canSubmit,
          state.isSubmitting,
          state.isValid,
        ]}
      >
        {([canSubmit, isFormSubmitting, isValid]) => {
          // Get form validation errors
          const hasValidationError = !isValid && form.state.errors.length > 0;

          return (
            <div className="space-y-3 pt-4">
              {hasValidationError && (
                <div className="bg-destructive/10 p-3 border border-destructive/20 rounded-md">
                  <p className="font-medium text-destructive text-sm">
                    {form.state.errors[0]}
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-3">
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex justify-center items-center bg-background hover:bg-accent disabled:opacity-50 shadow-sm px-4 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-1 h-10 font-medium text-sm transition-colors hover:text-accent-foreground disabled:pointer-events-none"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isFormSubmitting}
                  className="inline-flex justify-center items-center bg-primary hover:bg-primary/90 disabled:opacity-50 shadow px-4 py-2 rounded-md focus-visible:outline-none focus-visible:ring-1 h-10 font-medium text-primary-foreground text-sm transition-colors disabled:pointer-events-none"
                >
                  {isSubmitting || isFormSubmitting
                    ? "Submitting..."
                    : submitLabel}
                </button>
              </div>
            </div>
          );
        }}
      </form.Subscribe>
    </form>
  );
};

export default HostForm;
