<script lang="ts">
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { showSidebar, mobile } from '$lib/stores';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import Sidebar from '$lib/components/icons/Sidebar.svelte';
	import { WEBUI_BASE_URL } from '$lib/constants';
	import {
		getProduct,
		generateContent,
		regenerateContent,
		approveDraft,
		type ProductData,
		type ValidationResult
	} from '$lib/apis/content-factory';

	const i18n = getContext('i18n');

	// Режим обработки: null - не выбран, 'single' - один артикул, 'batch' - пакетная
	let processingMode: 'single' | 'batch' | null = null;

	// Текущий шаг: 1 - ввод данных, 2 - карточка товара, 3 - результат генерации
	let currentStep: 1 | 2 | 3 = 1;

	// Данные для пакетной обработки (размеры)
	let batchSizes: { nmId: string; size: string; selected: boolean }[] = [];
	let isBatchProcessing = false;

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
		photos: string[];
		title: string;
		description: string;
		validation?: ValidationResult;
	} | null = null;

	// Индекс текущей фотографии в галерее
	let currentPhotoIndex = 0;

	// Состояние загрузки
	let isLoading = false;
	let isGenerating = false;
	let isApproving = false;

	// Данные сгенерированного черновика
	let draftData: {
		draft_id: string;
		seo_tags: string[];
		validation: ValidationResult;
	} | null = null;

	// Заметки менеджера для перегенерации
	let managerNotes = '';

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
			const data = await getProduct(sku);

			productData = {
				marketplace,
				sku,
				photos: data.media_urls || [],
				title: data.title || '',
				description: data.description || '',
				validation: data.validation
			};

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
		currentPhotoIndex = 0;
		managerNotes = '';
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
		try {
			// TODO: API call для пакетной обработки
			// await batchApplyContent(draftData.draft_id, selectedSizes.map(s => s.nmId));
			toast.success(`Контент применён к ${selectedSizes.length} размерам`);
		} catch (error: any) {
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
	async function handleApprove() {
		if (!draftData || !productData) return;

		isApproving = true;
		try {
			const result = await approveDraft(draftData.draft_id, {
				title: productData.title,
				description: productData.description,
				seo_tags: draftData.seo_tags
			});

			toast.success(result.message || 'Карточка опубликована на Wildberries!');

			// Сброс и возврат к началу
			handleBack();
		} catch (error: any) {
			toast.error(error.message || 'Ошибка публикации');
			console.error('Error approving:', error);
		} finally {
			isApproving = false;
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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="h-screen max-h-[100dvh] w-full flex flex-col overflow-x-hidden overflow-y-auto transition-all duration-300 {$showSidebar
		? 'md:max-w-[calc(100%-var(--sidebar-width))] md:ml-[var(--sidebar-width)]'
		: ''}"
	on:click={handlePageClick}
	role="main"
>
	<div class="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8">
		<!-- Кнопка сайдбара для мобильных -->
		{#if $mobile && !$showSidebar}
			<Tooltip content={$i18n.t('Open Sidebar')}>
				<button
					class="fixed left-3 top-3 cursor-pointer flex rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition p-2.5 z-50 shadow-lg border border-gray-200 dark:border-gray-700"
					on:click|stopPropagation={() => showSidebar.set(true)}
					aria-label="Open Sidebar"
				>
					<Sidebar />
				</button>
			</Tooltip>
		{/if}

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
						class="group bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700
							hover:border-violet-500 dark:hover:border-violet-500
							rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300
							hover:shadow-xl hover:shadow-violet-500/20 text-left"
					>
						<div class="flex flex-col items-center text-center">
							<div class="size-14 sm:size-16 mb-4 rounded-2xl bg-violet-100 dark:bg-violet-900/30
								flex items-center justify-center group-hover:scale-110 transition-transform">
								<svg class="size-7 sm:size-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
								Один артикул
							</h3>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								Генерация контента для одного товара
							</p>
						</div>
					</button>

					<!-- Пакетная обработка -->
					<button
						type="button"
						on:click={() => processingMode = 'batch'}
						class="group bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700
							hover:border-amber-500 dark:hover:border-amber-500
							rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300
							hover:shadow-xl hover:shadow-amber-500/20 text-left"
					>
						<div class="flex flex-col items-center text-center">
							<div class="size-14 sm:size-16 mb-4 rounded-2xl bg-amber-100 dark:bg-amber-900/30
								flex items-center justify-center group-hover:scale-110 transition-transform">
								<svg class="size-7 sm:size-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
							</div>
							<h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
								Пакетная обработка
							</h3>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								Применить контент ко всем размерам карточки
							</p>
						</div>
					</button>
				</div>
			</div>
		{:else if currentStep === 1}
			<!-- ШАГ 1: Ввод данных -->
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
							{processingMode === 'batch' ? 'Пакетная обработка' : 'Один артикул'}
						</h1>
					</div>
					<p class="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
						{processingMode === 'batch'
							? 'Применить контент ко всем размерам карточки'
							: 'Генерация SEO-контента для одного товара'}
					</p>
				</div>

				<!-- Карточка формы -->
				<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
					<!-- Переключатель режима -->
					<div class="flex border-b border-gray-200 dark:border-gray-700">
						<button
							type="button"
							on:click={() => inputMode = 'sku'}
							class="flex-1 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm md:text-base font-medium transition relative
								{inputMode === 'sku'
									? 'text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-900/10'
									: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}"
						>
							Артикул
							{#if inputMode === 'sku'}
								<div class="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-violet-500"></div>
							{/if}
						</button>
						<button
							type="button"
							on:click={() => inputMode = 'link'}
							class="flex-1 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm md:text-base font-medium transition relative
								{inputMode === 'link'
									? 'text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-900/10'
									: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}"
						>
							Ссылка
							{#if inputMode === 'link'}
								<div class="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-violet-500"></div>
							{/if}
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
														? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 shadow-md shadow-violet-500/20'
														: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'}"
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
											focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
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
										focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
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
							class="w-full py-2.5 sm:py-3 md:py-3.5 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white
								disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
								font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3
								shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 disabled:shadow-none"
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
					class="w-full mt-3 sm:mt-4 text-center text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
				>
					← Назад к выбору режима
				</button>
			</div>

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
													? 'border-violet-500 shadow-md shadow-violet-500/30 scale-105'
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
										focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
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
										focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
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
								class="w-full py-2.5 sm:py-3 md:py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white
									disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
									font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 sm:gap-3
									shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 disabled:shadow-none"
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
									focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
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
									focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
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
										<span class="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium">
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
									focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
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

						<!-- Кнопка утверждения -->
						<button
							type="button"
							on:click={handleApprove}
							disabled={isApproving || isGenerating}
							class="w-full py-4 sm:py-5 md:py-6 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white
								disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
								font-bold rounded-xl sm:rounded-2xl transition-all duration-200 text-base sm:text-lg md:text-xl flex items-center justify-center gap-2 sm:gap-3
								shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 disabled:shadow-none"
						>
							{#if isApproving}
								<svg class="animate-spin size-5 sm:size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Публикация...
							{:else}
								<svg class="size-5 sm:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
								</svg>
								<span class="hidden sm:inline">Утвердить и опубликовать на Wildberries</span>
								<span class="sm:hidden">Опубликовать на WB</span>
							{/if}
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>