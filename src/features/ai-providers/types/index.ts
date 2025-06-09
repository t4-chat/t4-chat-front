export interface AiProviderModel {
	id: number;
	name: string;
}

export interface AiProvider {
	id: number;
	name: string;
	slug: string;
	models: AiProviderModel[];
}

export interface AiModel {
	id: number;
	name: string;
	provider: AiModelProvider;
}

export interface AiModelProvider {
	id: number;
	name: string;
	slug: string;
}
