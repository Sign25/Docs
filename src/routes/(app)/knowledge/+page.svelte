<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { user, showSidebar, mobile } from '$lib/stores';
	import { canAccessModule } from '$lib/utils/roles';
	import { WEBUI_BASE_URL } from '$lib/constants';

	const i18n = getContext('i18n');

	// Section state
	let activeSection: 'search' | 'catalog' | 'upload' | 'moderation' | 'stats' = 'search';

	// Search state
	let searchQuery = '';
	let searchResults: any[] = [];
	let isSearching = false;

	// Catalog state
	let categories = [
		{ id: 'policy', name: 'Политики', icon: '📋', count: 12 },
		{ id: 'guide', name: 'Руководства', icon: '📚', count: 8 },
		{ id: 'faq', name: 'FAQ', icon: '❓', count: 24 },
		{ id: 'process', name: 'Процессы', icon: '⚙️', count: 15 },
		{ id: 'template', name: 'Шаблоны', icon: '📄', count: 6 },
		{ id: 'other', name: 'Прочее', icon: '📁', count: 3 }
	];

	// Upload state
	let uploadFiles: File[] = [];
	let uploadCategory = 'other';
	let isUploading = false;

	// Moderation state
	let pendingDocuments = [
		{ id: 1, title: 'Новая политика возвратов', category: 'policy', author: 'Иван П.', date: '2024-01-15' },
		{ id: 2, title: 'Руководство по WB API', category: 'guide', author: 'Мария С.', date: '2024-01-14' },
		{ id: 3, title: 'FAQ по доставке', category: 'faq', author: 'Алексей К.', date: '2024-01-13' }
	];

	// Stats
	let stats = {
		totalDocuments: 68,
		totalCategories: 6,
		pendingModeration: 3,
		lastUpdated: '15.01.2024'
	};

	// Role check for moderation
	$: canModerate = canAccessModule($user?.role, 'knowledge_moderation');

	// Search handler
	async function handleSearch() {
		if (!searchQuery.trim()) return;
		isSearching = true;
		// TODO: Implement actual search via API
		await new Promise(resolve => setTimeout(resolve, 500));
		searchResults = [
			{ id: 1, title: 'Политика работы с возвратами', category: 'policy', relevance: 0.95 },
			{ id: 2, title: 'FAQ: Как оформить возврат', category: 'faq', relevance: 0.87 },
			{ id: 3, title: 'Процесс обработки возвратов', category: 'process', relevance: 0.82 }
		];
		isSearching = false;
	}

	// Upload handler
	async function handleUpload() {
		if (uploadFiles.length === 0) return;
		isUploading = true;
		// TODO: Implement actual upload via API
		await new Promise(resolve => setTimeout(resolve, 1000));
		isUploading = false;
		uploadFiles = [];
	}

	// File drop handler
	function handleFileDrop(event: DragEvent) {
		event.preventDefault();
		const files = event.dataTransfer?.files;
		if (files) {
			uploadFiles = [...uploadFiles, ...Array.from(files)];
		}
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			uploadFiles = [...uploadFiles, ...Array.from(input.files)];
		}
	}

	function removeFile(index: number) {
		uploadFiles = uploadFiles.filter((_, i) => i !== index);
	}
</script>

<svelte:head>
	<title>База знаний | ADOLF</title>
</svelte:head>

