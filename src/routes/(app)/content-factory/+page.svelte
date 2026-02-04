<script lang="ts">
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { showSidebar, mobile } from '$lib/stores';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import Sidebar from '$lib/components/icons/Sidebar.svelte';
	import { WEBUI_BASE_URL } from '$lib/constants';
	import {
		getProduct,
		getProductWithGroup,
		generateContent,
		regenerateContent,
		approveDraft,
		batchApplyToGroup,
		type ProductData,
		type ValidationResult,
		type GroupProduct
	} from '$lib/apis/content-factory';

	const i18n = getContext('i18n');

	// Режим обработки: null - не выбран, 'single' - один артикул, 'batch' - пакетная
	let processingMode: 'single' | 'batch' | null = null;

	// Текущий шаг: 1 - ввод данных, 2 - карточка товара, 3 - результат генерации
	let currentStep: 1 | 2 | 3 = 1;

	// Данные для пакетной обработки (размеры)
	let batchSizes: {
		nmId: string;
		sku: string;
		size: string;
		color: string;
		selected: boolean;
		status: 'pending' | 'processing' | 'success' | 'error';
		error?: string;
	}[] = [];
	let isBatchProcessing = false;

	// Очередь для автоматической обработки
	let batchQueue: {
		id: string;
		name: string;
		sku: string;
		marketplace: 'wb' | 'ozon' | 'ym';
		status: 'pending' | 'processing' | 'success' | 'error';
		error?: string;
		photos?: string[];
	}[] = [];
	let showAddBatchModal = false;
	let addBatchInputMode: 'sku' | 'link' = 'sku';
	let addBatchSku = '';
	let addBatchLink = '';
	let addBatchMarketplace: 'wb' | 'ozon' | 'ym' = 'wb';
	let isAddingBatchItem = false;

	// Режим ввода: 'sku' или 'link'
	let inputMode: 'sku' | 'link' = 'sku';

	// Поля формы
	let skuInput = '';
	let linkInput = '';
	let selectedMarketplace: 'wb' | 'ozon' | 'ym' = 'wb';

	// Данные товара
	let productData: {
		marketplace: 'wb' | 'ozon' | 'ym';
		sku: string;
		nm_id?: string;
		photos: string[];
		title: string;
		description: string;
		validation?: ValidationResult;
		// Данные о склейке
		imt_id?: string;
		group_count?: number;
		group_products?: GroupProduct[];
	} | null = null;

	// Индекс текущей фотографии в галерее
	let currentPhotoIndex = 0;

	// Состояние загрузки
	let isLoading = false;
	let isGenerating = false;
	let isApproving = false;
	let applyToGroup = false;

	// Данные сгенерированного черновика
	let draftData: {
		draft_id: string;
		seo_tags: string[];
		validation: ValidationResult;
	} | null = null;

	// Заметки менеджера для перегенерации
	let managerNotes = '';

	// Активная секция
	let activeSection: 'generate' | 'drafts' | 'visual-prompt' | 'stats' = 'generate';

	// Моковые данные для черновиков
	const mockDrafts = [
		{ id: 'draft_a1b2', sku: 'OM-12345', mp: 'wb', status: 'pending', created: '15.01 10:30' },
		{ id: 'draft_c3d4', sku: 'OM-12346', mp: 'wb', status: 'pending', created: '15.01 10:35' },
		{ id: 'draft_e5f6', sku: 'OK-555', mp: 'ozon', status: 'approved', created: '14.01 15:20' },
		{ id: 'draft_g7h8', sku: 'OM-12340', mp: 'ozon', status: 'processing', created: '14.01 14:00' },
		{ id: 'draft_i9j0', sku: 'OK-560', mp: 'ym', status: 'published', created: '13.01 11:00' }
	];

	// Статистика
	const stats = [
		{ value: '156', label: 'Сгенерировано' },
		{ value: '142', label: 'Опубликовано' },
		{ value: '91%', label: 'Одобрено' },
		{ value: '2.3 мин', label: 'Ср. время' }
	];

	// Данные для ТЗ дизайнеру
	const visualPromptData = {
		sku: 'OK-555',
		product: 'Платье детское',
		problems: [
			'Непонятный размер на фото',
			'Цвет отличается от реального',
			'Нет фото деталей (застёжка, бирка)'
		],
		recommendations: [
			{
				title: 'Демонстрация размера',
				text: 'Добавить фото с моделью соответствующего возраста. Показать платье на ребёнке 5-6 лет для размера 116.'
			},
			{
				title: 'Точная цветопередача',
				text: 'Съёмка при естественном освещении. Добавить фото ткани крупным планом.'
			},
			{
				title: 'Детали',
				text: 'Сфотографировать:',
				list: ['Застёжку крупным планом', 'Бирку с составом', 'Изнаночную сторону']
			}
		]
	};

	function getStatusBadgeClass(status: string): string {
		switch(status) {
			case 'pending': return 'cf-badge-pending';
			case 'approved': return 'cf-badge-approved';
			case 'published': return 'cf-badge-published';
			case 'processing': return 'cf-badge-processing';
			default: return '';
		}
	}

	function getStatusText(status: string): string {
		switch(status) {
			case 'pending': return 'ожидает';
			case 'approved': return 'утверждён';
			case 'published': return 'опубликован';
			case 'processing': return 'обработка';
			default: return status;
		}
	}

	// Маркетплейсы
	const marketplaces = [
		{ id: 'wb', name: 'Wildberries', short: 'WB', color: '#CB11AB' },
		{ id: 'ozon', name: 'Ozon', short: 'Ozon', color: '#005BFF' },
		{ id: 'ym', name: 'Яндекс.Маркет', short: 'Я.М', color: '#FFCC00' }
	];

	// Определение маркетплейса по ссылке
	function detectMarketplace(url: string): 'wb' | 'ozon' | 'ym' | null {
		const lower = url.toLowerCase();
		if (lower.includes('wildberries.ru') || lower.includes('wb.ru')) return 'wb';
		if (lower.includes('ozon.ru')) return 'ozon';
		if (lower.includes('market.yandex.ru') || lower.includes('ya.ru')) return 'ym';
		return null;
	}

	// Извлечение артикула из ссылки
	function extractSkuFromUrl(url: string): string | null {
		const wbMatch = url.match(/wildberries\.ru\/catalog\/(\d+)/i);
		if (wbMatch) return wbMatch[1];

		const ozonMatch = url.match(/ozon\.ru\/product\/[^\/]*-(\d+)/i);
		if (ozonMatch) return ozonMatch[1];

		const ymMatch = url.match(/market\.yandex\.ru\/product[^\/]*\/(\d+)/i);
		if (ymMatch) return ymMatch[1];

		const genericMatch = url.match(/(\d{6,})/);
		if (genericMatch) return genericMatch[1];

		return null;
	}

	// Обработка нажатия "Далее"
	async function handleNext() {
		let sku: string | null = null;
		let marketplace: 'wb' | 'ozon' | 'ym' = selectedMarketplace;

		if (inputMode === 'sku') {
			if (!skuInput.trim()) {
				toast.error('Введите артикул товара');
				return;
			}
			sku = skuInput.trim();
		} else {
			if (!linkInput.trim()) {
				toast.error('Введите ссылку на товар');
				return;
			}

			const detected = detectMarketplace(linkInput);
			if (!detected) {
				toast.error('Не удалось определить маркетплейс из ссылки');
				return;
			}
			marketplace = detected;

			sku = extractSkuFromUrl(linkInput);
			if (!sku) {
				toast.error('Не удалось извлечь артикул из ссылки');
				return;
			}
		}

		isLoading = true;
		try {
			// Для batch режима получаем информацию о склейке
			const data = processingMode === 'batch'
				? await getProductWithGroup(sku)
				: await getProduct(sku);

			productData = {
				marketplace,
				sku,
				nm_id: data.nm_id,
				photos: data.media_urls || [],
				title: data.title || '',
				description: data.description || '',
				validation: data.validation,
				// Данные о склейке
				imt_id: data.imt_id,
				group_count: data.group_count,
				group_products: data.group_products
			};

			// Инициализация списка размеров для batch режима
			if (processingMode === 'batch' && data.group_products) {
				batchSizes = data.group_products.map(p => ({
					nmId: p.nm_id,
					sku: p.sku,
					size: p.size || '',
					color: p.color || '',
					selected: true,
					status: 'pending' as const
				}));
			}

			currentPhotoIndex = 0;
			currentStep = 2;
		} catch (error: any) {
			toast.error(error.message || 'Ошибка загрузки данных товара');
			console.error('Error loading product:', error);
		} finally {
			isLoading = false;
		}
	}

	// Возврат к шагу 1
	function handleBack() {
		currentStep = 1;
		productData = null;
		draftData = null;
		currentPhotoIndex = 0;
		managerNotes = '';
	}

	// Возврат к шагу 2
	function handleBackToEdit() {
		currentStep = 2;
	}

	// Возврат к выбору режима
	function handleBackToModeSelection() {
		processingMode = null;
		currentStep = 1;
		productData = null;
		draftData = null;
		skuInput = '';
		linkInput = '';
		batchSizes = [];
		batchQueue = [];
		currentPhotoIndex = 0;
		managerNotes = '';
	}

	// Добавить товар в очередь и сразу начать обработку
	async function handleAddToBatchQueue() {
		let sku: string | null = null;
		let marketplace: 'wb' | 'ozon' | 'ym' = addBatchMarketplace;

		if (addBatchInputMode === 'sku') {
			if (!addBatchSku.trim()) {
				toast.error('Введите артикул товара');
				return;
			}
			sku = addBatchSku.trim();
		} else {
			if (!addBatchLink.trim()) {
				toast.error('Введите ссылку на товар');
				return;
			}

			const detected = detectMarketplace(addBatchLink);
			if (!detected) {
				toast.error('Не удалось определить маркетплейс по ссылке');
				return;
			}
			marketplace = detected;
			sku = extractSkuFromUrl(addBatchLink);
		}

		if (!sku) {
			toast.error('Не удалось определить артикул товара');
			return;
		}

		// Проверка на дубликат
		if (batchQueue.some(item => item.sku === sku && item.marketplace === marketplace)) {
			toast.error('Этот товар уже добавлен в очередь');
			return;
		}

		isAddingBatchItem = true;

		const itemId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		try {
			// Получаем данные товара для отображения названия и фото
			const data = await getProduct(sku, marketplace);

			// Добавляем в очередь сразу со статусом processing
			batchQueue = [...batchQueue, {
				id: itemId,
				name: data.title || `Товар ${sku}`,
				sku: sku,
				marketplace: marketplace,
				status: 'processing',
				photos: data.media_urls?.slice(0, 3)
			}];

			// Очищаем поля модального окна
			addBatchSku = '';
			addBatchLink = '';
			showAddBatchModal = false;
			isAddingBatchItem = false;

			// Автоматически запускаем обработку этого товара
			await processQueueItem(itemId, sku, marketplace, data);

		} catch (error: any) {
			toast.error(error.message || 'Ошибка загрузки данных товара');
			isAddingBatchItem = false;
		}
	}

	// Обработать один элемент очереди
	async function processQueueItem(itemId: string, sku: string, marketplace: 'wb' | 'ozon' | 'ym', productInfo?: any) {
		try {
			// Если данные товара не переданы, получаем их
			if (!productInfo) {
				productInfo = await getProductWithGroup(sku, marketplace);
			} else {
				// Получаем информацию о группе
				productInfo = await getProductWithGroup(sku, marketplace);
			}

			// Генерируем контент
			const generated = await generateContent({
				sku: sku,
				marketplace: marketplace,
				nm_id: productInfo.nm_id
			});

			// Если есть склейка, применяем ко всем
			if (productInfo.group_products && productInfo.group_products.length > 0) {
				const targetNmIds = productInfo.group_products.map((p: GroupProduct) => p.nm_id);
				await batchApplyToGroup(generated.draft_id, targetNmIds);
			} else {
				// Применяем только к этому товару
				await approveDraft(generated.draft_id, {
					title: productInfo.title,
					description: productInfo.description,
					seo_tags: generated.seo_tags || [],
					update_all_in_group: false
				});
			}

			// Успех
			batchQueue = batchQueue.map(q =>
				q.id === itemId ? { ...q, status: 'success' as const } : q
			);
			toast.success(`Товар ${sku} обработан успешно`);

		} catch (error: any) {
			// Ошибка
			batchQueue = batchQueue.map(q =>
				q.id === itemId ? { ...q, status: 'error' as const, error: error.message } : q
			);
			toast.error(`Ошибка обработки ${sku}: ${error.message}`);
		}
	}

	// Удалить товар из очереди
	function handleRemoveFromBatchQueue(id: string) {
		batchQueue = batchQueue.filter(item => item.id !== id);
	}

	// Запустить автоматическую обработку очереди
	async function handleStartBatchProcessing() {
		if (batchQueue.length === 0) {
			toast.error('Очередь пуста');
			return;
		}

		isBatchProcessing = true;

		for (let i = 0; i < batchQueue.length; i++) {
			const item = batchQueue[i];
			if (item.status !== 'pending') continue;

			// Обновляем статус на processing
			batchQueue = batchQueue.map((q, idx) =>
				idx === i ? { ...q, status: 'processing' as const } : q
			);

			try {
				// Получаем данные товара с группой
				const productInfo = await getProductWithGroup(item.sku, item.marketplace);

				// Генерируем контент
				const generated = await generateContent({
					sku: item.sku,
					marketplace: item.marketplace,
					nm_id: productInfo.nm_id
				});

				// Если есть склейка, применяем ко всем
				if (productInfo.group_products && productInfo.group_products.length > 0) {
					const targetNmIds = productInfo.group_products.map(p => p.nm_id);
					await batchApplyToGroup(generated.draft_id, targetNmIds);
				} else {
					// Применяем только к этому товару
					await approveDraft(generated.draft_id, {
						title: productInfo.title,
						description: productInfo.description,
						update_all_in_group: false
					});
				}

				// Успех
				batchQueue = batchQueue.map((q, idx) =>
					idx === i ? { ...q, status: 'success' as const } : q
				);
			} catch (error: any) {
				// Ошибка
				batchQueue = batchQueue.map((q, idx) =>
					idx === i ? { ...q, status: 'error' as const, error: error.message } : q
				);
			}
		}

		isBatchProcessing = false;

		const successCount = batchQueue.filter(q => q.status === 'success').length;
		const errorCount = batchQueue.filter(q => q.status === 'error').length;

		if (errorCount === 0) {
			toast.success(`Все ${successCount} товаров обработаны успешно!`);
		} else {
			toast.warning(`Обработано: ${successCount}, ошибок: ${errorCount}`);
		}
	}

	// Получить цвет статуса для batch очереди
	function getBatchStatusColor(status: string): string {
		switch (status) {
			case 'pending': return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
			case 'processing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
			case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
			case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
			default: return 'bg-gray-200 dark:bg-gray-700';
		}
	}

	function getBatchStatusText(status: string): string {
		switch (status) {
			case 'pending': return 'В очереди';
			case 'processing': return 'Обработка...';
			case 'success': return 'Готово';
			case 'error': return 'Ошибка';
			default: return status;
		}
	}

	// Пакетная обработка - применить ко всем размерам
	async function handleBatchApply() {
		if (!productData || !draftData) return;

		const selectedSizes = batchSizes.filter(s => s.selected);
		if (selectedSizes.length === 0) {
			toast.error('Выберите хотя бы один размер');
			return;
		}

		isBatchProcessing = true;

		// Обновляем статусы на processing
		batchSizes = batchSizes.map(s =>
			s.selected ? { ...s, status: 'processing' as const } : s
		);

		try {
			const result = await batchApplyToGroup(
				draftData.draft_id,
				selectedSizes.map(s => s.nmId)
			);

			// Обновляем статусы на основе результата
			batchSizes = batchSizes.map(s => {
				if (!s.selected) return s;
				const itemResult = result.results.find(r => r.nm_id === s.nmId);
				if (itemResult) {
					return {
						...s,
						status: itemResult.success ? 'success' as const : 'error' as const,
						error: itemResult.error
					};
				}
				return s;
			});

			if (result.success) {
				toast.success(`Контент применён к ${result.success_count} из ${result.total_count} товаров`);
			} else {
				toast.warning(`Применено: ${result.success_count}, ошибок: ${result.failed_count}`);
			}
		} catch (error: any) {
			// Помечаем все как ошибки
			batchSizes = batchSizes.map(s =>
				s.selected ? { ...s, status: 'error' as const, error: error.message } : s
			);
			toast.error(error.message || 'Ошибка пакетной обработки');
		} finally {
			isBatchProcessing = false;
		}
	}

	// Выбрать/снять все размеры
	function toggleAllSizes(select: boolean) {
		batchSizes = batchSizes.map(s => ({ ...s, selected: select }));
	}

	// Генерация контента
	async function handleGenerate() {
		if (!productData) return;

		isGenerating = true;
		try {
			const result = await generateContent({
				sku: productData.sku,
				marketplace: productData.marketplace
			});

			productData.title = result.title;
			productData.description = result.description;

			draftData = {
				draft_id: result.draft_id,
				seo_tags: result.seo_tags,
				validation: result.validation
			};

			currentStep = 3;
			toast.success('Контент успешно сгенерирован!');
		} catch (error: any) {
			toast.error(error.message || 'Ошибка генерации контента');
			console.error('Error generating:', error);
		} finally {
			isGenerating = false;
		}
	}

	// Перегенерация контента
	async function handleRegenerate() {
		if (!draftData) return;

		isGenerating = true;
		try {
			const result = await regenerateContent(draftData.draft_id, managerNotes || undefined);

			if (productData) {
				productData.title = result.title;
				productData.description = result.description;
			}

			draftData = {
				draft_id: result.draft_id,
				seo_tags: result.seo_tags,
				validation: result.validation
			};

			managerNotes = '';
			toast.success('Контент перегенерирован!');
		} catch (error: any) {
			toast.error(error.message || 'Ошибка перегенерации');
			console.error('Error regenerating:', error);
		} finally {
			isGenerating = false;
		}
	}

	// Утверждение и публикация
	async function handleApprove(toGroup: boolean = false) {
		if (!draftData || !productData) return;

		isApproving = true;
		applyToGroup = toGroup;

		try {
			if (toGroup && productData.group_products && productData.group_products.length > 0) {
				// Применить ко всей склейке
				const targetNmIds = productData.group_products.map(p => p.nm_id);
				const result = await batchApplyToGroup(draftData.draft_id, targetNmIds);

				if (result.success) {
					toast.success(`Контент применён к ${result.success_count} из ${result.total_count} товаров`);
				} else {
					toast.warning(`Применено: ${result.success_count}, ошибок: ${result.failed_count}`);
				}
			} else {
				// Применить только к одному товару
				const result = await approveDraft(draftData.draft_id, {
					title: productData.title,
					description: productData.description,
					seo_tags: draftData.seo_tags,
					update_all_in_group: false
				});

				toast.success(result.message || 'Карточка опубликована!');
			}

			// Сброс и возврат к началу
			handleBack();
		} catch (error: any) {
			toast.error(error.message || 'Ошибка публикации');
			console.error('Error approving:', error);
		} finally {
			isApproving = false;
			applyToGroup = false;
		}
	}

	// Навигация по фотографиям
	function nextPhoto() {
		if (productData && currentPhotoIndex < productData.photos.length - 1) {
			currentPhotoIndex++;
		}
	}

	function prevPhoto() {
		if (currentPhotoIndex > 0) {
			currentPhotoIndex--;
		}
	}

	// Закрытие сайдбара на мобильных
	const handlePageClick = () => {
		if ($mobile && $showSidebar) {
			showSidebar.set(false);
		}
	};
