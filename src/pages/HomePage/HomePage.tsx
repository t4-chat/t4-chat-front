import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.scss';
import { providerIconPaths } from 'src/assets/icons/ai-providers/index';
import { aiModelService } from 'src/features/ai-providers/services/aiModelService';
import { AiModel } from 'src/features/ai-providers/types';
import { ReactComponent as SearchIcon } from 'src/assets/icons/chats/search.svg';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayModels, setDisplayModels] = useState<AiModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<AiModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const models = await aiModelService.getAll();
      
      setDisplayModels(models);
      setFilteredModels(models);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch AI models:', err);
      setError('Failed to load AI models. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const getProviderIconPath = (provider: string): string => {
    return providerIconPaths[provider.toLowerCase() as keyof typeof providerIconPaths] || providerIconPaths.default;
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredModels(displayModels);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = displayModels.filter(model => 
      model.name.toLowerCase().includes(query) || 
      model.provider.name.toLowerCase().includes(query)
    );
    
    setFilteredModels(filtered);
  }, [searchQuery, displayModels]);

  const handleTileClick = (model: AiModel): void => {
    navigate('/chat', { 
      state: { selectedModelId: model.id.toString() } 
    });
  };

  const handleClearSearch = (): void => {
    setSearchQuery('');
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
            className="home-page__search-clear"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="home-page__loading">Loading AI models...</div>
      ) : error ? (
        <div className="home-page__error">{error}</div>
      ) : filteredModels.length === 0 ? (
        <p className="home-page__no-results">No models found matching "{searchQuery}"</p>
      ) : (
        <div className="home-page__grid">
          {filteredModels.map((model) => (
            <div 
              key={model.id} 
              className="home-page__tile"
              onClick={() => handleTileClick(model)}
            >
              <div 
                className="home-page__tile-icon" 
              >
                <img 
                  src={getProviderIconPath(model.provider.slug)} 
                  alt={`${model.provider} icon`} 
                  className="home-page__tile-svg"
                />
              </div>
              <div className="home-page__tile-name">{model.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 