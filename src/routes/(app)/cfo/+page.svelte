<script lang="ts">
	import { getContext } from 'svelte';
	import { showSidebar, mobile } from '$lib/stores';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import Sidebar from '$lib/components/icons/Sidebar.svelte';

	const i18n = getContext('i18n');

	// Активная вкладка отчёта
	let activeReportTab: 'categories' | 'brands' | 'marketplaces' | 'sku' = 'categories';

	// Выбранный период
	let selectedPeriod: 'today' | 'week' | 'month' | 'quarter' = 'week';

	// Активная секция
	let activeSection: 'pnl' | 'abc' | 'losers' | 'insights' = 'pnl';

	// Моковые данные P&L
	const pnlData = [
		{ name: 'Платья', revenue: 2450000, cogs: 980000, profit: 1102500, margin: 45.0 },
		{ name: 'Блузки', revenue: 1230000, cogs: 492000, profit: 553500, margin: 45.0 },
		{ name: 'Брюки', revenue: 890000, cogs: 356000, profit: 400500, margin: 45.0 },
		{ name: 'Юбки', revenue: 560000, cogs: 280000, profit: 168000, margin: 30.0 },
		{ name: 'Аксессуары', revenue: 120000, cogs: 96000, profit: 14400, margin: 12.0 }
	];

	const totals = {
		revenue: 5250000,
		cogs: 2204000,
		profit: 2238900,
		margin: 42.6
	};

	// ABC данные
	const abcData = [
		{ class: 'A', count: 25, revenueShare: 80.0, profitShare: 75.0, desc: 'Лидеры продаж' },
		{ class: 'B', count: 50, revenueShare: 15.0, profitShare: 18.0, desc: 'Стабильные середняки' },
		{ class: 'C', count: 100, revenueShare: 4.5, profitShare: 6.0, desc: 'Требуют внимания' },
		{ class: 'D', count: 25, revenueShare: 0.5, profitShare: -1.0, desc: 'Убыточные' }
	];

	// Убыточные SKU
	const losers = [
		{ sku: 'OM-099', name: 'Блузка шифоновая белая', sold: 15, revenue: 25000, loss: -5000, mp: 'WB' },
		{ sku: 'OM-156', name: 'Юбка плиссе бежевая', sold: 8, revenue: 18400, loss: -3200, mp: 'OZ' },
		{ sku: 'OK-045', name: 'Комбинезон детский', sold: 3, revenue: 8700, loss: -1500, mp: 'YM' }
	];

	// AI инсайты
	const insights = [
		{
			icon: '📈',
			title: 'Рост категории "Платья"',
			text: 'Категория показала рост +23% относительно прошлой недели. Рекомендуется увеличить закупки популярных моделей.',
			impact: '+350 000 ₽/нед',
			type: 'positive'
		},
		{
			icon: '⚠️',
			title: 'Снижение маржи на Ozon',
			text: 'Средняя маржинальность на Ozon снизилась с 42% до 35% за последний месяц из-за роста комиссий.',
			impact: '-120 000 ₽/мес',
			type: 'negative'
		},
		{
			icon: '💡',
			title: 'Оптимизация SKU класса D',
			text: '5 позиций класса D генерируют убыток 9 700 ₽/нед. Рекомендуется: повысить цену на 15% или вывести из ассортимента.',
			impact: 'требуется решение',
			type: 'neutral'
		}
	];

	// Метрики
	const metrics = [
		{ icon: '💵', value: '5.25M ₽', label: 'Выручка', change: '+12%', up: true },
		{ icon: '💰', value: '2.24M ₽', label: 'Чистая прибыль', change: '+8%', up: true },
		{ icon: '📊', value: '42.6%', label: 'Средняя маржа', change: '-2%', up: false },
		{ icon: '📦', value: '1 842', label: 'Заказов', change: '+15%', up: true },
		{ icon: '🔴', value: '5', label: 'Убыточных SKU', change: '-2', up: true }
	];

	function formatMoney(value: number): string {
		return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
	}

	function getMarginClass(margin: number): string {
		if (margin >= 40) return 'high';
		if (margin >= 20) return 'medium';
		return 'low';
	}

	function getAbcClass(cls: string): string {
		switch(cls) {
			case 'A': return 'abc-a';
			case 'B': return 'abc-b';
			case 'C': return 'abc-c';
			case 'D': return 'abc-d';
			default: return '';
		}
	}

	const handlePageClick = () => {
		if ($mobile && $showSidebar) {
			showSidebar.set(false);
		}
	};