</script>

<svelte:head>
	<title>Контент-Фабрика | Adolf</title>
</svelte:head>

<style>
	/* Content Factory Module Styles - Neutral Theme */
	.cf-container {
		--cf-text-primary: #1F2937;
		--cf-text-secondary: #6B7280;
		--cf-text-tertiary: #9CA3AF;
		--cf-bg-primary: #FFFFFF;
		--cf-bg-secondary: #F9FAFB;
		--cf-border: #E5E7EB;
		--cf-accent: #1F2937;
		--cf-success: #10B981;
		--cf-warning: #F59E0B;
		--cf-error: #EF4444;
	}

	:global(.dark) .cf-container {
		--cf-text-primary: #F9FAFB;
		--cf-text-secondary: #D1D5DB;
		--cf-text-tertiary: #9CA3AF;
		--cf-bg-primary: #1F2937;
		--cf-bg-secondary: #374151;
		--cf-border: #4B5563;
		--cf-accent: #F9FAFB;
	}

	/* Buttons */
	.cf-btn {
		padding: 0.75rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.2s;
		border: 1px solid var(--cf-border);
		background: var(--cf-bg-primary);
		color: var(--cf-text-primary);
	}

	.cf-btn:hover {
		background: var(--cf-bg-secondary);
	}

	.cf-btn-primary {
		background: var(--cf-text-primary);
		color: var(--cf-bg-primary);
		border-color: var(--cf-text-primary);
	}

	.cf-btn-primary:hover {
		opacity: 0.9;
	}

	.cf-btn-success {
		background: var(--cf-success);
		color: white;
		border-color: var(--cf-success);
	}

	/* Tabs */
	.cf-tabs {
		display: flex;
		border-bottom: 1px solid var(--cf-border);
	}

	.cf-tab {
		flex: 1;
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--cf-text-secondary);
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
		cursor: pointer;
		background: none;
		border-top: none;
		border-left: none;
		border-right: none;
		text-align: center;
	}

	.cf-tab:hover {
		color: var(--cf-text-primary);
	}

	.cf-tab.active {
		color: var(--cf-text-primary);
		border-bottom-color: var(--cf-text-primary);
	}

	/* Cards */
	.cf-card {
		background: var(--cf-bg-primary);
		border: 1px solid var(--cf-border);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.cf-card-header {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--cf-border);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.cf-card-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--cf-text-primary);
	}

	.cf-card-body {
		padding: 1.25rem;
	}

	/* Form elements */
	.cf-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid var(--cf-border);
		border-radius: 0.5rem;
		background: var(--cf-bg-secondary);
		color: var(--cf-text-primary);
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.cf-input:focus {
		outline: none;
		border-color: var(--cf-text-primary);
		box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .cf-input:focus {
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
	}

	.cf-label {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--cf-text-tertiary);
		margin-bottom: 0.5rem;
	}

	/* Tags */
	.cf-tag {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: var(--cf-bg-secondary);
		border: 1px solid var(--cf-border);
		border-radius: 9999px;
		font-size: 0.75rem;
		color: var(--cf-text-secondary);
	}

	/* Badges */
	.cf-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.cf-badge-pending {
		background: #FEF3C7;
		color: #D97706;
	}

	.cf-badge-approved {
		background: #D1FAE5;
		color: #059669;
	}

	.cf-badge-published {
		background: #DBEAFE;
		color: #2563EB;
	}

	:global(.dark) .cf-badge-pending {
		background: #78350F;
		color: #FBBF24;
	}

	:global(.dark) .cf-badge-approved {
		background: #064E3B;
		color: #34D399;
	}

	:global(.dark) .cf-badge-published {
		background: #1E3A5F;
		color: #60A5FA;
	}

	/* Validation */
	.cf-validation {
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--cf-border);
	}

	.cf-validation.success {
		background: #D1FAE5;
		border-color: #A7F3D0;
	}

	.cf-validation.warning {
		background: #FEF3C7;
		border-color: #FDE68A;
	}

	:global(.dark) .cf-validation.success {
		background: #064E3B;
		border-color: #065F46;
	}

	:global(.dark) .cf-validation.warning {
		background: #78350F;
		border-color: #92400E;
	}

	.cf-validation-title {
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.cf-validation-title.success {
		color: #059669;
	}

	.cf-validation-title.warning {
		color: #D97706;
	}

	:global(.dark) .cf-validation-title.success {
		color: #34D399;
	}

	:global(.dark) .cf-validation-title.warning {
		color: #FBBF24;
	}

	/* Actions */
	.cf-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		padding: 1rem 1.25rem;
		border-top: 1px solid var(--cf-border);
	}

	/* Meta */
	.cf-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.cf-meta-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	.cf-meta-label {
		color: var(--cf-text-tertiary);
	}

	.cf-meta-value {
		color: var(--cf-text-primary);
		font-weight: 500;
	}

	.cf-meta-value.mono {
		font-family: ui-monospace, monospace;
	}

	/* Counter */
	.cf-counter {
		font-size: 0.75rem;
		color: var(--cf-text-tertiary);
	}

	/* Mode selection cards */
	.cf-mode-card {
		background: var(--cf-bg-primary);
		border: 2px solid var(--cf-border);
		border-radius: 1rem;
		padding: 2rem;
		cursor: pointer;
		transition: all 0.2s;
		text-align: center;
	}

	.cf-mode-card:hover {
		border-color: var(--cf-text-primary);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .cf-mode-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.cf-mode-icon {
		width: 4rem;
		height: 4rem;
		margin: 0 auto 1rem;
		border-radius: 1rem;
		background: var(--cf-bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cf-mode-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--cf-text-primary);
		margin-bottom: 0.5rem;
	}

	.cf-mode-desc {
		font-size: 0.875rem;
		color: var(--cf-text-secondary);
	}

	/* MP Badge */
	.cf-mp-badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.cf-mp-badge.wb { background: #CB11AB; color: white; }
	.cf-mp-badge.ozon { background: #005BFF; color: white; }
	.cf-mp-badge.ym { background: #FFCC00; color: black; }

	/* Drafts List */
	.cf-draft-list {
		background: var(--cf-bg-primary);
		border: 1px solid var(--cf-border);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.cf-draft-list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		background: var(--cf-bg-secondary);
		border-bottom: 1px solid var(--cf-border);
	}

	.cf-draft-list-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--cf-text-primary);
		margin: 0;
	}

	.cf-draft-list-count {
		font-size: 0.875rem;
		font-weight: 400;
		color: var(--cf-text-secondary);
	}

	/* Drafts Table */
	.cf-drafts-table {
		width: 100%;
		border-collapse: collapse;
	}

	.cf-drafts-table th,
	.cf-drafts-table td {
		padding: 0.75rem 1rem;
		text-align: left;
		border-bottom: 1px solid var(--cf-border);
	}

	.cf-drafts-table th {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--cf-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: var(--cf-bg-secondary);
	}

	.cf-drafts-table td {
		font-size: 0.875rem;
		color: var(--cf-text-primary);
	}

	.cf-drafts-table tbody tr {
		cursor: pointer;
		transition: background-color 0.15s;
	}

	.cf-drafts-table tbody tr:hover {
		background: var(--cf-bg-secondary);
	}

	.cf-draft-id {
		font-family: ui-monospace, monospace;
		font-size: 0.75rem;
		color: var(--cf-text-secondary);
	}

	/* Badge Processing */
	.cf-badge-processing {
		background: #DBEAFE;
		color: #2563EB;
	}

	:global(.dark) .cf-badge-processing {
		background: #1E3A5F;
		color: #60A5FA;
	}

	/* Visual Prompt */
	.cf-visual-prompt {
		background: var(--cf-bg-primary);
		border: 1px solid var(--cf-border);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.cf-visual-prompt-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 1.25rem;
		background: #FEF3C7;
		border-bottom: 1px solid var(--cf-border);
	}

	:global(.dark) .cf-visual-prompt-header {
		background: #78350F;
	}

	.cf-visual-prompt-body {
		padding: 1.25rem;
	}

	.cf-visual-prompt-section {
		margin-bottom: 1.5rem;
	}

	.cf-visual-prompt-section:last-child {
		margin-bottom: 0;
	}

	.cf-visual-prompt-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--cf-text-primary);
		margin: 0 0 0.75rem 0;
	}

	/* Problems List */
	.cf-problems {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.cf-problem-item {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.5rem 0;
		font-size: 0.875rem;
		color: var(--cf-text-primary);
	}

	.cf-problem-icon {
		color: var(--cf-error);
		flex-shrink: 0;
		margin-top: 2px;
	}

	/* Recommendations */
	.cf-recommendation {
		background: var(--cf-bg-secondary);
		border-radius: 0.5rem;
		padding: 1rem;
		margin-bottom: 0.75rem;
	}

	.cf-recommendation:last-child {
		margin-bottom: 0;
	}

	.cf-recommendation-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		font-size: 0.75rem;
		font-weight: 700;
		background: var(--cf-text-primary);
		color: var(--cf-bg-primary);
		border-radius: 9999px;
		margin-right: 0.5rem;
	}

	.cf-recommendation-title {
		display: inline;
		font-weight: 600;
		color: var(--cf-text-primary);
	}

	.cf-recommendation-text {
		font-size: 0.875rem;
		color: var(--cf-text-secondary);
		margin-top: 0.5rem;
		line-height: 1.6;
	}

	.cf-recommendation-list {
		list-style: disc;
		margin: 0.5rem 0 0 1.5rem;
		padding: 0;
	}

	.cf-recommendation-list li {
		font-size: 0.875rem;
		color: var(--cf-text-secondary);
		padding: 0.25rem 0;
	}

	/* Statistics */
	.cf-stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.cf-stats {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.cf-stat-card {
		background: var(--cf-bg-secondary);
		border: 1px solid var(--cf-border);
		border-radius: 0.5rem;
		padding: 1rem;
		text-align: center;
	}

	.cf-stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--cf-text-primary);
	}

	.cf-stat-label {
		font-size: 0.75rem;
		color: var(--cf-text-secondary);
		margin-top: 0.25rem;
	}

	/* Generating State */
	.cf-generating {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		text-align: center;
	}

	.cf-generating-spinner {
		width: 48px;
		height: 48px;
		border: 3px solid var(--cf-border);
		border-top-color: var(--cf-text-primary);
		border-radius: 50%;
		animation: cf-spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes cf-spin {
		to { transform: rotate(360deg); }
	}

	.cf-generating-text {
		font-size: 0.875rem;
		color: var(--cf-text-secondary);
	}

	.cf-generating-progress {
		width: 200px;
		height: 4px;
		background: var(--cf-border);
		border-radius: 9999px;
		margin-top: 1rem;
		overflow: hidden;
	}

	.cf-generating-progress-bar {
		height: 100%;
		background: var(--cf-text-primary);
		animation: cf-progress 2s ease-in-out infinite;
	}

	@keyframes cf-progress {
		0% { width: 0%; }
		50% { width: 70%; }
		100% { width: 100%; }
	}

	/* Action Buttons */
	.cf-btn-approve {
		background: var(--cf-success);
		color: white;
		border-color: var(--cf-success);
	}

	.cf-btn-approve:hover {
		opacity: 0.9;
	}

	.cf-btn-edit {
		background: var(--cf-warning);
		color: white;
		border-color: var(--cf-warning);
	}

	.cf-btn-edit:hover {
		opacity: 0.9;
	}

	.cf-btn-regenerate {
		background: transparent;
		color: var(--cf-text-secondary);
		border-color: var(--cf-border);
	}

	.cf-btn-regenerate:hover {
		background: var(--cf-bg-secondary);
		color: var(--cf-text-primary);
	}

	/* Module Tab (unified style) */
	.module-tab {
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	/* Divider */
	.cf-divider {
		border: none;
		border-top: 1px solid var(--cf-border);
		margin: 1rem 0;
	}
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="cf-container h-screen max-h-[100dvh] w-full flex flex-col overflow-x-hidden overflow-y-auto transition-all duration-300 {$showSidebar
		? 'md:max-w-[calc(100%-var(--sidebar-width))] md:ml-[var(--sidebar-width)]'
		: ''}"
	on:click={handlePageClick}
	role="main"
>
	<!-- Header -->
	<div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
		<div class="flex items-center gap-2 sm:gap-3">
			{#if $mobile}
				<button
					class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
					on:click|stopPropagation={() => showSidebar.set(!$showSidebar)}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			{/if}
			<img
				src="{WEBUI_BASE_URL}/static/content-factory-icon.svg?v=1.2.29"
				class="size-7 sm:size-8 dark:invert"
				alt=""
			/>
			<h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Контент-Фабрика</h1>
		</div>
		<div class="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
			<span>{stats[0].value} сгенерировано</span>
			<span class="text-gray-300 dark:text-gray-600">|</span>
			<span>{stats[2].value} одобрено</span>
		</div>
	</div>

	<!-- Navigation Tabs -->
	<div class="flex items-center justify-center gap-2 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto">
		<button
			class="module-tab px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap {activeSection === 'generate' ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}"
			on:click={() => activeSection = 'generate'}
		>
			📝 Генерация
		</button>
		<Tooltip content="<span style='font-size: 14px;'>🔧 Раздел в разработке...</span>" placement="bottom">
			<button
				class="module-tab px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-60"
			>
				📋 Черновики <span class="ml-1">🔒</span>
			</button>
		</Tooltip>
		<Tooltip content="<span style='font-size: 14px;'>🔧 Раздел в разработке...</span>" placement="bottom">
			<button
				class="module-tab px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-60"
			>
				📸 ТЗ дизайнеру <span class="ml-1">🔒</span>
			</button>
		</Tooltip>
		<Tooltip content="<span style='font-size: 14px;'>🔧 Раздел в разработке...</span>" placement="bottom">
			<button
				class="module-tab px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-60"
			>
				📊 Статистика <span class="ml-1">🔒</span>
			</button>
		</Tooltip>
	</div>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">

		{#if activeSection === 'generate'}
			{#if processingMode === null}
				<!-- ЭКРАН ВЫБОРА РЕЖИМА -->
				<div class="w-full max-w-md sm:max-w-lg md:max-w-xl mt-4 sm:mt-6 md:mt-8">
					<!-- Заголовок -->
					<div class="text-center mb-6 sm:mb-8 md:mb-10">
						<div class="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
							<img
								src="{WEBUI_BASE_URL}/static/content-factory-icon.svg?v=1.1.40"
								class="size-8 sm:size-9 md:size-10 dark:invert"
								alt=""
							/>
							<h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
								Контент-Фабрика
							</h1>
						</div>
						<p class="text-sm sm:text-base text-gray-500 dark:text-gray-400">
							Выберите режим обработки
						</p>
					</div>

					<!-- Карточки выбора режима -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
					<!-- Один артикул -->
					<button
						type="button"
						on:click={() => processingMode = 'single'}
						class="cf-mode-card group"
					>
						<div class="cf-mode-icon group-hover:scale-110 transition-transform">
							<svg class="size-7 sm:size-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<h3 class="cf-mode-title">Ручная обработка</h3>
						<p class="cf-mode-desc">Генерация контента для одного товара</p>
					</button>

					<!-- Пакетная обработка -->
					<button
						type="button"
						on:click={() => processingMode = 'batch'}
						class="cf-mode-card group"
					>
						<div class="cf-mode-icon group-hover:scale-110 transition-transform">
							<svg class="size-7 sm:size-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
							</svg>
						</div>
						<h3 class="cf-mode-title">Автоматическая обработка</h3>
						<p class="cf-mode-desc">Применить контент ко всем размерам карточки</p>
					</button>
				</div>
				</div>
			{:else if currentStep === 1}
			<!-- ШАГ 1: Ввод данных -->
			{#if processingMode === 'batch'}
				<!-- АВТОМАТИЧЕСКАЯ ОБРАБОТКА - Таблица очереди -->
				<div class="w-full max-w-2xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl mt-4 sm:mt-6 md:mt-8">
					<!-- Заголовок -->
					<div class="text-center mb-4 sm:mb-6 md:mb-8">
						<div class="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
							<img
								src="{WEBUI_BASE_URL}/static/content-factory-icon.svg?v=1.1.40"
								class="size-7 sm:size-8 md:size-9 dark:invert"
								alt=""
							/>
							<h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
								Автоматическая обработка
							</h1>
						</div>
						<p class="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
							Добавьте товары для автоматической генерации контента
						</p>
					</div>

					<!-- Карточка с таблицей -->
					<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
						<!-- Заголовок таблицы -->
						<div class="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
							<h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
								Очередь обработки ({batchQueue.length})
							</h2>
							<button
								type="button"
								on:click={() => showAddBatchModal = true}
								disabled={isBatchProcessing}
								class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700
									disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium rounded-lg sm:rounded-xl
									transition-all duration-200 text-xs sm:text-sm"
							>
								<svg class="size-4 sm:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
								</svg>
								Добавить
							</button>
						</div>

						<!-- Таблица или пустое состояние -->
						{#if batchQueue.length === 0}
							<div class="p-8 sm:p-12 text-center">
								<div class="size-16 sm:size-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
									<svg class="size-8 sm:size-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
									</svg>
								</div>
								<p class="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-2">Очередь пуста</p>
								<p class="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
									Нажмите "Добавить" чтобы добавить товары для обработки
								</p>
							</div>
						{:else}
							<div class="overflow-x-auto">
								<table class="w-full">
									<thead class="bg-gray-50 dark:bg-gray-800/50">
										<tr>
											<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Товар
											</th>
											<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Артикул
											</th>
											<th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Статус
											</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
										{#each batchQueue as item}
											<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
												<td class="px-4 py-3">
													<div class="flex items-center gap-3">
														<!-- Миниатюры фото -->
														{#if item.photos && item.photos.length > 0}
															<div class="flex -space-x-2">
																{#each item.photos.slice(0, 3) as photo, idx}
																	<img
																		src={photo}
																		alt=""
																		class="size-8 sm:size-10 rounded-lg object-cover border-2 border-white dark:border-gray-900"
																		style="z-index: {3 - idx}"
																	/>
																{/each}
															</div>
														{:else}
															<div class="size-8 sm:size-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
																<svg class="size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
																		d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
																</svg>
															</div>
														{/if}
														<div class="min-w-0">
															<p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
																{item.name}
															</p>
															<span class="text-xs px-1.5 py-0.5 rounded font-medium
																{item.marketplace === 'wb' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' : ''}
																{item.marketplace === 'ozon' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
																{item.marketplace === 'ym' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}">
																{marketplaces.find(m => m.id === item.marketplace)?.short}
															</span>
														</div>
													</div>
												</td>
												<td class="px-4 py-3">
													<span class="text-sm text-gray-600 dark:text-gray-300 font-mono">
														{item.sku}
													</span>
												</td>
												<td class="px-4 py-3">
													<div class="flex items-center justify-end gap-2">
														<span class="px-2.5 py-1 text-xs font-medium rounded-full {getBatchStatusColor(item.status)}">
															{getBatchStatusText(item.status)}
														</span>
														{#if item.status === 'pending' && !isBatchProcessing}
															<button
																type="button"
																on:click={() => handleRemoveFromBatchQueue(item.id)}
																class="p-1 text-gray-400 hover:text-red-500 transition-colors"
																title="Удалить"
															>
																<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
																</svg>
															</button>
														{/if}
													</div>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/if}
					</div>

					<!-- Кнопка назад -->
					<button
						type="button"
						on:click={handleBackToModeSelection}
						class="w-full mt-3 sm:mt-4 text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
					>
						← Назад к выбору режима
					</button>
				</div>
			{:else}
				<!-- РУЧНАЯ ОБРАБОТКА - Форма ввода артикула -->
				<div class="w-full max-w-md sm:max-w-lg md:max-w-xl mt-4 sm:mt-6 md:mt-8">
				<!-- Заголовок -->
				<div class="text-center mb-4 sm:mb-6 md:mb-8">
					<div class="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
						<img
							src="{WEBUI_BASE_URL}/static/content-factory-icon.svg?v=1.1.40"
							class="size-7 sm:size-8 md:size-9 dark:invert"
							alt=""
						/>
						<h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
							Ручная обработка
						</h1>
					</div>
					<p class="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
						Генерация SEO-контента для одного товара
					</p>
				</div>

				<!-- Карточка формы -->
				<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
					<!-- Переключатель режима -->
					<div class="cf-tabs">
						<button
							type="button"
							on:click={() => inputMode = 'sku'}
							class="cf-tab {inputMode === 'sku' ? 'active' : ''}"
						>
							Артикул
						</button>
						<button
							type="button"
							on:click={() => inputMode = 'link'}
							class="cf-tab {inputMode === 'link' ? 'active' : ''}"
						>
							Ссылка
						</button>
					</div>

					<!-- Контент формы -->
					<div class="p-4 sm:p-5 md:p-6">
						{#if inputMode === 'sku'}
							<div class="space-y-4 sm:space-y-5">
								<!-- Выбор маркетплейса -->
								<div role="group" aria-labelledby="marketplace-label">
									<p id="marketplace-label" class="block text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-2.5">
										Маркетплейс
									</p>
									<div class="grid grid-cols-3 gap-2 sm:gap-3">
										{#each marketplaces as mp}
											<button
												type="button"
												on:click={() => selectedMarketplace = mp.id}
												class="py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl border-2 transition-all duration-200
													{selectedMarketplace === mp.id
														? 'border-gray-900 dark:border-gray-100 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md'
														: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}"
											>
												{mp.short}
											</button>
										{/each}
									</div>
								</div>

								<!-- Поле артикула -->
								<div>
									<label for="sku-input" class="block text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-2.5">
										Артикул товара
									</label>
									<input
										type="text"
										id="sku-input"
										bind:value={skuInput}
										placeholder="Например: 123456789"
										class="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700
											bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
											placeholder-gray-400 dark:placeholder-gray-500
											focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 dark:focus:ring-gray-500/50 dark:focus:border-gray-500
											transition-all duration-200 text-sm sm:text-base"
										on:keydown={(e) => e.key === 'Enter' && handleNext()}
									/>
								</div>
							</div>
						{:else}
							<div>
								<label for="link-input" class="block text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-2.5">
									Ссылка на товар
								</label>
								<input
									type="url"
									id="link-input"
									bind:value={linkInput}
									placeholder="https://www.wildberries.ru/catalog/..."
									class="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700
										bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
										placeholder-gray-400 dark:placeholder-gray-500
										focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 dark:focus:ring-gray-500/50 dark:focus:border-gray-500
										transition-all duration-200 text-sm sm:text-base"
									on:keydown={(e) => e.key === 'Enter' && handleNext()}
								/>
								<p class="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2.5 sm:mt-3">
									Маркетплейс определится автоматически
								</p>
							</div>
						{/if}
					</div>

					<!-- Кнопка "Далее" -->
					<div class="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
						<button
							type="button"
							on:click={handleNext}
							disabled={(inputMode === 'sku' && !skuInput.trim()) || (inputMode === 'link' && !linkInput.trim()) || isLoading}
							class="w-full py-2.5 sm:py-3 md:py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white
								disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
								font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3
								shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 disabled:shadow-none"
						>
							{#if isLoading}
								<svg class="animate-spin size-5 sm:size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Загрузка...
							{:else}
								Далее
								<svg class="size-5 sm:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<p class="text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-4 sm:mt-5 md:mt-6">
					Поддерживаются Wildberries, Ozon и Яндекс.Маркет
				</p>

				<!-- Кнопка назад к выбору режима -->
				<button
					type="button"
					on:click={handleBackToModeSelection}
					class="w-full mt-3 sm:mt-4 text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
				>
					← Назад к выбору режима
				</button>
			</div>
			{/if}

		{:else if currentStep === 2 && productData}
			<!-- ШАГ 2: Карточка товара -->
			<div class="w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
				<!-- Заголовок с кнопкой назад -->
				<div class="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
					<button
						type="button"
						on:click={handleBack}
						class="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
						aria-label="Назад"
					>
						<svg class="size-5 sm:size-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<div class="flex items-center gap-2 sm:gap-3">
						<img
							src="{WEBUI_BASE_URL}/static/content-factory-icon.svg?v=1.1.40"
							class="size-5 sm:size-6 md:size-7 dark:invert"
							alt=""
						/>
						<h1 class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
							Карточка товара
						</h1>
					</div>
					<span class="ml-auto px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap
						{productData.marketplace === 'wb' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' : ''}
						{productData.marketplace === 'ozon' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
						{productData.marketplace === 'ym' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}">
						{marketplaces.find(m => m.id === productData.marketplace)?.name}
					</span>
				</div>

				<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
					<div class="flex flex-col md:flex-row">
						<!-- Фотографии товара -->
						<div class="md:w-2/5 lg:w-1/3 p-4 sm:p-5 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
							<div class="relative aspect-square sm:aspect-[4/5] bg-gray-100 dark:bg-gray-850 rounded-xl sm:rounded-2xl overflow-hidden">
								{#if productData.photos.length > 0}
									<img
										src={productData.photos[currentPhotoIndex]}
										alt="Фото товара {currentPhotoIndex + 1}"
										class="w-full h-full object-cover"
									/>

									{#if productData.photos.length > 1}
										<div class="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent">
											<div class="flex items-center justify-between">
												<button
													type="button"
													on:click={prevPhoto}
													disabled={currentPhotoIndex === 0}
													class="p-2 sm:p-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 disabled:opacity-30 transition-all duration-200 hover:scale-105 active:scale-95"
													aria-label="Предыдущее фото"
												>
													<svg class="size-4 sm:size-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
													</svg>
												</button>

												<span class="text-xs sm:text-sm text-white font-semibold bg-black/30 px-3 py-1 rounded-full">
													{currentPhotoIndex + 1} / {productData.photos.length}
												</span>

												<button
													type="button"
													on:click={nextPhoto}
													disabled={currentPhotoIndex === productData.photos.length - 1}
													class="p-2 sm:p-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 disabled:opacity-30 transition-all duration-200 hover:scale-105 active:scale-95"
													aria-label="Следующее фото"
												>
													<svg class="size-4 sm:size-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
													</svg>
												</button>
											</div>
										</div>
									{/if}
								{:else}
									<div class="flex items-center justify-center h-full text-gray-400">
										<svg class="size-12 sm:size-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
								{/if}
							</div>

							{#if productData.photos.length > 1}
								<div class="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
									{#each productData.photos as photo, index}
										<button
											type="button"
											on:click={() => currentPhotoIndex = index}
											class="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-200
												{currentPhotoIndex === index
													? 'border-gray-900 dark:border-gray-100 shadow-md scale-105'
													: 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105'}"
											aria-label="Показать фото {index + 1}"
										>
											<img src={photo} alt="Миниатюра {index + 1}" class="w-full h-full object-cover" />
										</button>
									{/each}
								</div>
							{/if}

							<p class="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-3 sm:mt-4 text-center font-medium">
								Артикул: <span class="text-gray-600 dark:text-gray-300">{productData.sku}</span>
							</p>

							<!-- Товары в склейке (миниатюры) -->
							{#if productData.group_products && productData.group_products.length > 0}
								<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
									<p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 text-center">
										Товары в склейке ({productData.group_products.length})
									</p>
									<div class="flex flex-wrap gap-1.5 justify-center">
										{#each productData.group_products.slice(0, 8) as groupItem}
											<div
												class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
												title="{groupItem.color || ''} {groupItem.size || ''} - {groupItem.sku}"
											>
												{#if productData.photos && productData.photos[0]}
													<img
														src={productData.photos[0]}
														alt="{groupItem.color || ''} {groupItem.size || ''}"
														class="w-full h-full object-cover opacity-80"
													/>
												{:else}
													<div class="w-full h-full flex items-center justify-center text-gray-400">
														<span class="text-xs">{groupItem.size || '?'}</span>
													</div>
												{/if}
											</div>
										{/each}
										{#if productData.group_products.length > 8}
											<div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium">
												+{productData.group_products.length - 8}
											</div>
										{/if}
									</div>
								</div>
							{/if}
						</div>

						<!-- Редактируемые поля -->
						<div class="md:w-3/5 lg:w-2/3 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col">
							<!-- Заголовок товара -->
							<div class="mb-4 sm:mb-5 md:mb-6">
								<label for="product-title" class="block text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
									Название товара
								</label>
								<input
									type="text"
									id="product-title"
									bind:value={productData.title}
									placeholder="Введите название товара"
									class="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700
										bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
										placeholder-gray-400 dark:placeholder-gray-500
										focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 dark:focus:ring-gray-500/50 dark:focus:border-gray-500
										transition-all duration-200 text-sm sm:text-base md:text-lg"
								/>
							</div>

							<!-- Описание товара -->
							<div class="mb-4 sm:mb-5 md:mb-6">
								<label for="product-description" class="block text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
									Описание товара
								</label>
								<textarea
									id="product-description"
									bind:value={productData.description}
									placeholder="Введите описание товара"
									rows="6"
									class="w-full min-h-[150px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[280px] px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700
										bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
										placeholder-gray-400 dark:placeholder-gray-500
										focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 dark:focus:ring-gray-500/50 dark:focus:border-gray-500
										transition-all duration-200 text-sm sm:text-base resize-none"
								></textarea>
							</div>

							<!-- Валидация карточки -->
							{#if productData.validation}
								<div class="mt-4 sm:mt-5 md:mt-6 mb-4 sm:mb-5 md:mb-6">
									<div class="rounded-xl sm:rounded-2xl border-2 p-3 sm:p-4
										{productData.validation.is_valid
											? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
											: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'}">
										<div class="flex items-center gap-2 mb-2">
											{#if productData.validation.is_valid}
												<svg class="size-4 sm:size-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
												</svg>
												<span class="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">
													Валидация пройдена
												</span>
											{:else}
												<svg class="size-4 sm:size-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
												</svg>
												<span class="text-xs sm:text-sm font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">
													Есть замечания
												</span>
											{/if}
										</div>
										{#if productData.validation.issues && productData.validation.issues.length > 0}
											<ul class="space-y-1.5 sm:space-y-2 mt-2">
												{#each productData.validation.issues as issue}
													<li class="flex items-start gap-2 text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
														<svg class="size-3.5 sm:size-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
															<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
														</svg>
														<span><strong class="font-semibold">{issue.field}:</strong> {issue.message}</span>
													</li>
												{/each}
											</ul>
										{/if}
									</div>
								</div>
							{/if}

							<!-- Кнопка генерации -->
							<button
								type="button"
								on:click={handleGenerate}
								disabled={isGenerating}
								class="w-full py-2.5 sm:py-3 md:py-3.5 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-gray-700 dark:active:bg-gray-300 text-white
									disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
									font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 sm:gap-3
									shadow-lg hover:shadow-xl disabled:shadow-none"
							>
								{#if isGenerating}
									<svg class="animate-spin size-5 sm:size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Генерация...
								{:else}
									<svg class="size-5 sm:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
									</svg>
									Сгенерировать контент
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>

		{:else if currentStep === 3 && productData && draftData}
			<!-- ШАГ 3: Результат генерации -->
			<div class="w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
				<!-- Заголовок -->
				<div class="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
					<button
						type="button"
						on:click={handleBackToEdit}
						class="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
						aria-label="Назад к редактированию"
					>
						<svg class="size-5 sm:size-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<div class="flex items-center gap-2 sm:gap-3">
						<img
							src="{WEBUI_BASE_URL}/static/content-factory-icon.svg?v=1.1.40"
							class="size-5 sm:size-6 md:size-7 dark:invert"
							alt=""
						/>
						<h1 class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
							Результат генерации
						</h1>
					</div>
				</div>

				<div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
					<!-- Левая колонка: фото и артикул -->
					<div class="md:col-span-1">
						<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg sticky top-4">
							{#if productData.photos.length > 0}
								<img
									src={productData.photos[0]}
									alt="Фото товара"
									class="w-full aspect-square object-cover rounded-xl sm:rounded-2xl mb-3 sm:mb-4"
								/>
							{/if}
							<p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
								Артикул: <span class="font-semibold text-gray-700 dark:text-gray-300">{productData.sku}</span>
							</p>
							<p class="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
								{marketplaces.find(m => m.id === productData.marketplace)?.name}
							</p>
						</div>
					</div>

					<!-- Правая колонка: контент -->
					<div class="md:col-span-2 lg:col-span-3 space-y-4 sm:space-y-5 md:space-y-6">
						<!-- Название -->
						<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg">
							<label for="title-step3" class="block text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
								Название товара
							</label>
							<input
								type="text"
								id="title-step3"
								bind:value={productData.title}
								class="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700
									bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
									focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 dark:focus:ring-gray-500/50 dark:focus:border-gray-500
									transition-all duration-200 text-sm sm:text-base md:text-lg"
							/>
							<p class="text-xs sm:text-sm text-gray-400 mt-2">
								{productData.title.length} / 60 символов
							</p>
						</div>

						<!-- Описание -->
						<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg">
							<label for="description-step3" class="block text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
								Описание товара
							</label>
							<textarea
								id="description-step3"
								bind:value={productData.description}
								rows="6"
								class="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700
									bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
									focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 dark:focus:ring-gray-500/50 dark:focus:border-gray-500
									transition-all duration-200 text-sm sm:text-base resize-none min-h-[140px] sm:min-h-[160px] md:min-h-[200px]"
							></textarea>
							<p class="text-xs sm:text-sm text-gray-400 mt-2">
								{productData.description.length} символов (рекомендуется 1000-2000)
							</p>
						</div>

						<!-- SEO теги -->
						{#if draftData.seo_tags.length > 0}
							<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg">
								<p class="block text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
									SEO теги
								</p>
								<div class="flex flex-wrap gap-1.5 sm:gap-2">
									{#each draftData.seo_tags as tag}
										<span class="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium">
											{tag}
										</span>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Валидация карточки -->
						{#if draftData.validation}
							<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg">
								<div class="rounded-xl sm:rounded-2xl border-2 p-3 sm:p-4
									{draftData.validation.is_valid
										? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
										: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'}">
									<div class="flex items-start gap-2 sm:gap-3">
										{#if draftData.validation.is_valid}
											<svg class="size-5 sm:size-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										{:else}
											<svg class="size-5 sm:size-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
											</svg>
										{/if}
										<div class="flex-1">
											<h3 class="text-sm sm:text-base font-bold mb-1 sm:mb-2
												{draftData.validation.is_valid
													? 'text-green-900 dark:text-green-100'
													: 'text-yellow-900 dark:text-yellow-100'}">
												{#if draftData.validation.is_valid}
													Валидация пройдена
												{:else}
													Требуется внимание
												{/if}
											</h3>

											{#if draftData.validation.issues && draftData.validation.issues.length > 0}
												<ul class="space-y-1 sm:space-y-1.5">
													{#each draftData.validation.issues as issue}
														<li class="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm
															{issue.severity === 'error'
																? 'text-red-700 dark:text-red-300'
																: 'text-yellow-700 dark:text-yellow-300'}">
															<span class="font-medium">{issue.field}:</span>
															<span>{issue.message}</span>
														</li>
													{/each}
												</ul>
											{:else if draftData.validation.is_valid}
												<p class="text-xs sm:text-sm text-green-700 dark:text-green-300">
													Карточка товара соответствует требованиям маркетплейса
												</p>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{/if}

						<!-- Перегенерация -->
						<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg">
							<label for="manager-notes" class="block text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
								Пожелания для перегенерации (необязательно)
							</label>
							<textarea
								id="manager-notes"
								bind:value={managerNotes}
								placeholder="Например: Сделай описание с акцентом на натуральность материалов"
								rows="2"
								class="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700
									bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
									placeholder-gray-400 dark:placeholder-gray-500
									focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 dark:focus:ring-gray-500/50 dark:focus:border-gray-500
									transition-all duration-200 text-sm sm:text-base resize-none"
							></textarea>
							<button
								type="button"
								on:click={handleRegenerate}
								disabled={isGenerating}
								class="mt-3 sm:mt-4 w-full py-3 sm:py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
									text-gray-700 dark:text-gray-300
									disabled:opacity-50
									font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
							>
								{#if isGenerating}
									<svg class="animate-spin size-4 sm:size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Перегенерация...
								{:else}
									<svg class="size-4 sm:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									Перегенерировать
								{/if}
							</button>
						</div>

						<!-- Таблица склеек для batch режима -->
						{#if processingMode === 'batch' && batchSizes.length > 0}
							<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg">
								<div class="flex items-center justify-between mb-4">
									<p class="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Товары в склейке ({batchSizes.length})
									</p>
									<div class="flex gap-2">
										<button
											type="button"
											on:click={() => toggleAllSizes(true)}
											class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
										>
											Все
										</button>
										<button
											type="button"
											on:click={() => toggleAllSizes(false)}
											class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
										>
											Снять
										</button>
									</div>
								</div>

								<div class="overflow-x-auto">
									<table class="w-full text-sm">
										<thead>
											<tr class="border-b border-gray-200 dark:border-gray-700">
												<th class="py-2 px-2 text-left font-medium text-gray-500 dark:text-gray-400 w-10"></th>
												<th class="py-2 px-2 text-left font-medium text-gray-500 dark:text-gray-400">Артикул</th>
												<th class="py-2 px-2 text-left font-medium text-gray-500 dark:text-gray-400">Размер</th>
												<th class="py-2 px-2 text-left font-medium text-gray-500 dark:text-gray-400">Цвет</th>
												<th class="py-2 px-2 text-right font-medium text-gray-500 dark:text-gray-400">Статус</th>
											</tr>
										</thead>
										<tbody>
											{#each batchSizes as item, index}
												<tr class="border-b border-gray-100 dark:border-gray-800 last:border-0">
													<td class="py-2 px-2">
														<input
															type="checkbox"
															bind:checked={item.selected}
															disabled={isBatchProcessing || item.status === 'success'}
															class="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
														/>
													</td>
													<td class="py-2 px-2 font-mono text-xs text-gray-700 dark:text-gray-300">
														{item.sku || item.nmId}
													</td>
													<td class="py-2 px-2 text-gray-600 dark:text-gray-400">
														{item.size || '—'}
													</td>
													<td class="py-2 px-2 text-gray-600 dark:text-gray-400">
														{item.color || '—'}
													</td>
													<td class="py-2 px-2 text-right">
														{#if item.status === 'pending'}
															<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
																Ожидает
															</span>
														{:else if item.status === 'processing'}
															<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
																<svg class="animate-spin size-3" fill="none" viewBox="0 0 24 24">
																	<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
																	<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
																</svg>
																Обработка
															</span>
														{:else if item.status === 'success'}
															<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
																<svg class="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
																</svg>
																Готово
															</span>
														{:else if item.status === 'error'}
															<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" title={item.error}>
																<svg class="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
																</svg>
																Ошибка
															</span>
														{/if}
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>

								<!-- Кнопка применить к выбранным -->
								<button
									type="button"
									on:click={handleBatchApply}
									disabled={isBatchProcessing || batchSizes.filter(s => s.selected && s.status !== 'success').length === 0}
									class="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 text-white
										disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
										font-semibold rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2"
								>
									{#if isBatchProcessing}
										<svg class="animate-spin size-4" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
										</svg>
										Применяется...
									{:else}
										<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
										Применить к выбранным ({batchSizes.filter(s => s.selected && s.status !== 'success').length})
									{/if}
								</button>
							</div>
						{/if}

						<!-- Кнопки утверждения (только для ручного режима) -->
						{#if processingMode !== 'batch'}
						<div class="grid grid-cols-2 gap-3 sm:gap-4">
							<!-- Применить к одному товару -->
							<button
								type="button"
								on:click={() => handleApprove(false)}
								disabled={isApproving || isGenerating}
								class="py-3 sm:py-4 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white
									disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
									font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2
									shadow-md hover:shadow-lg disabled:shadow-none"
							>
								{#if isApproving && !applyToGroup}
									<svg class="animate-spin size-4 sm:size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
								{:else}
									<svg class="size-4 sm:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								{/if}
								<span class="hidden sm:inline">Только этот товар</span>
								<span class="sm:hidden">Один товар</span>
							</button>

							<!-- Применить ко всей склейке -->
							<button
								type="button"
								on:click={() => handleApprove(true)}
								disabled={isApproving || isGenerating}
								class="py-3 sm:py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white
									disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
									font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2
									shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40 disabled:shadow-none"
							>
								{#if isApproving && applyToGroup}
									<svg class="animate-spin size-4 sm:size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
								{:else}
									<svg class="size-4 sm:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
									</svg>
								{/if}
								<span class="hidden sm:inline">Вся склейка</span>
								<span class="sm:hidden">Склейка</span>
							</button>
						</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		{:else if activeSection === 'drafts'}
			<!-- СЕКЦИЯ: СПИСОК ЧЕРНОВИКОВ -->
			<div class="w-full max-w-4xl">
				<div class="cf-draft-list">
					<div class="cf-draft-list-header">
						<h3 class="cf-draft-list-title">
							📋 Черновики контента
							<span class="cf-draft-list-count">({mockDrafts.length})</span>
						</h3>
						<div class="flex gap-2">
							<button class="cf-btn">🔍 Фильтр</button>
							<button class="cf-btn cf-btn-primary" on:click={() => activeSection = 'generate'}>📝 Новый</button>
						</div>
					</div>

					<table class="cf-drafts-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Артикул</th>
								<th>МП</th>
								<th>Статус</th>
								<th>Создан</th>
							</tr>
						</thead>
						<tbody>
							{#each mockDrafts as draft}
								<tr>
									<td><span class="cf-draft-id">{draft.id}</span></td>
									<td>{draft.sku}</td>
									<td><span class="cf-mp-badge {draft.mp}">{draft.mp.toUpperCase()}</span></td>
									<td><span class="cf-badge {getStatusBadgeClass(draft.status)}">{getStatusText(draft.status)}</span></td>
									<td>{draft.created}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

		{:else if activeSection === 'visual-prompt'}
			<!-- СЕКЦИЯ: ТЗ ДЛЯ ДИЗАЙНЕРА -->
			<div class="w-full max-w-3xl">
				<div class="cf-visual-prompt">
					<div class="cf-visual-prompt-header">
						<span class="text-2xl">📸</span>
						<h2 class="cf-card-title">ТЗ для дизайнера</h2>
					</div>

					<div class="cf-visual-prompt-body">
						<!-- Метаданные -->
						<div class="cf-meta">
							<div class="cf-meta-item">
								<span class="cf-meta-label">Артикул:</span>
								<span class="cf-meta-value mono">{visualPromptData.sku}</span>
							</div>
							<div class="cf-meta-item">
								<span class="cf-meta-label">Товар:</span>
								<span class="cf-meta-value">{visualPromptData.product}</span>
							</div>
						</div>

						<hr class="cf-divider">

						<!-- Выявленные проблемы -->
						<div class="cf-visual-prompt-section">
							<h3 class="cf-visual-prompt-title">❌ Известные проблемы</h3>
							<ul class="cf-problems">
								{#each visualPromptData.problems as problem}
									<li class="cf-problem-item">
										<span class="cf-problem-icon">•</span>
										<span>{problem}</span>
									</li>
								{/each}
							</ul>
						</div>

						<!-- Рекомендации -->
						<div class="cf-visual-prompt-section">
							<h3 class="cf-visual-prompt-title">✅ Рекомендации по съёмке</h3>

							{#each visualPromptData.recommendations as rec, index}
								<div class="cf-recommendation">
									<span class="cf-recommendation-number">{index + 1}</span>
									<span class="cf-recommendation-title">{rec.title}</span>
									<p class="cf-recommendation-text">{rec.text}</p>
									{#if rec.list}
										<ul class="cf-recommendation-list">
											{#each rec.list as item}
												<li>{item}</li>
											{/each}
										</ul>
									{/if}
								</div>
							{/each}
						</div>

						<!-- Кнопки действий -->
						<div class="cf-actions" style="border-top: 1px solid var(--cf-border); margin-top: 1.5rem; padding-top: 1rem;">
							<button class="cf-btn">📋 Копировать</button>
							<button class="cf-btn cf-btn-primary">📧 Отправить</button>
						</div>
					</div>
				</div>
			</div>

		{:else if activeSection === 'stats'}
			<!-- СЕКЦИЯ: СТАТИСТИКА -->
			<div class="w-full max-w-3xl">
				<div class="cf-card">
					<div class="cf-card-header">
						<span class="text-xl">📊</span>
						<h2 class="cf-card-title">Статистика генераций</h2>
					</div>

					<div class="cf-card-body">
						<div class="cf-stats">
							{#each stats as stat}
								<div class="cf-stat-card">
									<div class="cf-stat-value">{stat.value}</div>
									<div class="cf-stat-label">{stat.label}</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Пример состояния загрузки -->
				<div class="cf-card mt-6">
					<div class="cf-card-header">
						<span class="text-xl">⏳</span>
						<h2 class="cf-card-title">Пример состояния загрузки</h2>
					</div>

					<div class="cf-card-body">
						<div class="cf-generating">
							<div class="cf-generating-spinner"></div>
							<p class="cf-generating-text">Генерация контента для OM-12345...</p>
							<div class="cf-generating-progress">
								<div class="cf-generating-progress-bar"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Модальное окно добавления товара в очередь -->
{#if showAddBatchModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<!-- Backdrop -->
		<button
			type="button"
			class="absolute inset-0 bg-black/50 backdrop-blur-sm"
			on:click={() => showAddBatchModal = false}
		></button>

		<!-- Modal -->
		<div class="relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					Добавить товар
				</h3>
				<button
					type="button"
					on:click={() => showAddBatchModal = false}
					class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
				>
					<svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Tabs -->
			<div class="cf-tabs border-b border-gray-200 dark:border-gray-700">
				<button
					type="button"
					on:click={() => addBatchInputMode = 'sku'}
					class="cf-tab {addBatchInputMode === 'sku' ? 'active' : ''}"
				>
					Артикул
				</button>
				<button
					type="button"
					on:click={() => addBatchInputMode = 'link'}
					class="cf-tab {addBatchInputMode === 'link' ? 'active' : ''}"
				>
					Ссылка
				</button>
			</div>

			<!-- Content -->
			<div class="p-4 sm:p-5">
				{#if addBatchInputMode === 'sku'}
					<div class="space-y-4">
						<!-- Маркетплейс -->
						<div>
							<label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
								Маркетплейс
							</label>
							<div class="grid grid-cols-3 gap-2">
								{#each marketplaces as mp}
									<button
										type="button"
										on:click={() => addBatchMarketplace = mp.id}
										class="py-2 text-xs sm:text-sm font-semibold rounded-xl border-2 transition-all duration-200
											{addBatchMarketplace === mp.id
												? 'border-gray-900 dark:border-gray-100 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
												: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'}"
									>
										{mp.short}
									</button>
								{/each}
							</div>
						</div>

						<!-- Артикул -->
						<div>
							<label for="add-batch-sku" class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
								Артикул товара
							</label>
							<input
								type="text"
								id="add-batch-sku"
								bind:value={addBatchSku}
								placeholder="Например: 123456789"
								class="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700
									bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
									placeholder-gray-400 dark:placeholder-gray-500
									focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
									transition-all duration-200 text-sm"
								on:keydown={(e) => e.key === 'Enter' && handleAddToBatchQueue()}
							/>
						</div>
					</div>
				{:else}
					<div>
						<label for="add-batch-link" class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
							Ссылка на товар
						</label>
						<input
							type="url"
							id="add-batch-link"
							bind:value={addBatchLink}
							placeholder="https://www.wildberries.ru/catalog/..."
							class="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700
								bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
								placeholder-gray-400 dark:placeholder-gray-500
								focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
								transition-all duration-200 text-sm"
							on:keydown={(e) => e.key === 'Enter' && handleAddToBatchQueue()}
						/>
						<p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
							Маркетплейс определится автоматически
						</p>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700">
				<button
					type="button"
					on:click={handleAddToBatchQueue}
					disabled={isAddingBatchItem || (addBatchInputMode === 'sku' && !addBatchSku.trim()) || (addBatchInputMode === 'link' && !addBatchLink.trim())}
					class="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white
						disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
						font-semibold rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2"
				>
					{#if isAddingBatchItem}
						<svg class="animate-spin size-4" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
						</svg>
						Добавление...
					{:else}
						<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						Добавить в очередь
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}