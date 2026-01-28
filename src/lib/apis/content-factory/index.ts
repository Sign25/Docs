import { CONTENT_FACTORY_API_BASE_URL } from '$lib/constants';

// Типы данных
export interface ProductData {
	sku: string;
	title: string;
	description: string;
	media_urls: string[];
	video_url?: string;
}

export interface GenerateRequest {
	sku?: string;
	url?: string;
	marketplace: 'wb' | 'ozon' | 'ym';
}

export interface ValidationIssue {
	field: string;
	message: string;
	severity: string;
}

export interface ValidationResult {
	is_valid: boolean;
	issues: ValidationIssue[];
}

export interface GenerateResponse {
	draft_id: string;
	sku: string;
	marketplace: string;
	title: string;
	description: string;
	seo_tags: string[];
	validation: ValidationResult;
	is_valid: boolean;
	created_at: string;
}

/**
 * Получить данные товара по артикулу
 */
export const getProduct = async (sku: string): Promise<ProductData> => {
	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/product?sku=${encodeURIComponent(sku)}`, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Ошибка загрузки товара' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};

/**
 * Сгенерировать контент для товара
 */
export const generateContent = async (request: GenerateRequest): Promise<GenerateResponse> => {
	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/generate`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(request)
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Ошибка генерации контента' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};

/**
 * Перегенерировать контент с заметками менеджера
 */
export const regenerateContent = async (draftId: string, managerNotes?: string): Promise<GenerateResponse> => {
	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/regenerate`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			draft_id: draftId,
			manager_notes: managerNotes
		})
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Ошибка перегенерации' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};

export interface DraftApproveRequest {
	title: string;
	description: string;
	seo_tags: string[];
}

export interface ApproveResponse {
	success: boolean;
	draft_id: string;
	message: string;
}

/**
 * Утвердить черновик и опубликовать на Wildberries
 */
export const approveDraft = async (draftId: string, data: DraftApproveRequest): Promise<ApproveResponse> => {
	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/drafts/${draftId}/approve`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Ошибка публикации' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};
