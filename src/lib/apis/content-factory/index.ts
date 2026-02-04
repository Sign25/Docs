import { CONTENT_FACTORY_API_BASE_URL } from '$lib/constants';

// Типы данных

// Информация о товаре в склейке
export interface GroupProduct {
	nm_id: string;
	sku: string;
	size?: string;
	color?: string;
}

// Данные товара
export interface ProductData {
	sku: string;
	nm_id?: string;
	title: string;
	description: string;
	media_urls: string[];
	video_url?: string;
	validation?: ValidationResult;
	// Данные о склейке (product group)
	imt_id?: string;
	group_count?: number;
	group_products?: GroupProduct[];
}

export interface GenerateRequest {
	sku?: string;
	url?: string;
	marketplace: 'wb' | 'ozon' | 'ym';
	// Флаг для применения ко всей склейке
	update_all_in_group?: boolean;
}

export interface ValidationIssue {
	field: string;
	message: string;
	severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
	is_valid: boolean;
	issues: ValidationIssue[];
}

export interface GenerateResponse {
	draft_id: string;
	sku: string;
	nm_id?: string;
	marketplace: string;
	title: string;
	description: string;
	seo_tags: string[];
	validation: ValidationResult;
	is_valid: boolean;
	created_at: string;
	// Информация о склейке в ответе
	imt_id?: string;
	group_count?: number;
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
 * Получить данные товара с информацией о склейке (product group)
 */
export const getProductWithGroup = async (sku: string): Promise<ProductData> => {
	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/product?sku=${encodeURIComponent(sku)}&include_group=true`, {
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
	// Флаг для применения ко всей склейке
	update_all_in_group?: boolean;
	// Конкретные nm_id для обновления (если не все в группе)
	target_nm_ids?: string[];
}

export interface ApproveResponse {
	success: boolean;
	draft_id: string;
	message: string;
	// Информация об обновлённых товарах
	updated_count?: number;
	updated_nm_ids?: string[];
}

/**
 * Утвердить черновик и опубликовать на маркетплейс
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

// Интерфейсы для списка черновиков

export interface DraftListItem {
	draft_id: string;
	sku: string;
	nm_id?: string;
	marketplace: 'wb' | 'ozon' | 'ym';
	title: string;
	status: 'pending' | 'approved' | 'published' | 'rejected';
	created_at: string;
	updated_at?: string;
	is_valid: boolean;
	imt_id?: string;
	group_count?: number;
}

export interface DraftListResponse {
	drafts: DraftListItem[];
	total: number;
	page: number;
	page_size: number;
}

/**
 * Получить список черновиков
 */
export const getDrafts = async (params?: {
	status?: 'pending' | 'approved' | 'published' | 'rejected';
	marketplace?: 'wb' | 'ozon' | 'ym';
	page?: number;
	page_size?: number;
}): Promise<DraftListResponse> => {
	const searchParams = new URLSearchParams();
	if (params?.status) searchParams.append('status', params.status);
	if (params?.marketplace) searchParams.append('marketplace', params.marketplace);
	if (params?.page) searchParams.append('page', String(params.page));
	if (params?.page_size) searchParams.append('page_size', String(params.page_size));

	const url = `${CONTENT_FACTORY_API_BASE_URL}/drafts${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Ошибка загрузки черновиков' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};

/**
 * Получить черновик по ID
 */
export const getDraft = async (draftId: string): Promise<GenerateResponse> => {
	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/drafts/${draftId}`, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Черновик не найден' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};

// Интерфейсы для пакетной обработки склеек

export interface BatchApplyRequest {
	draft_id: string;
	target_nm_ids: string[];
}

export interface BatchApplyResponse {
	success: boolean;
	total_count: number;
	success_count: number;
	failed_count: number;
	results: {
		nm_id: string;
		sku: string;
		success: boolean;
		error?: string;
	}[];
}

/**
 * Применить контент ко всем товарам в склейке
 */
export const batchApplyToGroup = async (draftId: string, targetNmIds: string[]): Promise<BatchApplyResponse> => {
	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/drafts/${draftId}/batch-apply`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			target_nm_ids: targetNmIds
		})
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Ошибка пакетного применения' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};

// Интерфейсы для Visual Prompting

export interface VisualPromptRequest {
	sku: string;
	known_issues?: string[];
	photo_requirements?: string[];
}

export interface VisualPromptResponse {
	sku: string;
	category?: string;
	problems: string[];
	recommendations: {
		title: string;
		text: string;
		list?: string[];
	}[];
}

/**
 * Сгенерировать ТЗ для дизайнера
 */
export const generateVisualPrompt = async (request: VisualPromptRequest): Promise<VisualPromptResponse> => {
	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/visual-prompt`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(request)
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Ошибка генерации ТЗ' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};

// Интерфейсы для статистики

export interface ContentStats {
	total_generated: number;
	total_published: number;
	approval_rate: number;
	avg_generation_time: number;
	by_marketplace: {
		marketplace: 'wb' | 'ozon' | 'ym';
		generated: number;
		published: number;
	}[];
}

/**
 * Получить статистику генераций
 */
export const getStats = async (): Promise<ContentStats> => {
	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/stats`, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Ошибка загрузки статистики' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};
