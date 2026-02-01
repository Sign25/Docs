<script lang="ts">
	import { getContext } from 'svelte';
	import { showSidebar, mobile } from '$lib/stores';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import Sidebar from '$lib/components/icons/Sidebar.svelte';

	const i18n = getContext('i18n');

	// Активная вкладка
	let activeTab: 'pnl' | 'abc' | 'insights' = 'pnl';

	// Выбранный период
	let selectedPeriod: 'week' | 'month' | 'quarter' = 'week';

	// Моковые данные для демонстрации
	const pnlData = {
		categories: [
			{ name: 'Платья', revenue: 2450000, cogs: 980000, expenses: 367500, profit: 1102500, margin: 45.0 },
			{ name: 'Блузки', revenue: 1230000, cogs: 492000, expenses: 184500, profit: 553500, margin: 45.0 },
			{ name: 'Брюки', revenue: 890000, cogs: 356000, expenses: 133500, profit: 400500, margin: 45.0 },
			{ name: 'Юбки', revenue: 560000, cogs: 224000, expenses: 84000, profit: 252000, margin: 45.0 }
		],
		summary: {
			totalRevenue: 5130000,
			totalProfit: 2308500,
			avgMargin: 45.0
		}
	};

	const abcData = {
		classes: [
			{ class: 'A', count: 47, profit: 7200000, share: 80.0, color: 'emerald' },
			{ class: 'B', count: 89, profit: 1350000, share: 15.0, color: 'blue' },
			{ class: 'C', count: 156, profit: 450000, share: 5.0, color: 'amber' },
			{ class: 'D', count: 23, profit: -180000, share: 0, color: 'red' }
		],
		totalSkus: 315
	};

	// Форматирование чисел
	function formatMoney(value: number): string {
		return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
	}

	// Закрытие сайдбара на мобильных
	const handlePageClick = () => {
		if ($mobile && $showSidebar) {
			showSidebar.set(false);
		}
	};
</script>

