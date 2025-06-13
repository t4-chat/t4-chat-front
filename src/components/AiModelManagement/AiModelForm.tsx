import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ChipsInput from "@/components/ui/chips-input";
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

type AiModelFormProps = {
  initialData: EditAiModelRequestSchema;
  onSubmit: (data: EditAiModelRequestSchema) => void;
  providers?: Provider[];
  hosts?: Host[];
  providersLoading: boolean;
  hostsLoading: boolean;
  idPrefix?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

const AiModelForm = ({
  initialData,
  onSubmit,
  providers,
  hosts,
  providersLoading,
  hostsLoading,
  idPrefix = "",
  submitLabel = "Submit",
  isSubmitting = false,
  onCancel,
}: AiModelFormProps) => {
  // Track display values for number inputs to allow empty strings
  const [priceInputDisplay, setPriceInputDisplay] = useState(
    initialData.price_input_token === 0
      ? ""
      : initialData.price_input_token.toString(),
  );
  const [priceOutputDisplay, setPriceOutputDisplay] = useState(
    initialData.price_output_token === 0
      ? ""
      : initialData.price_output_token.toString(),
  );
  const [contextLengthDisplay, setContextLengthDisplay] = useState(
    initialData.context_length === 0
      ? ""
      : initialData.context_length.toString(),
  );

  const form = useForm({
    defaultValues: initialData,
    onSubmit: async ({ value }) => {
      onSubmit(value);
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
      {/* Basic Information */}
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
                htmlFor={`${idPrefix}model-name`}
              >
                Name <span className="text-destructive">*</span>
              </label>
              <input
                id={`${idPrefix}model-name`}
                name={field.name}
                type="text"
                className={inputClassName}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter model name (e.g., GPT-4, Claude-3)"
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
                htmlFor={`${idPrefix}model-slug`}
              >
                Slug <span className="text-destructive">*</span>
              </label>
              <input
                id={`${idPrefix}model-slug`}
                name={field.name}
                type="text"
                className={inputClassName}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter URL-friendly identifier (e.g., gpt-4-turbo)"
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

      {/* Provider and Host */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <form.Field
          name="provider_id"
          validators={{
            onBlur: ({ value }) =>
              !value ? "Provider is required" : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                htmlFor={`${idPrefix}provider`}
              >
                Provider <span className="text-destructive">*</span>
              </label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose the AI provider" />
                </SelectTrigger>
                <SelectContent>
                  {providersLoading ? (
                    <SelectItem value="" disabled>
                      Loading providers...
                    </SelectItem>
                  ) : (
                    providers?.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="host_associations">
          {(field) => (
            <div className="space-y-1.5">
              <label
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                htmlFor={`${idPrefix}host`}
              >
                Primary Host <span className="text-destructive">*</span>
              </label>
              <Select
                value={field.state.value?.[0]?.host_id || ""}
                onValueChange={(value) =>
                  field.handleChange(
                    value ? [{ host_id: value, priority: 1 }] : [],
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the host" />
                </SelectTrigger>
                <SelectContent>
                  {hostsLoading ? (
                    <SelectItem value="" disabled>
                      Loading hosts...
                    </SelectItem>
                  ) : (
                    hosts?.map((host) => (
                      <SelectItem key={host.id} value={host.id}>
                        {host.name} ({host.slug})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Tags and Prompt Path */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <form.Field name="tags">
          {(field) => (
            <div className="space-y-1.5">
              <label
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                htmlFor={`${idPrefix}tags`}
              >
                Tags
              </label>
              <ChipsInput
                value={field.state.value || []}
                onValueChange={(value) => field.handleChange(value)}
                placeholder="Add tags like 'chat', 'creative', 'code'..."
                className="w-full"
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
          name="prompt_path"
          validators={{
            onBlur: ({ value }) =>
              !value || value.length < 1
                ? "Prompt path is required"
                : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                htmlFor={`${idPrefix}prompt-path`}
              >
                Prompt Path <span className="text-destructive">*</span>
              </label>
              <input
                id={`${idPrefix}prompt-path`}
                name={field.name}
                type="text"
                className={inputClassName}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter system prompt path (e.g., /prompts/assistant.txt)"
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

      {/* Pricing and Context Length */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <form.Field
          name="price_input_token"
          validators={{
            onBlur: ({ value }) =>
              value < 0 ? "Price must be non-negative" : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                htmlFor={`${idPrefix}price-input`}
              >
                Input Token Price
              </label>
              <input
                id={`${idPrefix}price-input`}
                name={field.name}
                type="number"
                step="1"
                className={inputClassName}
                value={priceInputDisplay}
                onBlur={(e) => {
                  const value = e.target.value;
                  const numValue = value === "" ? 0 : Number.parseFloat(value);
                  field.handleChange(numValue);
                  setPriceInputDisplay(
                    numValue === 0 ? "" : numValue.toString(),
                  );
                  field.handleBlur();
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setPriceInputDisplay(value);
                  if (value !== "") {
                    field.handleChange(Number.parseFloat(value));
                  }
                }}
                placeholder="Cost per 1K input tokens (e.g., 0.001)"
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
          name="price_output_token"
          validators={{
            onBlur: ({ value }) =>
              value < 0 ? "Price must be non-negative" : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                htmlFor={`${idPrefix}price-output`}
              >
                Output Token Price
              </label>
              <input
                id={`${idPrefix}price-output`}
                name={field.name}
                type="number"
                step="1"
                className={inputClassName}
                value={priceOutputDisplay}
                onBlur={(e) => {
                  const value = e.target.value;
                  const numValue = value === "" ? 0 : Number.parseFloat(value);
                  field.handleChange(numValue);
                  setPriceOutputDisplay(
                    numValue === 0 ? "" : numValue.toString(),
                  );
                  field.handleBlur();
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setPriceOutputDisplay(value);
                  if (value !== "") {
                    field.handleChange(Number.parseFloat(value));
                  }
                }}
                placeholder="Cost per 1K output tokens (e.g., 0.003)"
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
          name="context_length"
          validators={{
            onBlur: ({ value }) =>
              value <= 0 ? "Context length must be greater than 0" : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label
                className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                htmlFor={`${idPrefix}context-length`}
              >
                Context Length <span className="text-destructive">*</span>
              </label>
              <input
                id={`${idPrefix}context-length`}
                name={field.name}
                type="number"
                step="1"
                className={inputClassName}
                value={contextLengthDisplay}
                onBlur={(e) => {
                  const value = e.target.value;
                  const numValue = value === "" ? 0 : Number.parseInt(value);
                  field.handleChange(numValue);
                  setContextLengthDisplay(
                    numValue === 0 ? "" : numValue.toString(),
                  );
                  field.handleBlur();
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setContextLengthDisplay(value);
                  if (value !== "") {
                    field.handleChange(Number.parseInt(value));
                  }
                }}
                placeholder="Maximum tokens (e.g., 4096, 8192, 128000)"
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

      {/* Active Status */}
      <form.Field name="is_active">
        {(field) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${idPrefix}is-active`}
              name={field.name}
              checked={field.state.value}
              onCheckedChange={(value) => field.handleChange(value === true)}
            />
            <label
              htmlFor={`${idPrefix}is-active`}
              className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
            >
              Active (model is available for use)
            </label>
          </div>
        )}
      </form.Field>

      {/* Submit Actions */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isFormSubmitting]) => (
          <div className="flex justify-end gap-3 pt-4">
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
              {isSubmitting || isFormSubmitting ? "Submitting..." : submitLabel}
            </button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
};

export default AiModelForm;
