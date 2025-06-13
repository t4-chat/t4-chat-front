import { providerIconPaths } from "@/assets/icons/ai-providers/index";
import SearchIcon from "@/assets/icons/chats/search.svg?react";
import { useContext, useMemo, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAiModelsServiceGetApiAiModels } from "../../../openapi/queries/queries";
import "./HomePage.scss";
import type { AiModelResponseSchema } from "~/openapi/requests/types.gen";
import { useMinimumLoading } from "@/hooks/useMinimumLoading";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SidebarContext } from "@/components/Layout/Layout";

export const HomePage: FC = () => {
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
        model.provider.name.toLowerCase().includes(query) ||
        model.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [models, query]);

  const groupedModels = useMemo(() => {
    if (categorizationMode === "provider") {
      return filteredModels.reduce<Record<string, AiModelResponseSchema[]>>(
        (acc, model) => {
          const providerName = model.provider.name;
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
    <div className={cn("home-page", { "with-sidebar": isSidebarOpen })}>
      <header className="home-page__header">
        <h1 className="home-page__main-title">
          Access the best AI models in one place
        </h1>
      </header>

      <div className="flex flex-col items-center gap-4 mx-auto mb-6 w-full max-w-[1200px]">
        <div className="home-page__search-container">
          <SearchIcon
            width={16}
            height={16}
            className="home-page__search-icon"
          />
          <input
            type="text"
            className="home-page__search-input"
            placeholder="Search models or providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="home-page__search-clear"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
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
        <div className="home-page__loading">Loading AI models...</div>
      ) : error ? (
        <div className="home-page__error">
          Failed to load AI models. Please try again later.
        </div>
      ) : filteredModels.length === 0 ? (
        <p className="home-page__no-results">
          No models found matching "{searchQuery}"
        </p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={categorizationMode}
            className={cn("home-page__providers-grid", {
              "home-page__providers-grid--usage":
                categorizationMode === "usage",
            })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {Object.entries(groupedModels).map(
              ([categoryName, categoryModels]) => (
                <motion.section
                  key={categoryName}
                  className="home-page__provider-section"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1,
                    ease: "easeOut",
                  }}
                >
                  {categorizationMode === "usage" ? (
                    <h2 className="home-page__provider-title">
                      {getCategoryDisplayName(categoryName)}
                    </h2>
                  ) : (
                    <h2 className="home-page__provider-title">
                      {categoryName}
                    </h2>
                  )}
                  <div className="home-page__grid">
                    {categoryModels.map((model, index) => (
                      <motion.button
                        type="button"
                        key={model.id}
                        className="home-page__tile"
                        onClick={() => handleTileClick(model)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + index * 0.05,
                          ease: "easeOut",
                        }}
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="home-page__tile-icon">
                          <img
                            src={getProviderIconPath(model.provider.slug)}
                            alt={`${model.provider} icon`}
                            className="home-page__tile-svg"
                          />
                        </div>
                        <div className="home-page__tile-name">{model.name}</div>
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
  );
};