<svelte:head>
	<title>CFO | Adolf</title>
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
	<div class="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8">
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

		<!-- Заголовок -->
		<div class="max-w-7xl mx-auto w-full">
			<div class="flex items-center justify-between mb-6 sm:mb-8">
				<div class="flex items-center gap-3">
					<div class="size-10 sm:size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
						<svg class="size-6 sm:size-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
							CFO
						</h1>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Финансовая аналитика
						</p>
					</div>
				</div>

				<!-- Выбор периода -->
				<div class="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
					{#each [
						{ id: 'week', label: 'Неделя' },
						{ id: 'month', label: 'Месяц' },
						{ id: 'quarter', label: 'Квартал' }
					] as period}
						<button
							type="button"
							on:click={() => selectedPeriod = period.id}
							class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all
								{selectedPeriod === period.id
									? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
									: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}"
						>
							{period.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Навигация по вкладкам -->
			<div class="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
				{#each [
					{ id: 'pnl', label: 'P&L отчёты', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
					{ id: 'abc', label: 'ABC-анализ', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
					{ id: 'insights', label: 'AI-инсайты', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' }
				] as tab}
					<button
						type="button"
						on:click={() => activeTab = tab.id}
						class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
							{activeTab === tab.id
								? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
								: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}"
					>
						<svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icon} />
						</svg>
						{tab.label}
					</button>
				{/each}
			</div>

			<!-- Контент вкладок -->
			{#if activeTab === 'pnl'}
				<!-- P&L отчёты -->
				<div class="space-y-6">
					<!-- Сводка -->
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
							<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Выручка</p>
							<p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatMoney(pnlData.summary.totalRevenue)}</p>
						</div>
						<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
							<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Прибыль</p>
							<p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(pnlData.summary.totalProfit)}</p>
						</div>
						<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
							<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Маржинальность</p>
							<p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{pnlData.summary.avgMargin}%</p>
						</div>
					</div>

					<!-- Таблица по категориям -->
					<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
						<div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
							<h3 class="font-semibold text-gray-900 dark:text-gray-100">P&L по категориям</h3>
						</div>
						<div class="overflow-x-auto">
							<table class="w-full">
								<thead class="bg-gray-50 dark:bg-gray-800/50">
									<tr>
										<th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Категория</th>
										<th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Выручка</th>
										<th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Себест.</th>
										<th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Расходы МП</th>
										<th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Прибыль</th>
										<th class="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Маржа</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
									{#each pnlData.categories as cat}
										<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
											<td class="px-5 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{cat.name}</td>
											<td class="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 text-right">{formatMoney(cat.revenue)}</td>
											<td class="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 text-right">{formatMoney(cat.cogs)}</td>
											<td class="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 text-right">{formatMoney(cat.expenses)}</td>
											<td class="px-5 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 text-right">{formatMoney(cat.profit)}</td>
											<td class="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 text-right">{cat.margin}%</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>

			{:else if activeTab === 'abc'}
				<!-- ABC-анализ -->
				<div class="space-y-6">
					<!-- Сводка по классам -->
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
						{#each abcData.classes as cls}
							<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
								<div class="flex items-center gap-2 mb-3">
									<div class="size-8 rounded-lg flex items-center justify-center font-bold text-white
										{cls.color === 'emerald' ? 'bg-emerald-500' : ''}
										{cls.color === 'blue' ? 'bg-blue-500' : ''}
										{cls.color === 'amber' ? 'bg-amber-500' : ''}
										{cls.color === 'red' ? 'bg-red-500' : ''}">
										{cls.class}
									</div>
									<span class="text-sm text-gray-500 dark:text-gray-400">{cls.count} SKU</span>
								</div>
								<p class="text-lg font-bold {cls.profit < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}">
									{cls.profit < 0 ? '−' : ''}{formatMoney(Math.abs(cls.profit))}
								</p>
								{#if cls.share > 0}
									<p class="text-sm text-gray-500 dark:text-gray-400">{cls.share}% прибыли</p>
								{:else}
									<p class="text-sm text-red-500 dark:text-red-400">убыток</p>
								{/if}
							</div>
						{/each}
					</div>

					<!-- Информационный блок -->
					<div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
						<div class="flex items-start gap-3">
							<svg class="size-6 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							<div>
								<p class="font-semibold text-amber-800 dark:text-amber-200">Обнаружено {abcData.classes[3].count} убыточных SKU</p>
								<p class="text-sm text-amber-700 dark:text-amber-300 mt-1">
									Общий убыток: {formatMoney(Math.abs(abcData.classes[3].profit))}. Рекомендуется проанализировать причины.
								</p>
							</div>
						</div>
					</div>
				</div>

			{:else if activeTab === 'insights'}
				<!-- AI-инсайты -->
				<div class="space-y-6">
					<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
						<div class="flex items-center gap-3 mb-4">
							<div class="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
								<svg class="size-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">AI-анализ за неделю</h3>
						</div>

						<div class="space-y-4 text-gray-700 dark:text-gray-300">
							<div>
								<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Резюме</h4>
								<p>Неделя показала стабильные результаты с общей маржинальностью 45%. Выручка составила 5.13 млн ₽, чистая прибыль — 2.31 млн ₽.</p>
							</div>

							<div>
								<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Ключевые проблемы</h4>
								<ul class="list-disc list-inside space-y-1">
									<li>23 SKU в убытке (−180 000 ₽). Основная причина — высокая логистика.</li>
									<li>Категория «Аксессуары» показывает падение маржи на 3 п.п. к прошлой неделе.</li>
								</ul>
							</div>

							<div>
								<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Рекомендации</h4>
								<ul class="list-disc list-inside space-y-1">
									<li>Перевести убыточные SKU на FBO для снижения логистики.</li>
									<li>Пересмотреть цены в категории «Брюки» (+5-7%).</li>
									<li>Платья класса A показывают маржу 52% — увеличить закупку.</li>
								</ul>
							</div>
						</div>
					</div>

					<!-- Плейсхолдер для чата -->
					<div class="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center">
						<svg class="size-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
						<p class="text-gray-500 dark:text-gray-400 mb-2">Задайте вопрос AI-ассистенту</p>
						<p class="text-sm text-gray-400 dark:text-gray-500">
							Например: «Покажи топ-10 убыточных SKU» или «Сравни маржу WB и Ozon»
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
