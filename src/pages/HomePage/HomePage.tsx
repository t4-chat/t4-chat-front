import { providerIconPaths } from "@/assets/icons/ai-providers/index";
import SearchIcon from "@/assets/icons/chats/search.svg?react";
import { useContext, useMemo, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAiModelsServiceGetApiAiModels } from "../../../openapi/queries/queries";
import type { AiModelResponseSchema } from "~/openapi/requests/types.gen";
import { useMinimumLoading } from "@/hooks/useMinimumLoading";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarContext } from "@/components/Layout/Layout";
import { Key, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categorizationMode, setCategorizationMode] = useState<
    "provider" | "usage"
  >("provider");
  const query = searchQuery.toLowerCase();

  const {
    data: models = [],
    isLoading: isModelsLoading,
    error,
  } = useAiModelsServiceGetApiAiModels();

  const { isMinimumLoading } = useMinimumLoading({
    initialLoading: isModelsLoading,
  });

  const getProviderIconPath = (provider: string): string => {
    return (
      providerIconPaths[
        provider.toLowerCase() as keyof typeof providerIconPaths
      ] || providerIconPaths.default
    );
  };

  const getCategoryDisplayName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      general: "General Purpose",
      coding: "Code & Development",
      reasoning: "Logic & Analysis",
      multimodal: "Vision & Multimedia",
    };

    return categoryNames[category.toLowerCase()] || category;
  };

  const filteredModels = useMemo(() => {
    if (!query.trim()) return models;
    return models.filter(
      (model) =>
        model.name.toLowerCase().includes(query) ||
        model.provider?.name.toLowerCase().includes(query) ||
        model.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [models, query]);

  const groupedModels = useMemo(() => {
    if (categorizationMode === "provider") {
      return filteredModels.reduce<Record<string, AiModelResponseSchema[]>>(
        (acc, model) => {
          const providerName = model.provider?.name || "Unknown";
          if (!acc[providerName]) {
            acc[providerName] = [];
          }
          acc[providerName].push(model);
          return acc;
        },
        {},
      );
    }

    // Group by usage (tags)
    return filteredModels.reduce<Record<string, AiModelResponseSchema[]>>(
      (acc, model) => {
        // For now, use the first tag since it only includes one element
        const usageCategory = model.tags[0] || "Other";
        if (!acc[usageCategory]) {
          acc[usageCategory] = [];
        }
        acc[usageCategory].push(model);
        return acc;
      },
      {},
    );
  }, [filteredModels, categorizationMode]);

  const handleTileClick = (model: AiModelResponseSchema): void => {
    navigate(`/chat?modelIds=${model.id}&panes=1`);
  };

  const handleClearSearch = (): void => {
    setSearchQuery("");
  };

  const { isOpen: isSidebarOpen } = useContext(SidebarContext);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col items-center w-full px-6 py-8 bg-[var(--background-color)] transition-all duration-75",
          { "md:pl-64": isSidebarOpen },
        )}
      >
        <header className="max-w-[50rem] text-center">
          <h1 className="mb-6 font-bold text-[var(--text-primary-color)] text-2xl md:text-3xl leading-tight">
            Access the best AI models in one place
          </h1>
        </header>

        <div className="flex flex-col items-center gap-4 mx-auto mb-6 w-full max-w-[1200px]">
          <div className="relative w-full max-w-[37.5rem]">
            <SearchIcon
              width={16}
              height={16}
              className="top-1/2 left-4 absolute text-[var(--text-secondary-color)] -translate-y-1/2 transform"
            />
            <input
              type="text"
              className="bg-[var(--background-color)] shadow-sm focus:shadow-lg px-10 py-4 border border-[var(--border-color)] focus-visible:border-[var(--primary-color)] rounded-full focus-visible:outline-none focus-visible:ring-[var(--primary-color)] focus-visible:ring-2 focus-visible:ring-offset-0 w-full text-[var(--text-primary-color)] placeholder:text-[var(--text-placeholder-color)] text-base transition-all duration-100"
              placeholder="Search models or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="text"
                className="top-1/2 right-4 absolute flex justify-center items-center bg-transparent p-0 border-none rounded-full w-6 h-6 -translate-y-1/2 cursor-pointer transform"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="flex justify-center items-center gap-4 w-full">
            <p className="text-md">Organize by:</p>
            <Tabs
              value={categorizationMode}
              onValueChange={(value) =>
                setCategorizationMode(value as "provider" | "usage")
              }
              className="w-auto"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="provider">Provider</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isMinimumLoading ? (
          <div className="before:top-1/2 before:left-0 before:absolute relative mt-8 p-4 pl-8 before:border-[var(--primary-color)] before:border-2 before:border-t-transparent rounded-md before:rounded-full before:w-4 before:h-4 text-[var(--text-secondary-color)] text-base text-center before:content-[''] before:-translate-y-1/2 before:animate-spin">
            Loading AI models...
          </div>
        ) : error ? (
          <div className="bg-red-50 mt-8 p-4 rounded-md text-[var(--error-color)] text-base text-center">
            Failed to load AI models. Please try again later.
          </div>
        ) : filteredModels.length === 0 ? (
          <p className="mt-8 p-4 rounded-md text-[var(--text-secondary-color)] text-base text-center italic">
            No models found matching "{searchQuery}"
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={categorizationMode}
              className={cn("grid gap-8 w-full max-w-[75rem] mx-auto mb-8", {
                "grid-cols-1": categorizationMode === "usage",
                "grid-cols-1 md:grid-cols-2": categorizationMode === "provider",
              })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              {Object.entries(groupedModels).map(
                ([categoryName, categoryModels]) => (
                  <motion.section
                    key={categoryName}
                    className="w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.1,
                      delay: 0.1,
                      ease: "easeOut",
                    }}
                  >
                    {categorizationMode === "usage" ? (
                      <h2 className="mb-4 font-semibold text-[var(--text-primary-color)] text-lg">
                        {getCategoryDisplayName(categoryName)}
                      </h2>
                    ) : (
                      <h2 className="mb-4 font-semibold text-[var(--text-primary-color)] text-lg">
                        {categoryName}
                      </h2>
                    )}
                    <div className="justify-items-center gap-6 sm:gap-4 md:gap-5 grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(5.313rem,1fr))] md:grid-cols-[repeat(auto-fill,minmax(6.25rem,1fr))] mb-6">
                      {categoryModels.map((model, index) => (
                        <motion.button
                          type="button"
                          key={model.id}
                          className="flex flex-col items-center w-full hover:scale-105 active:scale-95 transition-transform duration-100 cursor-pointer"
                          onClick={() => handleTileClick(model)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.15,
                            delay: 0.2 + index * 0.05,
                            ease: "easeOut",
                          }}
                          whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.1 },
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="after:top-0 after:left-0 after:absolute relative flex justify-center items-center after:bg-white shadow-sm hover:shadow-lg mb-4 rounded-2xl w-[4.375rem] sm:w-15 md:w-16 after:w-full h-[4.375rem] sm:h-15 md:h-16 after:h-full overflow-hidden text-white after:content-[''] transition-all duration-100">
                            <img
                              src={getProviderIconPath(
                                model.provider?.slug || "",
                              )}
                              alt={`${model.provider?.name || "Unknown"} icon`}
                              className="z-10 relative w-full h-full"
                            />
                          </div>
                          <div className="flex justify-center items-center gap-1 w-full overflow-hidden font-medium text-[var(--text-primary-color)] text-base text-center">
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                              {model.name}
                            </span>
                            {model.has_api_key && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex flex-shrink-0 justify-center items-center bg-green-100 dark:bg-green-900/50 rounded-sm w-4 h-4">
                                    <Key className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Using your API key</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.section>
                ),
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </TooltipProvider>
  );
};

export default HomePage;
