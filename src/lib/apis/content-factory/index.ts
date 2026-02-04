import { CONTENT_FACTORY_API_BASE_URL } from '$lib/constants';

// ============================================================================
// ТИПЫ ДАННЫХ (согласно API документации v1.0)
// ============================================================================

// Информация о товаре в склейке
export interface GroupProduct {
	sku: string;
	main_photo: string;
	vendor_code?: string;
}

// Проблема валидации
export interface ValidationIssue {
	field: string;
	message: string;
	severity: 'error' | 'warning' | 'info';
}

// Результат валидации
export interface ValidationResult {
	is_valid: boolean;
	issues: ValidationIssue[];
}

// Данные товара (GET /api/content/product)
export interface ProductData {
	sku: string;
	title: string;
	description: string;
	media_urls: string[];
	video_url?: string | null;
	// Склейка
	imt_id?: number | null;
	group_count?: number;
	products?: GroupProduct[];
	// Валидация
	validation?: ValidationResult;
}

// Запрос на генерацию контента
export interface GenerateRequest {
	url?: string;
	sku?: string;
	marketplace?: 'wb' | 'ozon' | 'ym'; // По умолчанию "wb"
}

// Ответ генерации (POST /api/content/generate)
export interface GenerateResponse {
	draft_id: string;
	sku: string;
	marketplace: string;
	title: string;
	description: string;
	seo_tags: string[];
	// Склейка
	imt_id?: number | null;
	group_nm_ids?: number[];
	// Валидация
	validation: ValidationResult;
	is_valid: boolean;
	validation_fixes?: object | null;
	// Мета
	created_at: string;
}

// Запрос на утверждение черновика
export interface DraftApproveRequest {
	title: string;
	description: string;
	seo_tags?: string[];
	update_all_in_group?: boolean;
}

// Ответ утверждения (POST /api/content/drafts/{draft_id}/approve)
export interface ApproveResponse {
	success: boolean;
	draft_id: string;
	message: string;
	updated_nm_ids?: number[];
}

// ============================================================================
// API ФУНКЦИИ
// ============================================================================

/**
 * Получить данные товара перед генерацией
 * GET /api/content/product
 *
 * @param params.url - Ссылка на товар WB
 * @param params.sku - Артикул товара (нужен marketplace)
 * @param params.marketplace - Маркетплейс: wb, ozon, ym
 */
export const getProduct = async (params: {
	url?: string;
	sku?: string;
	marketplace?: 'wb' | 'ozon' | 'ym';
}): Promise<ProductData> => {
	const searchParams = new URLSearchParams();

	if (params.url) {
		searchParams.append('url', params.url);
	} else if (params.sku) {
		searchParams.append('sku', params.sku);
		if (params.marketplace) {
			searchParams.append('marketplace', params.marketplace);
		}
	}

	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/product?${searchParams.toString()}`, {
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
 * Сгенерировать SEO-контент для товара
 * POST /api/content/generate
 *
 * @param request.url - Ссылка на товар
 * @param request.sku - Артикул товара
 * @param request.marketplace - Маркетплейс (по умолчанию "wb")
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
 * Перегенерировать контент с учётом пожеланий менеджера
 * POST /api/content/regenerate
 *
 * @param draftId - ID предыдущего черновика
 * @param managerNotes - Пожелания для AI (опционально)
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
			manager_notes: managerNotes || null
		})
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Ошибка перегенерации' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};

/**
 * Утвердить черновик и отправить на Wildberries
 * POST /api/content/drafts/{draft_id}/approve
 *
 * @param draftId - ID черновика
 * @param data.title - Финальное название
 * @param data.description - Финальное описание
 * @param data.seo_tags - SEO теги
 * @param data.update_all_in_group - Обновить все товары в склейке
 */
export const approveDraft = async (draftId: string, data: DraftApproveRequest): Promise<ApproveResponse> => {
	const response = await fetch(`${CONTENT_FACTORY_API_BASE_URL}/drafts/${draftId}/approve`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			title: data.title,
			description: data.description,
			seo_tags: data.seo_tags || [],
			update_all_in_group: data.update_all_in_group || false
		})
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'Ошибка публикации' }));
		throw new Error(error.detail || `HTTP ${response.status}`);
	}

	return response.json();
};

// ============================================================================
// LEGACY / ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ (для будущих эндпоинтов)
// ============================================================================

// Элемент списка черновиков (для будущего GET /api/content/drafts)
export interface DraftListItem {
	draft_id: string;
	sku: string;
	marketplace: 'wb' | 'ozon' | 'ym';
	title: string;
	status: 'pending' | 'approved' | 'published' | 'rejected';
	created_at: string;
	updated_at?: string;
	is_valid: boolean;
	imt_id?: number;
	group_count?: number;
}

export interface DraftListResponse {
	drafts: DraftListItem[];
	total: number;
	page: number;
	page_size: number;
}

/**
 * Получить список черновиков (если эндпоинт будет добавлен)
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
 * Получить черновик по ID (если эндпоинт будет добавлен)
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