<div class="h-screen max-h-[100dvh] w-full flex flex-col overflow-x-hidden overflow-y-auto transition-all duration-300 {$showSidebar ? 'md:max-w-[calc(100%-var(--sidebar-width))] md:ml-[var(--sidebar-width)]' : ''}">
	<!-- Header -->
	<div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
		<div class="flex items-center gap-2 sm:gap-3">
			{#if $mobile}
				<button
					class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
					on:click={() => showSidebar.set(!$showSidebar)}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			{/if}
			<img
				src="{WEBUI_BASE_URL}/static/knowledge-icon.svg?v=1.1.48"
				class="size-7 sm:size-8 dark:invert"
				alt=""
			/>
			<h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">База знаний</h1>
		</div>
		<div class="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
			<span>{stats.totalDocuments} документов</span>
			<span class="text-gray-300 dark:text-gray-600">|</span>
			<span>Обновлено: {stats.lastUpdated}</span>
		</div>
	</div>

	<!-- Navigation Tabs -->
	<div class="flex items-center justify-center gap-2 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto">
		<button
			class="module-tab px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap {activeSection === 'search' ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}"
			on:click={() => activeSection = 'search'}
		>
			🔍 Поиск
		</button>
		<button
			class="module-tab px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap {activeSection === 'catalog' ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}"
			on:click={() => activeSection = 'catalog'}
		>
			📂 Каталог
		</button>
		<button
			class="module-tab px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap {activeSection === 'upload' ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}"
			on:click={() => activeSection = 'upload'}
		>
			📤 Загрузка
		</button>
		{#if canModerate}
			<button
				class="module-tab px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap {activeSection === 'moderation' ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}"
				on:click={() => activeSection = 'moderation'}
			>
				⏳ Модерация
				{#if stats.pendingModeration > 0}
					<span class="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">{stats.pendingModeration}</span>
				{/if}
			</button>
		{/if}
		<button
			class="module-tab px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap {activeSection === 'stats' ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}"
			on:click={() => activeSection = 'stats'}
		>
			📊 Статистика
		</button>
	</div>

	<!-- Main Content -->
	<div class="flex-1 overflow-y-auto p-6">
		<!-- Search Section -->
		{#if activeSection === 'search'}
			<div class="max-w-3xl mx-auto">
				<div class="kb-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Поиск по базе знаний</h2>
					<div class="flex gap-3">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Введите запрос для поиска..."
							class="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							on:keypress={(e) => e.key === 'Enter' && handleSearch()}
						/>
						<button
							class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
							on:click={handleSearch}
							disabled={isSearching || !searchQuery.trim()}
						>
							{isSearching ? 'Поиск...' : 'Найти'}
						</button>
					</div>

					{#if searchResults.length > 0}
						<div class="mt-6 space-y-3">
							<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Результаты поиска:</h3>
							{#each searchResults as result}
								<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
									<div class="flex items-center justify-between">
										<div>
											<h4 class="font-medium text-gray-900 dark:text-white">{result.title}</h4>
											<span class="text-sm text-gray-500 dark:text-gray-400">{result.category}</span>
										</div>
										<span class="text-sm text-green-600 dark:text-green-400">{Math.round(result.relevance * 100)}%</span>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Catalog Section -->
		{#if activeSection === 'catalog'}
			<div class="max-w-4xl mx-auto">
				<div class="kb-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Категории документов</h2>
					<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
						{#each categories as category}
							<button class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left">
								<div class="text-2xl mb-2">{category.icon}</div>
								<h3 class="font-medium text-gray-900 dark:text-white">{category.name}</h3>
								<span class="text-sm text-gray-500 dark:text-gray-400">{category.count} документов</span>
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Upload Section -->
		{#if activeSection === 'upload'}
			<div class="max-w-2xl mx-auto">
				<div class="kb-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Загрузка документов</h2>

					<!-- Drop zone -->
					<div
						class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition cursor-pointer"
						on:drop={handleFileDrop}
						on:dragover|preventDefault
						on:click={() => document.getElementById('file-input')?.click()}
						role="button"
						tabindex="0"
					>
						<input
							id="file-input"
							type="file"
							multiple
							class="hidden"
							on:change={handleFileSelect}
							accept=".pdf,.doc,.docx,.txt,.md"
						/>
						<div class="text-4xl mb-3">📥</div>
						<p class="text-gray-600 dark:text-gray-300 font-medium">Перетащите файлы сюда</p>
						<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">или нажмите для выбора</p>
						<p class="text-xs text-gray-400 dark:text-gray-500 mt-2">PDF, DOC, DOCX, TXT, MD</p>
					</div>

					<!-- File list -->
					{#if uploadFiles.length > 0}
						<div class="mt-4 space-y-2">
							{#each uploadFiles as file, index}
								<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
									<div class="flex items-center gap-3">
										<span class="text-lg">📄</span>
										<span class="text-sm text-gray-700 dark:text-gray-200">{file.name}</span>
										<span class="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
									</div>
									<button
										class="text-red-500 hover:text-red-700 transition"
										on:click={() => removeFile(index)}
									>
										✕
									</button>
								</div>
							{/each}
						</div>

						<!-- Category selection -->
						<div class="mt-4">
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Категория</label>
							<select
								bind:value={uploadCategory}
								class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								{#each categories as category}
									<option value={category.id}>{category.name}</option>
								{/each}
							</select>
						</div>

						<!-- Upload button -->
						<button
							class="mt-4 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
							on:click={handleUpload}
							disabled={isUploading}
						>
							{isUploading ? 'Загрузка...' : `Загрузить ${uploadFiles.length} файл(ов)`}
						</button>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Moderation Section -->
		{#if activeSection === 'moderation' && canModerate}
			<div class="max-w-4xl mx-auto">
				<div class="kb-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Ожидают модерации</h2>
						<span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
							{pendingDocuments.length} документов
						</span>
					</div>

					<div class="space-y-3">
						{#each pendingDocuments as doc}
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div class="flex items-center justify-between">
									<div>
										<h4 class="font-medium text-gray-900 dark:text-white">{doc.title}</h4>
										<div class="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
											<span>{doc.category}</span>
											<span>•</span>
											<span>{doc.author}</span>
											<span>•</span>
											<span>{doc.date}</span>
										</div>
									</div>
									<div class="flex gap-2">
										<button class="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
											✓ Одобрить
										</button>
										<button class="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
											✕ Отклонить
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Stats Section -->
		{#if activeSection === 'stats'}
			<div class="max-w-4xl mx-auto">
				<div class="kb-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<h2 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Статистика базы знаний</h2>

					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
							<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalDocuments}</div>
							<div class="text-sm text-gray-600 dark:text-gray-300 mt-1">Всего документов</div>
						</div>
						<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
							<div class="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalCategories}</div>
							<div class="text-sm text-gray-600 dark:text-gray-300 mt-1">Категорий</div>
						</div>
						<div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
							<div class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingModeration}</div>
							<div class="text-sm text-gray-600 dark:text-gray-300 mt-1">На модерации</div>
						</div>
						<div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
							<div class="text-3xl font-bold text-purple-600 dark:text-purple-400">24</div>
							<div class="text-sm text-gray-600 dark:text-gray-300 mt-1">Запросов сегодня</div>
						</div>
					</div>

					<div class="mt-6">
						<h3 class="text-md font-medium mb-3 text-gray-800 dark:text-gray-200">Документов по категориям</h3>
						<div class="space-y-2">
							{#each categories as category}
								<div class="flex items-center gap-3">
									<span class="w-6">{category.icon}</span>
									<span class="flex-1 text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
									<div class="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
										<div
											class="h-full bg-blue-500 rounded-full"
											style="width: {(category.count / stats.totalDocuments) * 100}%"
										></div>
									</div>
									<span class="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">{category.count}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.module-tab {
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.kb-card {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
</style>