</script>

<svelte:head>
	<title>CFO | Adolf</title>
</svelte:head>

<style>
	/* CFO Module Styles */
	.cfo-container {
		--cfo-text-primary: #1F2937;
		--cfo-text-secondary: #6B7280;
		--cfo-text-tertiary: #9CA3AF;
		--cfo-bg-primary: #FFFFFF;
		--cfo-bg-secondary: #F9FAFB;
		--cfo-border: #E5E7EB;
		--cfo-success: #10B981;
		--cfo-warning: #F59E0B;
		--cfo-error: #EF4444;
	}

	:global(.dark) .cfo-container {
		--cfo-text-primary: #F9FAFB;
		--cfo-text-secondary: #D1D5DB;
		--cfo-text-tertiary: #9CA3AF;
		--cfo-bg-primary: #1F2937;
		--cfo-bg-secondary: #374151;
		--cfo-border: #4B5563;
	}

	/* Tabs */
	.cfo-tabs {
		display: flex;
		gap: 0.25rem;
		border-bottom: 1px solid var(--cfo-border);
		margin-bottom: 1rem;
	}

	.cfo-tab {
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--cfo-text-secondary);
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
		cursor: pointer;
		background: none;
		border-top: none;
		border-left: none;
		border-right: none;
	}

	.cfo-tab:hover {
		color: var(--cfo-text-primary);
	}

	.cfo-tab.active {
		color: var(--cfo-text-primary);
		border-bottom-color: var(--cfo-text-primary);
	}

	/* Period Filter */
	.cfo-period-filter {
		display: flex;
		gap: 0.25rem;
		margin-bottom: 1.5rem;
	}

	.cfo-period-btn {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		color: var(--cfo-text-secondary);
		background: var(--cfo-bg-secondary);
		border: 1px solid var(--cfo-border);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.cfo-period-btn:hover {
		background: var(--cfo-border);
	}

	.cfo-period-btn.active {
		background: var(--cfo-text-primary);
		color: var(--cfo-bg-primary);
		border-color: var(--cfo-text-primary);
	}

	/* Report Card */
	.cfo-report {
		background: var(--cfo-bg-primary);
		border: 1px solid var(--cfo-border);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.cfo-report-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--cfo-border);
	}

	.cfo-report-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--cfo-text-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.cfo-report-period {
		font-size: 0.875rem;
		color: var(--cfo-text-secondary);
	}

	/* Table */
	.cfo-table {
		width: 100%;
		border-collapse: collapse;
	}

	.cfo-table th {
		padding: 0.75rem 1rem;
		text-align: left;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--cfo-text-tertiary);
		background: var(--cfo-bg-secondary);
	}

	.cfo-table th.text-right {
		text-align: right;
	}

	.cfo-table td {
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		color: var(--cfo-text-primary);
		border-top: 1px solid var(--cfo-border);
	}

	.cfo-table td.text-right {
		text-align: right;
	}

	.cfo-table tr.total {
		background: var(--cfo-bg-secondary);
		font-weight: 600;
	}

	/* Values */
	.cfo-value {
		font-family: ui-monospace, monospace;
	}

	.cfo-value.positive {
		color: var(--cfo-success);
	}

	.cfo-value.negative {
		color: var(--cfo-error);
	}

	/* Margin badges */
	.cfo-margin {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.cfo-margin.high {
		background: #D1FAE5;
		color: #059669;
	}

	.cfo-margin.medium {
		background: #FEF3C7;
		color: #D97706;
	}

	.cfo-margin.low {
		background: #FEE2E2;
		color: #DC2626;
	}

	:global(.dark) .cfo-margin.high {
		background: #064E3B;
		color: #34D399;
	}

	:global(.dark) .cfo-margin.medium {
		background: #78350F;
		color: #FBBF24;
	}

	:global(.dark) .cfo-margin.low {
		background: #7F1D1D;
		color: #F87171;
	}

	/* Summary */
	.cfo-summary {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: var(--cfo-bg-secondary);
		border-top: 1px solid var(--cfo-border);
	}

	.cfo-summary-item {
		text-align: center;
	}

	.cfo-summary-label {
		font-size: 0.75rem;
		color: var(--cfo-text-tertiary);
		margin-bottom: 0.25rem;
	}

	.cfo-summary-value {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--cfo-text-primary);
		font-family: ui-monospace, monospace;
	}

	.cfo-summary-value.profit {
		color: var(--cfo-success);
	}

	/* Actions */
	.cfo-actions {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 1.25rem;
		border-top: 1px solid var(--cfo-border);
		flex-wrap: wrap;
	}

	.cfo-btn {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		border: 1px solid var(--cfo-border);
		background: var(--cfo-bg-primary);
		color: var(--cfo-text-primary);
	}

	.cfo-btn:hover {
		background: var(--cfo-bg-secondary);
	}

	.cfo-btn-primary {
		background: var(--cfo-text-primary);
		color: var(--cfo-bg-primary);
		border-color: var(--cfo-text-primary);
	}

	.cfo-btn-primary:hover {
		opacity: 0.9;
	}

	.cfo-btn-danger {
		background: #FEE2E2;
		color: #DC2626;
		border-color: #FECACA;
	}

	:global(.dark) .cfo-btn-danger {
		background: #7F1D1D;
		color: #F87171;
		border-color: #991B1B;
	}

	/* ABC */
	.cfo-abc-distribution {
		display: flex;
		height: 2rem;
		border-radius: 0.5rem;
		overflow: hidden;
		margin: 1rem 0;
	}

	.cfo-abc-segment {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 600;
		color: white;
	}

	.cfo-abc-segment.abc-a { background: #10B981; }
	.cfo-abc-segment.abc-b { background: #3B82F6; }
	.cfo-abc-segment.abc-c { background: #F59E0B; }
	.cfo-abc-segment.abc-d { background: #EF4444; }

	.cfo-abc-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.cfo-abc-legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--cfo-text-secondary);
	}

	.cfo-abc-legend-dot {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
	}

	.cfo-abc-legend-dot.abc-a { background: #10B981; }
	.cfo-abc-legend-dot.abc-b { background: #3B82F6; }
	.cfo-abc-legend-dot.abc-c { background: #F59E0B; }
	.cfo-abc-legend-dot.abc-d { background: #EF4444; }

	.cfo-abc-class {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
	}

	.cfo-abc-class.abc-a { background: #10B981; }
	.cfo-abc-class.abc-b { background: #3B82F6; }
	.cfo-abc-class.abc-c { background: #F59E0B; }
	.cfo-abc-class.abc-d { background: #EF4444; }

	/* Losers */
	.cfo-loser-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border: 1px solid var(--cfo-border);
		border-radius: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.cfo-loser-sku {
		font-family: ui-monospace, monospace;
		font-size: 0.75rem;
		color: var(--cfo-text-tertiary);
	}

	.cfo-loser-name {
		font-weight: 500;
		color: var(--cfo-text-primary);
		margin: 0.25rem 0;
	}

	.cfo-loser-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.75rem;
		color: var(--cfo-text-secondary);
	}

	.cfo-loser-loss {
		text-align: right;
	}

	.cfo-loser-loss-value {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--cfo-error);
		font-family: ui-monospace, monospace;
	}

	.cfo-loser-loss-label {
		font-size: 0.75rem;
		color: var(--cfo-text-tertiary);
	}

	/* MP Badge */
	.cfo-mp-badge {
		display: inline-block;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.cfo-mp-badge.wb { background: #7B2D8E; color: white; }
	.cfo-mp-badge.oz { background: #005BFF; color: white; }
	.cfo-mp-badge.ym { background: #FFCC00; color: black; }

	/* Insights */
	.cfo-insight-card {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--cfo-border);
		border-radius: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.cfo-insight-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.cfo-insight-title {
		font-weight: 600;
		color: var(--cfo-text-primary);
		margin-bottom: 0.25rem;
	}

	.cfo-insight-text {
		font-size: 0.875rem;
		color: var(--cfo-text-secondary);
		margin-bottom: 0.5rem;
	}

	.cfo-insight-impact {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		display: inline-block;
	}

	.cfo-insight-impact.positive {
		background: #D1FAE5;
		color: #059669;
	}

	.cfo-insight-impact.negative {
		background: #FEE2E2;
		color: #DC2626;
	}

	.cfo-insight-impact.neutral {
		background: #E5E7EB;
		color: #4B5563;
	}

	:global(.dark) .cfo-insight-impact.positive {
		background: #064E3B;
		color: #34D399;
	}

	:global(.dark) .cfo-insight-impact.negative {
		background: #7F1D1D;
		color: #F87171;
	}

	:global(.dark) .cfo-insight-impact.neutral {
		background: #374151;
		color: #D1D5DB;
	}

	/* Metrics */
	.cfo-metrics {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	@media (max-width: 768px) {
		.cfo-metrics {
			grid-template-columns: repeat(2, 1fr);
		}
		.cfo-summary {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.cfo-metric-card {
		background: var(--cfo-bg-primary);
		border: 1px solid var(--cfo-border);
		border-radius: 0.5rem;
		padding: 1rem;
		text-align: center;
	}

	.cfo-metric-icon {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
	}

	.cfo-metric-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--cfo-text-primary);
		font-family: ui-monospace, monospace;
	}

	.cfo-metric-value.positive {
		color: var(--cfo-success);
	}

	.cfo-metric-value.negative {
		color: var(--cfo-error);
	}

	.cfo-metric-label {
		font-size: 0.75rem;
		color: var(--cfo-text-tertiary);
		margin-top: 0.25rem;
	}

	.cfo-metric-change {
		font-size: 0.75rem;
		font-weight: 500;
		margin-top: 0.25rem;
	}

	.cfo-metric-change.up {
		color: var(--cfo-success);
	}

	.cfo-metric-change.down {
		color: var(--cfo-error);
	}

	/* Section nav */
	.cfo-section-nav {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="h-screen max-h-[100dvh] w-full flex flex-col overflow-x-hidden overflow-y-auto transition-all duration-300 {$showSidebar
		? 'md:max-w-[calc(100%-var(--sidebar-width))] md:ml-[var(--sidebar-width)]'
		: ''}"
	on:click={handlePageClick}
	role="main"
>
	<div class="cfo-container flex-1 flex flex-col px-4 sm:px-6 lg:px-8 pt-6 pb-6">
		<!-- Mobile sidebar button -->
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

		<div class="max-w-6xl mx-auto w-full">
			<!-- Header -->
			<div class="mb-6">
				<h1 class="text-2xl font-bold" style="color: var(--cfo-text-primary)">
					💰 CFO
				</h1>
				<p class="text-sm" style="color: var(--cfo-text-secondary)">
					Финансовая аналитика и управленческий учёт
				</p>
			</div>

			<!-- Metrics Cards -->
			<div class="cfo-metrics">
				{#each metrics as m}
					<div class="cfo-metric-card">
						<div class="cfo-metric-icon">{m.icon}</div>
						<div class="cfo-metric-value {m.label === 'Чистая прибыль' ? 'positive' : ''} {m.label === 'Убыточных SKU' && parseInt(m.value) > 0 ? 'negative' : ''}">{m.value}</div>
						<div class="cfo-metric-label">{m.label}</div>
						<div class="cfo-metric-change {m.up ? 'up' : 'down'}">
							{m.up ? '↑' : '↓'} {m.change}
						</div>
					</div>
				{/each}
			</div>

			<!-- Report Type Tabs -->
			<div class="cfo-tabs">
				{#each [
					{ id: 'categories', label: '📊 По категориям' },
					{ id: 'brands', label: '🏷️ По брендам' },
					{ id: 'marketplaces', label: '🛒 По МП' },
					{ id: 'sku', label: '📦 По SKU' }
				] as tab}
					<button
						class="cfo-tab {activeReportTab === tab.id ? 'active' : ''}"
						on:click={() => activeReportTab = tab.id}
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<!-- Period Filter -->
			<div class="cfo-period-filter">
				{#each [
					{ id: 'today', label: 'Сегодня' },
					{ id: 'week', label: 'Неделя' },
					{ id: 'month', label: 'Месяц' },
					{ id: 'quarter', label: 'Квартал' }
				] as period}
					<button
						class="cfo-period-btn {selectedPeriod === period.id ? 'active' : ''}"
						on:click={() => selectedPeriod = period.id}
					>
						{period.label}
					</button>
				{/each}
				<button class="cfo-period-btn">📅 Выбрать</button>
			</div>

			<!-- Section Navigation -->
			<div class="cfo-section-nav">
				<button
					class="cfo-btn {activeSection === 'pnl' ? 'cfo-btn-primary' : ''}"
					on:click={() => activeSection = 'pnl'}
				>
					📊 P&L отчёт
				</button>
				<button
					class="cfo-btn {activeSection === 'abc' ? 'cfo-btn-primary' : ''}"
					on:click={() => activeSection = 'abc'}
				>
					🔤 ABC-анализ
				</button>
				<button
					class="cfo-btn cfo-btn-danger {activeSection === 'losers' ? '' : ''}"
					on:click={() => activeSection = 'losers'}
				>
					🔴 Убыточные SKU
				</button>
				<button
					class="cfo-btn {activeSection === 'insights' ? 'cfo-btn-primary' : ''}"
					on:click={() => activeSection = 'insights'}
				>
					🤖 AI-инсайты
				</button>
			</div>

			<!-- P&L Report -->
			{#if activeSection === 'pnl'}
				<div class="cfo-report">
					<div class="cfo-report-header">
						<h2 class="cfo-report-title">
							<span>💰</span>
							P&L по категориям
						</h2>
						<span class="cfo-report-period">📅 13.01.2026 — 19.01.2026</span>
					</div>

					<table class="cfo-table">
						<thead>
							<tr>
								<th>Категория</th>
								<th class="text-right">Выручка</th>
								<th class="text-right">Себестоимость</th>
								<th class="text-right">Прибыль</th>
								<th class="text-right">Маржа</th>
							</tr>
						</thead>
						<tbody>
							{#each pnlData as row}
								<tr>
									<td>{row.name}</td>
									<td class="text-right"><span class="cfo-value">{formatMoney(row.revenue)}</span></td>
									<td class="text-right"><span class="cfo-value">{formatMoney(row.cogs)}</span></td>
									<td class="text-right"><span class="cfo-value positive">{formatMoney(row.profit)}</span></td>
									<td class="text-right"><span class="cfo-margin {getMarginClass(row.margin)}">{row.margin}%</span></td>
								</tr>
							{/each}
							<tr class="total">
								<td><strong>Итого</strong></td>
								<td class="text-right"><span class="cfo-value">{formatMoney(totals.revenue)}</span></td>
								<td class="text-right"><span class="cfo-value">{formatMoney(totals.cogs)}</span></td>
								<td class="text-right"><span class="cfo-value positive">{formatMoney(totals.profit)}</span></td>
								<td class="text-right"><span class="cfo-margin {getMarginClass(totals.margin)}">{totals.margin}%</span></td>
							</tr>
						</tbody>
					</table>

					<div class="cfo-summary">
						<div class="cfo-summary-item">
							<div class="cfo-summary-label">Выручка</div>
							<div class="cfo-summary-value">{formatMoney(totals.revenue)}</div>
						</div>
						<div class="cfo-summary-item">
							<div class="cfo-summary-label">Себестоимость</div>
							<div class="cfo-summary-value">{formatMoney(totals.cogs)}</div>
						</div>
						<div class="cfo-summary-item">
							<div class="cfo-summary-label">Чистая прибыль</div>
							<div class="cfo-summary-value profit">{formatMoney(totals.profit)}</div>
						</div>
						<div class="cfo-summary-item">
							<div class="cfo-summary-label">Средняя маржа</div>
							<div class="cfo-summary-value">{totals.margin}%</div>
						</div>
					</div>

					<div class="cfo-actions">
						<button class="cfo-btn">🏷️ По брендам</button>
						<button class="cfo-btn">🛒 По МП</button>
						<button class="cfo-btn">🔤 ABC-анализ</button>
						<button class="cfo-btn">📥 Excel</button>
					</div>
				</div>
			{/if}

			<!-- ABC Analysis -->
			{#if activeSection === 'abc'}
				<div class="cfo-report">
					<div class="cfo-report-header">
						<h2 class="cfo-report-title">
							<span>🔤</span>
							ABC-анализ товарного портфеля
						</h2>
					</div>

					<div style="padding: 1.25rem;">
						<!-- Distribution Bar -->
						<div class="cfo-abc-distribution">
							<div class="cfo-abc-segment abc-a" style="flex: 80;">A 80%</div>
							<div class="cfo-abc-segment abc-b" style="flex: 15;">B 15%</div>
							<div class="cfo-abc-segment abc-c" style="flex: 4;">C</div>
							<div class="cfo-abc-segment abc-d" style="flex: 1;"></div>
						</div>

						<!-- Legend -->
						<div class="cfo-abc-legend">
							<div class="cfo-abc-legend-item">
								<div class="cfo-abc-legend-dot abc-a"></div>
								<span>A — Лидеры (80% прибыли)</span>
							</div>
							<div class="cfo-abc-legend-item">
								<div class="cfo-abc-legend-dot abc-b"></div>
								<span>B — Середняки (15% прибыли)</span>
							</div>
							<div class="cfo-abc-legend-item">
								<div class="cfo-abc-legend-dot abc-c"></div>
								<span>C — Аутсайдеры (4.5% прибыли)</span>
							</div>
							<div class="cfo-abc-legend-item">
								<div class="cfo-abc-legend-dot abc-d"></div>
								<span>D — Убыточные</span>
							</div>
						</div>

						<hr style="border: none; border-top: 1px solid var(--cfo-border); margin: 1rem 0;">

						<!-- ABC Table -->
						<table class="cfo-table">
							<thead>
								<tr>
									<th style="text-align: center;">Класс</th>
									<th style="text-align: center;">SKU</th>
									<th class="text-right">Доля выручки</th>
									<th class="text-right">Доля прибыли</th>
									<th>Описание</th>
								</tr>
							</thead>
							<tbody>
								{#each abcData as row}
									<tr>
										<td style="text-align: center;"><span class="cfo-abc-class {getAbcClass(row.class)}">{row.class}</span></td>
										<td style="text-align: center;"><strong>{row.count}</strong></td>
										<td class="text-right"><span class="cfo-value">{row.revenueShare}%</span></td>
										<td class="text-right"><span class="cfo-value {row.profitShare < 0 ? 'negative' : ''}">{row.profitShare}%</span></td>
										<td>{row.desc}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div class="cfo-actions">
						<button class="cfo-btn cfo-btn-danger">🔴 Убыточные SKU</button>
						<button class="cfo-btn">🤖 AI-инсайты</button>
						<button class="cfo-btn">📥 Excel</button>
					</div>
				</div>
			{/if}

			<!-- Losers -->
			{#if activeSection === 'losers'}
				<div class="cfo-report">
					<div class="cfo-report-header">
						<h2 class="cfo-report-title">
							<span>🔴</span>
							Убыточные позиции
						</h2>
						<span style="background: #FEE2E2; color: #DC2626; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 600; font-size: 0.875rem;">
							{losers.length}
						</span>
					</div>

					<div style="padding: 1.25rem;">
						{#each losers as item}
							<div class="cfo-loser-card">
								<div>
									<div class="cfo-loser-sku">{item.sku}</div>
									<h4 class="cfo-loser-name">{item.name}</h4>
									<div class="cfo-loser-meta">
										<span>📦 Продано: {item.sold} шт</span>
										<span>💵 Выручка: {formatMoney(item.revenue)}</span>
										<span class="cfo-mp-badge {item.mp.toLowerCase()}">{item.mp}</span>
									</div>
								</div>
								<div class="cfo-loser-loss">
									<div class="cfo-loser-loss-value">{formatMoney(item.loss)}</div>
									<div class="cfo-loser-loss-label">убыток</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="cfo-actions">
						<button class="cfo-btn">🤖 AI-рекомендации</button>
						<button class="cfo-btn">📥 Excel</button>
					</div>
				</div>
			{/if}

			<!-- AI Insights -->
			{#if activeSection === 'insights'}
				<div class="cfo-report">
					<div class="cfo-report-header">
						<h2 class="cfo-report-title">
							<span>🤖</span>
							AI-инсайты
						</h2>
					</div>

					<div style="padding: 1.25rem;">
						{#each insights as insight}
							<div class="cfo-insight-card">
								<div class="cfo-insight-icon">{insight.icon}</div>
								<div>
									<h4 class="cfo-insight-title">{insight.title}</h4>
									<p class="cfo-insight-text">{insight.text}</p>
									<span class="cfo-insight-impact {insight.type}">
										{#if insight.type === 'positive'}💰{:else if insight.type === 'negative'}📉{:else}🎯{/if}
										{insight.type === 'neutral' ? 'Действие: ' : insight.type === 'positive' ? 'Потенциал: ' : 'Влияние: '}{insight.impact}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
