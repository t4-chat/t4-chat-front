import { providerIconPaths } from "@/assets/icons/ai-providers/index";
import SearchIcon from "@/assets/icons/chats/search.svg?react";
import { useMemo, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAiModelsServiceGetApiAiModels } from "../../../openapi/queries/queries";
import "./HomePage.scss";
import type { AiModelResponse } from "~/openapi/requests/types.gen";
import { useMinimumLoading } from "@/hooks/useMinimumLoading";

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredModels = useMemo(() => {
    if (!query.trim()) return models;
    return models.filter(
      (model) =>
        model.name.toLowerCase().includes(query) ||
        model.provider.name.toLowerCase().includes(query),
    );
  }, [models, query]);

  const groupedModels = useMemo(() => {
    return filteredModels.reduce<Record<string, AiModelResponse[]>>(
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
  }, [filteredModels]);

  const handleTileClick = (model: AiModelResponse): void => {
    navigate("/chat", {
      state: { selectedModelId: model.id.toString() },
    });
  };

  const handleClearSearch = (): void => {
    setSearchQuery("");
  };

  return (
    <div className="home-page">
      <header className="home-page__header">
        <h1 className="home-page__main-title">
          Access the best AI models in one place
        </h1>
      </header>

      <div className="home-page__search-container">
        <SearchIcon width={16} height={16} className="home-page__search-icon" />
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
        <div className="home-page__providers-grid">
          {Object.entries(groupedModels).map(
            ([providerName, providerModels]) => (
              <section
                key={providerName}
                className="home-page__provider-section"
              >
                <h2 className="home-page__provider-title">{providerName}</h2>
                <div className="home-page__grid">
                  {providerModels.map((model) => (
                    <button
                      type="button"
                      key={model.id}
                      className="home-page__tile"
                      onClick={() => handleTileClick(model)}
                    >
                      <div className="home-page__tile-icon">
                        <img
                          src={getProviderIconPath(model.provider.slug)}
                          alt={`${model.provider} icon`}
                          className="home-page__tile-svg"
                        />
                      </div>
                      <div className="home-page__tile-name">{model.name}</div>
                    </button>
                  ))}
                </div>
              </section>
            ),
          )}
        </div>
      )}
    </div>
  );
};
