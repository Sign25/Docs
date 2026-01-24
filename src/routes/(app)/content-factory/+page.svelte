<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { showSidebar, user, chatId } from '$lib/stores';

	const i18n = getContext('i18n');

	let selectedMarketplace = 'wb';
	let sku = '';
	let generating = false;

	const marketplaces = [
		{ id: 'wb', name: 'Wildberries', icon: '🟣' },
		{ id: 'ozon', name: 'Ozon', icon: '🔵' },
		{ id: 'ym', name: 'Яндекс.Маркет', icon: '🟡' }
	];

	async function startGeneration() {
		if (!sku.trim()) {
			toast.error($i18n.t('Please enter SKU'));
			return;
		}

		generating = true;

		try {
			// Переходим в чат с агентом @Adolf_Content
			const message = `Сгенерируй контент для артикула ${sku} на ${marketplaces.find(m => m.id === selectedMarketplace)?.name}`;

			// Создаем новый чат с предустановленным сообщением
			goto(`/?q=${encodeURIComponent(message)}`);
		} catch (e) {
			toast.error(`${$i18n.t('Error')}: ${e.message}`);
		} finally {
			generating = false;
		}
	}

	onMount(async () => {
		// Проверка доступа
		if ($user?.role !== 'admin' && !['senior', 'director'].includes($user?.role)) {
			// toast.error($i18n.t('Access denied'));
			// goto('/');
		}
	});
</script>

<svelte:head>
	<title>Content Factory | Adolf</title>
</svelte:head>

<div class="flex flex-col h-full w-full max-w-4xl mx-auto px-4 py-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
			{$i18n.t('Content Factory')}
		</h1>
		<p class="text-gray-600 dark:text-gray-400">
			{$i18n.t('Generate SEO content for marketplace product cards')}
		</p>
	</div>

	<!-- Quick Actions -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
		<!-- Generate Content Card -->
		<div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
			<div class="flex items-center mb-4">
				<div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mr-4">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-purple-600 dark:text-purple-400">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
					</svg>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						{$i18n.t('Generate Content')}
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						{$i18n.t('Title, description, SEO tags')}
					</p>
				</div>
			</div>
		</div>

		<!-- Drafts Card -->
		<div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
			<div class="flex items-center mb-4">
				<div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-4">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600 dark:text-blue-400">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
					</svg>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						{$i18n.t('Drafts')}
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						{$i18n.t('View and edit drafts')}
					</p>
				</div>
			</div>
		</div>

		<!-- Visual Prompting Card -->
		<div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
			<div class="flex items-center mb-4">
				<div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mr-4">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-600 dark:text-green-400">
						<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
					</svg>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						{$i18n.t('Visual Prompting')}
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						{$i18n.t('Brief for designer')}
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Generation Form -->
	<div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
			{$i18n.t('Quick Generation')}
		</h2>

		<div class="space-y-4">
			<!-- Marketplace Selection -->
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					{$i18n.t('Marketplace')}
				</label>
				<div class="flex gap-3">
					{#each marketplaces as mp}
						<button
							type="button"
							class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all
								{selectedMarketplace === mp.id
									? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
									: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}"
							on:click={() => selectedMarketplace = mp.id}
						>
							<span class="text-xl">{mp.icon}</span>
							<span class="font-medium">{mp.name}</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- SKU Input -->
			<div>
				<label for="sku" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					{$i18n.t('Product SKU')}
				</label>
				<input
					type="text"
					id="sku"
					bind:value={sku}
					placeholder={$i18n.t('Enter SKU or article number')}
					class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
				/>
			</div>

			<!-- Generate Button -->
			<button
				type="button"
				on:click={startGeneration}
				disabled={generating || !sku.trim()}
				class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors"
			>
				{#if generating}
					<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					{$i18n.t('Generating...')}
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
					</svg>
					{$i18n.t('Generate Content')}
				{/if}
			</button>
		</div>
	</div>

	<!-- Info Section -->
	<div class="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
			{$i18n.t('How it works')}
		</h3>
		<ul class="space-y-2 text-gray-600 dark:text-gray-400">
			<li class="flex items-start gap-2">
				<span class="text-purple-500 mt-1">1.</span>
				<span>{$i18n.t('Enter the product SKU and select marketplace')}</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-purple-500 mt-1">2.</span>
				<span>{$i18n.t('AI generates optimized title, description and SEO tags')}</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-purple-500 mt-1">3.</span>
				<span>{$i18n.t('Review and edit the draft')}</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-purple-500 mt-1">4.</span>
				<span>{$i18n.t('Publish directly to the marketplace')}</span>
			</li>
		</ul>
	</div>
</div>
