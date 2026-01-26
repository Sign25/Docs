<script lang="ts">
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { showSidebar, mobile } from '$lib/stores';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import Sidebar from '$lib/components/icons/Sidebar.svelte';
	import { WEBUI_BASE_URL } from '$lib/constants';

	const i18n = getContext('i18n');

	// Текущий шаг: 1 - ввод данных, 2 - карточка товара
	let currentStep: 1 | 2 = 1;

	// Режим ввода: 'sku' или 'link'
	let inputMode: 'sku' | 'link' = 'sku';

	// Поля формы
	let skuInput = '';
	let linkInput = '';
	let selectedMarketplace: 'wb' | 'ozon' | 'ym' = 'wb';

	// Данные товара (шаг 2)
	let productData: {
		marketplace: 'wb' | 'ozon' | 'ym';
		sku: string;
		photos: string[];
		title: string;
		description: string;
	} | null = null;

	// Индекс текущей фотографии в галерее
	let currentPhotoIndex = 0;

	// Состояние загрузки
	let isLoading = false;
	let isGenerating = false;

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
		// WB: /catalog/123456789/
		const wbMatch = url.match(/wildberries\.ru\/catalog\/(\d+)/i);
		if (wbMatch) return wbMatch[1];

		// Ozon: /product/name-123456789/
		const ozonMatch = url.match(/ozon\.ru\/product\/[^\/]*-(\d+)/i);
		if (ozonMatch) return ozonMatch[1];

		// YM: /product--name/123456789
		const ymMatch = url.match(/market\.yandex\.ru\/product[^\/]*\/(\d+)/i);
		if (ymMatch) return ymMatch[1];

		// Общий паттерн для чисел
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

			// Определяем маркетплейс из ссылки
			const detected = detectMarketplace(linkInput);
			if (!detected) {
				toast.error('Не удалось определить маркетплейс из ссылки');
				return;
			}
			marketplace = detected;

			// Извлекаем артикул
			sku = extractSkuFromUrl(linkInput);
			if (!sku) {
				toast.error('Не удалось извлечь артикул из ссылки');
				return;
			}
		}

		// Загружаем данные товара
		isLoading = true;
		try {
			// TODO: Заменить на реальный API-запрос
			// const response = await fetch(`/api/content/product/${marketplace}/${sku}`);
			// const data = await response.json();

			// Временные mock-данные для демонстрации
			await new Promise(resolve => setTimeout(resolve, 800));

			productData = {
				marketplace,
				sku,
				photos: [
					'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Фото+1',
					'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Фото+2',
					'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Фото+3'
				],
				title: `Товар ${sku}`,
				description: 'Описание товара будет загружено с маркетплейса после подключения API.'
			};

			currentPhotoIndex = 0;
			currentStep = 2;
		} catch (error) {
			toast.error('Ошибка загрузки данных товара');
			console.error('Error loading product:', error);
		} finally {
			isLoading = false;
		}
	}

	// Возврат к шагу 1
	function handleBack() {
		currentStep = 1;
		productData = null;
		currentPhotoIndex = 0;
	}

	// Генерация контента
	async function handleGenerate() {
		if (!productData) return;

		isGenerating = true;
		try {
			// TODO: Заменить на реальный API-запрос
			// const response = await fetch('/api/content/generate', {
			//   method: 'POST',
			//   body: JSON.stringify(productData)
			// });

			await new Promise(resolve => setTimeout(resolve, 1500));
			toast.success('Контент сгенерирован! (API будет подключено позже)');
			console.log('Generate content:', productData);
		} catch (error) {
			toast.error('Ошибка генерации контента');
			console.error('Error generating:', error);
		} finally {
			isGenerating = false;
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
	<title>Content Factory | Adolf</title>
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
	<div class="flex-1 flex flex-col items-center px-4 pt-12 md:pt-20 pb-8">
		<!-- Кнопка сайдбара для мобильных -->
		{#if $mobile && !$showSidebar}
			<Tooltip content={$i18n.t('Open Sidebar')}>
				<button
					class="absolute left-4 top-4 cursor-pointer flex rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 transition p-1.5 z-10"
					on:click|stopPropagation={() => showSidebar.set(true)}
					aria-label="Open Sidebar"
				>
					<Sidebar />
				</button>
			</Tooltip>
		{/if}

		{#if currentStep === 1}
			<!-- ШАГ 1: Ввод данных -->
			<div class="w-full max-w-md">

				<!-- Заголовок -->
				<div class="text-center mb-8">
					<div class="flex items-center justify-center gap-3 mb-3">
						<img
							src="{WEBUI_BASE_URL}/static/content-factory-icon.svg"
							class="size-8 dark:invert"
							alt=""
						/>
						<h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
							Content Factory
						</h1>
					</div>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Генерация SEO-контента для карточек товаров
					</p>
				</div>

			<!-- Карточка формы -->
			<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">

				<!-- Переключатель режима (slider/toggle) -->
				<div class="flex border-b border-gray-200 dark:border-gray-800">
					<button
						type="button"
						on:click={() => inputMode = 'sku'}
						class="flex-1 py-3.5 text-sm font-medium transition relative
							{inputMode === 'sku'
								? 'text-violet-600 dark:text-violet-400'
								: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}"
					>
						Артикул
						{#if inputMode === 'sku'}
							<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"></div>
						{/if}
					</button>
					<button
						type="button"
						on:click={() => inputMode = 'link'}
						class="flex-1 py-3.5 text-sm font-medium transition relative
							{inputMode === 'link'
								? 'text-violet-600 dark:text-violet-400'
								: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}"
					>
						Ссылка
						{#if inputMode === 'link'}
							<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"></div>
						{/if}
					</button>
				</div>

				<!-- Контент формы -->
				<div class="p-5">
					{#if inputMode === 'sku'}
						<!-- Режим артикула -->
						<div class="space-y-4">
							<!-- Выбор маркетплейса -->
							<div>
								<label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
									Маркетплейс
								</label>
								<div class="grid grid-cols-3 gap-2">
									{#each marketplaces as mp}
										<button
											type="button"
											on:click={() => selectedMarketplace = mp.id}
											class="py-2.5 text-sm font-medium rounded-xl border transition
												{selectedMarketplace === mp.id
													? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
													: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}"
										>
											{mp.short}
										</button>
									{/each}
								</div>
							</div>

							<!-- Поле артикула -->
							<div>
								<label for="sku-input" class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
									Артикул товара
								</label>
								<input
									type="text"
									id="sku-input"
									bind:value={skuInput}
									placeholder="Например: 123456789"
									class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
										bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
										placeholder-gray-400 dark:placeholder-gray-500
										focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
										transition text-sm"
									on:keydown={(e) => e.key === 'Enter' && handleNext()}
								/>
							</div>
						</div>
					{:else}
						<!-- Режим ссылки -->
						<div>
							<label for="link-input" class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
								Ссылка на товар
							</label>
							<input
								type="url"
								id="link-input"
								bind:value={linkInput}
								placeholder="https://www.wildberries.ru/catalog/..."
								class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
									bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
									placeholder-gray-400 dark:placeholder-gray-500
									focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
									transition text-sm"
								on:keydown={(e) => e.key === 'Enter' && handleNext()}
							/>
							<p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
								Маркетплейс определится автоматически
							</p>
						</div>
					{/if}
				</div>

				<!-- Кнопка "Далее" -->
				<div class="px-5 pb-5">
					<button
						type="button"
						on:click={handleNext}
						disabled={(inputMode === 'sku' && !skuInput.trim()) || (inputMode === 'link' && !linkInput.trim()) || isLoading}
						class="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white
							disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
							font-medium rounded-xl transition text-sm flex items-center justify-center gap-2"
					>
						{#if isLoading}
							<svg class="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Загрузка...
						{:else}
							Далее
						{/if}
					</button>
				</div>
			</div>

			<!-- Подсказка -->
			<p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
				Поддерживаются Wildberries, Ozon и Яндекс.Маркет
			</p>
		</div>

		{:else if currentStep === 2 && productData}
			<!-- ШАГ 2: Карточка товара -->
			<div class="w-full max-w-2xl">
				<!-- Заголовок с кнопкой назад -->
				<div class="flex items-center gap-4 mb-6">
					<button
						type="button"
						on:click={handleBack}
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
						aria-label="Назад"
					>
						<svg class="size-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<div class="flex items-center gap-2">
						<img
							src="{WEBUI_BASE_URL}/static/content-factory-icon.svg"
							class="size-6 dark:invert"
							alt=""
						/>
						<h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
							Карточка товара
						</h1>
					</div>
					<span class="ml-auto px-3 py-1 text-xs font-medium rounded-full
						{productData.marketplace === 'wb' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' : ''}
						{productData.marketplace === 'ozon' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
						{productData.marketplace === 'ym' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}">
						{marketplaces.find(m => m.id === productData.marketplace)?.name}
					</span>
				</div>

				<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
					<div class="flex flex-col md:flex-row">
						<!-- Фотографии товара -->
						<div class="md:w-2/5 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
							<div class="relative aspect-[4/5] bg-gray-100 dark:bg-gray-850 rounded-xl overflow-hidden">
								{#if productData.photos.length > 0}
									<img
										src={productData.photos[currentPhotoIndex]}
										alt="Фото товара {currentPhotoIndex + 1}"
										class="w-full h-full object-cover"
									/>

									<!-- Навигация по фото -->
									{#if productData.photos.length > 1}
										<div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
											<div class="flex items-center justify-between">
												<button
													type="button"
													on:click={prevPhoto}
													disabled={currentPhotoIndex === 0}
													class="p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 disabled:opacity-30 transition"
												>
													<svg class="size-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
													</svg>
												</button>

												<span class="text-xs text-white font-medium">
													{currentPhotoIndex + 1} / {productData.photos.length}
												</span>

												<button
													type="button"
													on:click={nextPhoto}
													disabled={currentPhotoIndex === productData.photos.length - 1}
													class="p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 disabled:opacity-30 transition"
												>
													<svg class="size-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
													</svg>
												</button>
											</div>
										</div>
									{/if}
								{:else}
									<div class="flex items-center justify-center h-full text-gray-400">
										<svg class="size-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
								{/if}
							</div>

							<!-- Миниатюры фото -->
							{#if productData.photos.length > 1}
								<div class="flex gap-2 mt-3 overflow-x-auto pb-1">
									{#each productData.photos as photo, index}
										<button
											type="button"
											on:click={() => currentPhotoIndex = index}
											class="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition
												{currentPhotoIndex === index
													? 'border-violet-500'
													: 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}"
										>
											<img src={photo} alt="Миниатюра {index + 1}" class="w-full h-full object-cover" />
										</button>
									{/each}
								</div>
							{/if}

							<p class="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
								Артикул: {productData.sku}
							</p>
						</div>

						<!-- Редактируемые поля -->
						<div class="md:w-3/5 p-5 flex flex-col">
							<!-- Заголовок товара -->
							<div class="mb-4">
								<label for="product-title" class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
									Название товара
								</label>
								<input
									type="text"
									id="product-title"
									bind:value={productData.title}
									placeholder="Введите название товара"
									class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
										bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
										placeholder-gray-400 dark:placeholder-gray-500
										focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
										transition text-sm"
								/>
							</div>

							<!-- Описание товара -->
							<div class="flex-1 mb-5">
								<label for="product-description" class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
									Описание товара
								</label>
								<textarea
									id="product-description"
									bind:value={productData.description}
									placeholder="Введите описание товара"
									rows="6"
									class="w-full h-full min-h-[150px] px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
										bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
										placeholder-gray-400 dark:placeholder-gray-500
										focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
										transition text-sm resize-none"
								></textarea>
							</div>

							<!-- Кнопка генерации -->
							<button
								type="button"
								on:click={handleGenerate}
								disabled={isGenerating}
								class="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white
									disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
									font-medium rounded-xl transition text-sm flex items-center justify-center gap-2"
							>
								{#if isGenerating}
									<svg class="animate-spin size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Генерация...
								{:else}
									<!-- Иконка волшебной палочки -->
									<svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
									</svg>
									Сгенерировать контент
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
