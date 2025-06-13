import { type FC, useState } from "react";
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

interface IHost {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

interface IHostTableProps {
  hosts?: IHost[];
  isLoading: boolean;
  onEditHost: (host: IHost) => void;
  onDeleteHost: (hostId: string) => void;
}

type SortField = "name" | "slug" | "is_active";
type SortDirection = "asc" | "desc";

const HostTable: FC<IHostTableProps> = ({
  hosts,
  isLoading,
  onEditHost,
  onDeleteHost,
}) => {
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

  const sortedHosts = hosts
    ? [...hosts].sort((a, b) => {
        let aValue: string | boolean;
        let bValue: string | boolean;

        switch (sortField) {
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case "slug":
            aValue = a.slug.toLowerCase();
            bValue = b.slug.toLowerCase();
            break;
          case "is_active":
            aValue = a.is_active;
            bValue = b.is_active;
            break;
          default:
            return 0;
        }

        if (sortField === "is_active") {
          // For boolean values, true comes first in ascending order
          if (aValue !== bValue) {
            return sortDirection === "asc"
              ? aValue
                ? -1
                : 1
              : aValue
                ? 1
                : -1;
          }
          return 0;
        }

        // For string values
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
        <p className="text-muted-foreground">Loading hosts...</p>
      </div>
    );
  }

  if (!hosts || hosts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 h-[300px] text-muted-foreground">
        <div className="text-center">
          <div className="mb-4 text-6xl">🏠</div>
          <h3 className="mb-2 font-medium text-foreground text-lg">
            No Hosts Found
          </h3>
          <p className="max-w-md text-sm">
            No hosts have been configured yet. Create your first host to get
            started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {sortedHosts.map((host) => (
          <div
            key={host.id}
            className="space-y-3 bg-card p-4 border rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">{host.name}</h3>
                <p className="font-mono text-muted-foreground text-sm">
                  {host.slug}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  host.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
                }`}
              >
                {host.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditHost(host)}
                className="flex-1 text-xs"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteHost(host.id)}
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
                  onClick={() => handleSort("slug")}
                >
                  Slug
                  {getSortIcon("slug")}
                </button>
              </TableHead>
              <TableHead className="font-medium">
                <button
                  type="button"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort("is_active")}
                >
                  Active
                  {getSortIcon("is_active")}
                </button>
              </TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHosts.map((host) => (
              <TableRow key={host.id}>
                <TableCell className="font-medium">{host.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground text-sm">
                  {host.slug}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      host.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
                    }`}
                  >
                    {host.is_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditHost(host)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteHost(host.id)}
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

export default HostTable;
