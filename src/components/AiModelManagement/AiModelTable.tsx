import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

// Predefined color variants that work well in both light and dark themes
const tagColorVariants = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
  "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
  "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300",
  "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300",
];

// Simple hash function to generate consistent colors for tag strings
const getTagColor = (tag: string): string => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    const char = tag.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % tagColorVariants.length;
  return tagColorVariants[index];
};

type AiModel = {
  id: string;
  name: string;
  provider: { id: string; name: string };
  tags: string[];
};

type SortField = "name" | "id" | "provider" | "tags";
type SortDirection = "asc" | "desc";

type AiModelTableProps = {
  models?: AiModel[];
  isLoading: boolean;
  onEditModel: (model: AiModel) => void;
  onDeleteModel: (model: AiModel) => void;
};

const AiModelTable = ({
  models,
  isLoading,
  onEditModel,
  onDeleteModel,
}: AiModelTableProps) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedModels = models
    ? [...models].sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortField) {
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case "id":
            aValue = a.id.toLowerCase();
            bValue = b.id.toLowerCase();
            break;
          case "provider":
            aValue = a.provider.name.toLowerCase();
            bValue = b.provider.name.toLowerCase();
            break;
          case "tags":
            aValue = a.tags.length > 0 ? a.tags[0].toLowerCase() : "";
            bValue = b.tags.length > 0 ? b.tags[0].toLowerCase() : "";
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-muted-foreground/50" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-muted-foreground" />
    ) : (
      <ChevronDown className="w-4 h-4 text-muted-foreground" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">Loading models...</p>
      </div>
    );
  }

  if (!models || models.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 h-[300px] text-muted-foreground">
        <div className="text-center">
          <div className="mb-4 text-6xl">🤖</div>
          <h3 className="mb-2 font-medium text-foreground text-lg">
            No AI Models Found
          </h3>
          <p className="max-w-md text-sm">
            No AI models have been configured yet. Add your first model to get
            started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {sortedModels.map((model) => (
          <div
            key={model.id}
            className="space-y-3 bg-card p-4 border rounded-lg"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 space-y-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {model.name}
                  </h3>
                  <p className="font-mono text-muted-foreground text-xs truncate">
                    {model.id}
                  </p>
                </div>
                <span className="bg-muted px-2 py-1 rounded-md text-muted-foreground text-xs shrink-0">
                  {model.provider.name}
                </span>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {model.tags.length > 0 ? (
                    model.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center px-2 py-1 rounded-md font-medium text-xs ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      No tags
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditModel(model)}
                className="flex-1 text-xs"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteModel(model)}
                className="flex-1 hover:bg-destructive/10 border-destructive/20 hover:border-destructive text-destructive hover:text-destructive text-xs"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">
                <button
                  type="button"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort("name")}
                >
                  Name
                  {getSortIcon("name")}
                </button>
              </TableHead>
              <TableHead className="font-medium">
                <button
                  type="button"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort("id")}
                >
                  ID
                  {getSortIcon("id")}
                </button>
              </TableHead>
              <TableHead className="font-medium">
                <button
                  type="button"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort("provider")}
                >
                  Provider
                  {getSortIcon("provider")}
                </button>
              </TableHead>
              <TableHead className="font-medium">
                <button
                  type="button"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort("tags")}
                >
                  Tags
                  {getSortIcon("tags")}
                </button>
              </TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground text-xs">
                  {model.id}
                </TableCell>
                <TableCell>{model.provider.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {model.tags.length > 0 ? (
                      model.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center px-2 py-1 rounded-md font-medium text-xs ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        No tags
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditModel(model)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteModel(model)}
                      className="hover:bg-destructive/10 border-destructive/20 hover:border-destructive text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AiModelTable;
