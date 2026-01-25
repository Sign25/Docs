<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { user } from '$lib/stores';
	import Tooltip from '$lib/components/common/Tooltip.svelte';

	const i18n = getContext('i18n');

	// Состояние формы
	let productInput = '';
	let selectedMarketplace: 'wb' | 'ozon' | 'ym' = 'wb';
	let isLoading = false;
	let loadingProgress = 0;

	// Результат генерации
	let draft: {
		id?: string;
		sku?: string;
		marketplace?: string;
		status?: 'pending' | 'approved' | 'published' | 'rejected';
		title?: string;
		titleMaxLength?: number;
		description?: string;
		seoTags?: string[];
		validation?: {
			passed: boolean;
			items: Array<{
				status: 'success' | 'warning' | 'error';
				message: string;
			}>;
		};
		error?: string;
	} | null = null;

	// Маркетплейсы
	const marketplaces = [
		{ id: 'wb', name: 'Wildberries', color: '#CB11AB' },
		{ id: 'ozon', name: 'Ozon', color: '#005BFF' },
		{ id: 'ym', name: 'Яндекс.Маркет', color: '#FFCC00' }
	];

	// Лимиты по маркетплейсам
	const titleLimits = { wb: 100, ozon: 200, ym: 150 };

	async function generateContent() {
		if (!productInput.trim()) {
			toast.error('Введите ссылку или артикул товара');
			return;
		}

		isLoading = true;
		loadingProgress = 0;
		draft = null;

		// Симуляция прогресса
		const progressInterval = setInterval(() => {
			loadingProgress = Math.min(loadingProgress + Math.random() * 15, 90);
		}, 300);

		try {
			// TODO: Интеграция с API Content Factory
			// POST /content/generate
			await new Promise(resolve => setTimeout(resolve, 2000));

			loadingProgress = 100;

			// Извлекаем артикул из ввода
			const sku = extractSku(productInput);

			draft = {
				id: 'draft_' + Math.random().toString(36).substr(2, 8),
				sku: sku || 'OM-12345',
				marketplace: selectedMarketplace.toUpperCase(),
				status: 'pending',
				title: 'Охана Маркет Платье женское летнее миди с цветочным принтом свободного кроя',
				titleMaxLength: titleLimits[selectedMarketplace],
				description: `Элегантное летнее платье из натуральной ткани станет незаменимым элементом вашего гардероба. Свободный крой обеспечивает комфорт в жаркую погоду, а яркий цветочный принт добавит образу женственности и романтичности.

• Состав: 95% хлопок, 5% эластан
• Длина: миди (ниже колена)
• Рукав: короткий
• Застёжка: без застёжки
• Уход: машинная стирка при 30°C

Платье идеально подходит для прогулок, отдыха и повседневной носки. Сочетается с босоножками, кедами и балетками.`,
				seoTags: ['платье женское', 'летнее платье', 'платье миди', 'цветочный принт', 'хлопок', 'свободный крой'],
				validation: {
					passed: true,
					items: [
						{ status: 'success', message: 'Название: длина в норме (78 из 100)' },
						{ status: 'success', message: 'Описание: содержит ключевые слова' },
						{ status: 'success', message: 'SEO-теги: 6 из 6 уникальных' }
					]
				}
			};

			toast.success('Контент сгенерирован');
		} catch (e: any) {
			draft = { error: e.message || 'Произошла ошибка при генерации' };
			toast.error('Ошибка генерации');
		} finally {
			clearInterval(progressInterval);
			isLoading = false;
		}
	}

	function extractSku(input: string): string | null {
		// Простое извлечение артикула из URL или текста
		const match = input.match(/(\d{5,})/);
		return match ? match[1] : null;
	}

	function copyToClipboard(text: string, label: string) {
		navigator.clipboard.writeText(text);
		toast.success(`${label} скопировано`);
	}

	async function approveDraft() {
		if (!draft?.id) return;
		toast.success('Черновик утверждён');
		if (draft) draft.status = 'approved';
	}

	async function regenerate() {
		await generateContent();
	}

	function clearAll() {
		productInput = '';
		draft = null;
	}

	function getStatusBadge(status: string) {
		const badges: Record<string, { label: string; class: string }> = {
			pending: { label: 'Ожидает', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
			approved: { label: 'Утверждён', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
			published: { label: 'Опубликован', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
			rejected: { label: 'Отклонён', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
		};
		return badges[status] || badges.pending;
	}

	function getValidationIcon(status: string) {
		if (status === 'success') return '✓';
		if (status === 'warning') return '⚠';
		return '✗';
	}
</script>

<svelte:head>
	<title>Content Factory | Adolf</title>
</svelte:head>

<div class="flex flex-col w-full h-full overflow-y-auto">
	<div class="max-w-4xl w-full mx-auto px-4 py-8 md:py-12">

		<!-- Заголовок модуля -->
		<div class="mb-8">
			<div class="flex items-center gap-3 mb-2">
				<span class="text-2xl">📝</span>
				<h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
					Content Factory
				</h1>
			</div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Генерация SEO-контента для карточек товаров на маркетплейсах
			</p>
		</div>

		<!-- Форма ввода -->
		<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-6">

			<!-- Выбор маркетплейса -->
			<div class="mb-4">
				<label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
					Маркетплейс
				</label>
				<div class="flex gap-2">
					{#each marketplaces as mp}
						<button
							type="button"
							on:click={() => selectedMarketplace = mp.id}
							class="px-4 py-2 text-sm font-medium rounded-xl border transition
								{selectedMarketplace === mp.id
									? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-500'
									: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}"
						>
							{mp.name}
						</button>
					{/each}
				</div>
			</div>

			<!-- Ввод ссылки/артикула -->
			<div class="mb-4">
				<label for="product-input" class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
					Ссылка или артикул товара
				</label>
				<input
					type="text"
					id="product-input"
					bind:value={productInput}
					placeholder="https://www.wildberries.ru/catalog/12345678 или артикул OM-12345"
					class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
						bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100
						placeholder-gray-400 dark:placeholder-gray-500
						focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
						transition text-sm"
					on:keydown={(e) => e.key === 'Enter' && generateContent()}
					disabled={isLoading}
				/>
			</div>

			<!-- Кнопка генерации -->
			<button
				type="button"
				on:click={generateContent}
				disabled={isLoading || !productInput.trim()}
				class="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white
					disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500
					font-medium rounded-xl transition text-sm flex items-center justify-center gap-2"
			>
				{#if isLoading}
					<svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
					</svg>
					<span>Генерация...</span>
				{:else}
					<span>Сгенерировать контент</span>
				{/if}
			</button>
		</div>

		<!-- Состояние загрузки -->
		{#if isLoading}
			<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 mb-6">
				<div class="flex flex-col items-center justify-center text-center">
					<!-- Анимированный логотип -->
					<div class="relative w-20 h-20 mb-6">
						<!-- Внешний пульсирующий круг -->
						<div class="absolute inset-0 rounded-full bg-violet-500/20 animate-ping"></div>
						<!-- Вращающееся кольцо -->
						<div class="absolute inset-2 rounded-full border-4 border-violet-200 dark:border-violet-800 border-t-violet-500 animate-spin"></div>
						<!-- Центральная иконка -->
						<div class="absolute inset-0 flex items-center justify-center">
							<span class="text-2xl animate-pulse">📝</span>
						</div>
					</div>

					<p class="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
						Генерация контента
					</p>
					<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
						{productInput.length > 40 ? productInput.slice(0, 40) + '...' : productInput}
					</p>

					<!-- Анимированные точки процесса -->
					<div class="flex items-center gap-3 mb-4">
						<div class="flex gap-1">
							<span class="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
							<span class="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
							<span class="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
						</div>
					</div>

					<!-- Прогресс-бар с волной -->
					<div class="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
						<div
							class="h-full bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600 transition-all duration-300 ease-out"
							style="width: {loadingProgress}%"
						></div>
						<!-- Блик движущийся -->
						<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
					</div>
					<p class="text-xs text-gray-400 dark:text-gray-500 mt-2 font-mono">
						{Math.round(loadingProgress)}%
					</p>
				</div>
			</div>

			<!-- Skeleton preview -->
			<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden mb-6 opacity-50">
				<div class="px-5 py-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
					<div class="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
				</div>
				<div class="p-5 space-y-4">
					<div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
					<div class="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
					<div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
					<div class="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
					<div class="flex gap-2">
						<div class="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
						<div class="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
						<div class="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Результат генерации -->
		{#if draft && !isLoading}
			<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden mb-6">

				<!-- Заголовок результата -->
				<div class="flex items-center gap-3 px-5 py-4 bg-violet-50 dark:bg-violet-900/20 border-b border-gray-200 dark:border-gray-800">
					<span class="text-xl">📝</span>
					<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
						Сгенерированный контент
					</h2>
				</div>

				{#if draft.error}
					<!-- Ошибка -->
					<div class="p-5">
						<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
							<p class="text-sm text-red-600 dark:text-red-400">{draft.error}</p>
						</div>
					</div>
				{:else}
					<div class="p-5 space-y-5">

						<!-- Метаданные -->
						<div class="flex flex-wrap items-center gap-4 text-sm">
							<div class="flex items-baseline gap-1">
								<span class="font-semibold text-gray-500 dark:text-gray-400">Артикул:</span>
								<span class="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-900 dark:text-gray-100">{draft.sku}</span>
							</div>
							<div class="flex items-baseline gap-1">
								<span class="font-semibold text-gray-500 dark:text-gray-400">Маркетплейс:</span>
								<span class="text-gray-900 dark:text-gray-100">{draft.marketplace}</span>
							</div>
							<div class="flex items-baseline gap-1">
								<span class="font-semibold text-gray-500 dark:text-gray-400">ID:</span>
								<span class="font-mono text-gray-500 dark:text-gray-400">{draft.id}</span>
							</div>
							{#if draft.status}
								{@const badge = getStatusBadge(draft.status)}
								<span class="px-2 py-0.5 text-xs font-medium rounded-full {badge.class}">
									{badge.label}
								</span>
							{/if}
						</div>

						<hr class="border-gray-200 dark:border-gray-800" />

						<!-- Название -->
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
									Название
								</span>
								<span class="text-xs font-mono text-gray-400 dark:text-gray-500
									{(draft.title?.length || 0) > (draft.titleMaxLength || 100) ? 'text-red-500' : ''}">
									{draft.title?.length || 0} / {draft.titleMaxLength || 100} символов
								</span>
							</div>
							<div class="bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
								<p class="text-sm text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
									{draft.title}
								</p>
							</div>
						</div>

						<!-- Описание -->
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
									Описание
								</span>
								<span class="text-xs font-mono text-gray-400 dark:text-gray-500">
									{draft.description?.length || 0} символов
								</span>
							</div>
							<div class="bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl p-4 max-h-48 overflow-y-auto">
								<p class="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
									{draft.description}
								</p>
							</div>
						</div>

						<!-- SEO-теги -->
						{#if draft.seoTags && draft.seoTags.length > 0}
							<div>
								<div class="flex items-center justify-between mb-2">
									<span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
										SEO-теги
									</span>
									<span class="text-xs font-mono text-gray-400 dark:text-gray-500">
										{draft.seoTags.length} тегов
									</span>
								</div>
								<div class="flex flex-wrap gap-2">
									{#each draft.seoTags as tag}
										<span class="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400
											text-sm font-mono rounded-full hover:bg-violet-200 dark:hover:bg-violet-900/50 transition cursor-default">
											{tag}
										</span>
									{/each}
								</div>
							</div>
						{/if}

						<hr class="border-gray-200 dark:border-gray-800" />

						<!-- Валидация -->
						{#if draft.validation}
							<div class="bg-gray-50 dark:bg-gray-850 rounded-xl p-4">
								<div class="flex items-center gap-2 mb-3 text-sm font-semibold
									{draft.validation.passed ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}">
									{#if draft.validation.passed}
										✅ Валидация пройдена
									{:else}
										⚠️ Валидация с замечаниями
									{/if}
								</div>
								<ul class="space-y-1">
									{#each draft.validation.items as item}
										<li class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
											<span class="flex-shrink-0
												{item.status === 'success' ? 'text-green-500' : ''}
												{item.status === 'warning' ? 'text-amber-500' : ''}
												{item.status === 'error' ? 'text-red-500' : ''}">
												{getValidationIcon(item.status)}
											</span>
											<span>{item.message}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						<!-- Кнопки действий -->
						<div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
							<button
								type="button"
								on:click={approveDraft}
								class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition text-sm flex items-center gap-2"
							>
								✓ Утвердить
							</button>
							<button
								type="button"
								on:click={() => toast.info('Редактирование пока не доступно')}
								class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition text-sm flex items-center gap-2"
							>
								✏️ Исправить
							</button>
							<button
								type="button"
								on:click={() => toast.info('ТЗ для дизайнера пока не доступно')}
								class="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition text-sm flex items-center gap-2"
							>
								📸 ТЗ дизайнеру
							</button>
							<button
								type="button"
								on:click={regenerate}
								class="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
									hover:bg-gray-100 dark:hover:bg-gray-800 font-medium rounded-xl transition text-sm flex items-center gap-2"
							>
								🔄 Заново
							</button>
						</div>

						<!-- Копирование -->
						<div class="flex flex-wrap gap-2 text-xs">
							<button
								type="button"
								on:click={() => copyToClipboard(draft?.title || '', 'Название')}
								class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
							>
								📋 Копировать название
							</button>
							<span class="text-gray-300 dark:text-gray-700">|</span>
							<button
								type="button"
								on:click={() => copyToClipboard(draft?.description || '', 'Описание')}
								class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
							>
								📋 Копировать описание
							</button>
							<span class="text-gray-300 dark:text-gray-700">|</span>
							<button
								type="button"
								on:click={() => copyToClipboard(draft?.seoTags?.join(', ') || '', 'Теги')}
								class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
							>
								📋 Копировать теги
							</button>
						</div>
					</div>
				{/if}
			</div>

			<!-- Кнопка очистки -->
			<button
				type="button"
				on:click={clearAll}
				class="w-full py-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
			>
				Начать заново
			</button>
		{/if}

		<!-- Пустое состояние -->
		{#if !draft && !isLoading}
			<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12">
				<div class="text-center">
					<div class="w-16 h-16 mx-auto mb-4 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center">
						<span class="text-3xl">📝</span>
					</div>
					<h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
						Генерация контента
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
						Введите ссылку на товар или артикул, выберите маркетплейс и нажмите «Сгенерировать контент»
					</p>
				</div>
			</div>
		{/if}

	</div>
</div>

<style>
	/* Анимация спиннера */
	.border-3 {
		border-width: 3px;
	}

	/* Анимация блика на прогресс-баре */
	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.animate-shimmer {
		animation: shimmer 1.5s infinite;
	}

	/* Плавное появление */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.3s ease-out;
	}
</style>
