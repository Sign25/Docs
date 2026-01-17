<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { showSidebar } from '$lib/stores';
	
	// Icons
	import Plus from '$lib/components/icons/Plus.svelte';
	import GarbageBin from '$lib/components/icons/GarbageBin.svelte';
	import ArrowUpTray from '$lib/components/icons/ArrowUpTray.svelte';
	import Note from '$lib/components/icons/Note.svelte';
	
	// Components 
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import ConfirmDialog from '$lib/components/common/ConfirmDialog.svelte';

	const i18n = getContext('i18n');

	let files = [];
	let uploading = false;
	let fileInput;
	let dragActive = false;
	let loaded = false;

	let showDeleteConfirm = false;
	let deleteFileObj = null;

	// Функция загрузки файла
	async function uploadFile(file) {
		const formData = new FormData();
		formData.append('file', file);

		try {
			const res = await fetch('/api/v1/files/', {
				method: 'POST',
				body: formData
			});

			if (res.ok) {
				const result = await res.json();
				toast.success('Файл загружен успешно');
				await loadFiles();
				return result;
			} else {
				const error = await res.json();
				toast.error(`Ошибка загрузки: ${error.detail || 'Неизвестная ошибка'}`);
			}
		} catch (e) {
			toast.error(`Ошибка: ${e.message}`);
		}
	}

	// Обработчик выбора файлов
	async function handleFileSelect(event) {
		const selectedFiles = Array.from(event.target.files || []);
		if (selectedFiles.length === 0) return;

		uploading = true;

		for (const file of selectedFiles) {
			await uploadFile(file);
		}

		uploading = false;
		fileInput.value = '';
	}

	// Drag & Drop handlers
	function handleDragOver(e) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragLeave(e) {
		e.preventDefault();
		dragActive = false;
	}

	async function handleDrop(e) {
		e.preventDefault();
		dragActive = false;
		
		const droppedFiles = Array.from(e.dataTransfer.files || []);
		if (droppedFiles.length === 0) return;

		uploading = true;

		for (const file of droppedFiles) {
			await uploadFile(file);
		}

		uploading = false;
	}

	// Загрузка списка файлов
	async function loadFiles() {
		try {
			const res = await fetch('/api/v1/files/');
			if (res.ok) {
				files = await res.json();
			}
		} catch (e) {
			console.error('Ошибка загрузки файлов:', e);
		}
	}

	// Удаление файла
	async function deleteFile(file) {
		deleteFileObj = file;
		showDeleteConfirm = true;
	}

	async function confirmDelete() {
		if (!deleteFileObj) return;

		try {
			const res = await fetch(`/api/v1/files/${deleteFileObj.id}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				toast.success('Файл удален');
				await loadFiles();
			} else {
				toast.error('Не удалось удалить файл');
			}
		} catch (e) {
			toast.error(`Ошибка: ${e.message}`);
		}

		deleteFileObj = null;
	}

	// Форматирование размера файла
	function formatFileSize(bytes) {
		if (!bytes) return '';
		const k = 1024;
		const dm = 2;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	// Получение иконки файла по типу
	function getFileIcon(filename) {
		if (!filename) return '📄';
		const ext = filename.split('.').pop()?.toLowerCase();
		const iconMap = {
			'pdf': '📕',
			'doc': '📘', 'docx': '📘',
			'xls': '📗', 'xlsx': '📗',
			'ppt': '📙', 'pptx': '📙',
			'txt': '📄', 'md': '📄',
			'zip': '🗜️', 'rar': '🗜️', '7z': '🗜️',
			'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️', 'bmp': '🖼️', 'svg': '🖼️',
			'mp4': '🎬', 'avi': '🎬', 'mov': '🎬', 'wmv': '🎬', 'flv': '🎬',
			'mp3': '🎵', 'wav': '🎵', 'flac': '🎵', 'aac': '🎵',
			'html': '🌐', 'css': '🎨', 'js': '⚡', 'json': '📋',
			'py': '🐍', 'java': '☕', 'cpp': '⚙️', 'c': '⚙️'
		};
		return iconMap[ext] || '📄';
	}

	onMount(async () => {
		await loadFiles();
		loaded = true;
	});
</script>

<svelte:head>
	<title>
		Файлы
	</title>
</svelte:head>

{#if loaded}
	<div class="w-full h-screen max-h-[100dvh]">
		<ConfirmDialog
			bind:show={showDeleteConfirm}
			on:confirm={confirmDelete}
		>
			<div class="text-sm text-gray-500">
				{$i18n?.t?.('Are you sure?') || 'Вы уверены?'}
			</div>
		</ConfirmDialog>

		<div class="w-full h-full flex flex-col overflow-x-hidden transition-all duration-300 {$showSidebar 
			? 'md:max-w-[calc(100%-var(--sidebar-width))] md:ml-[var(--sidebar-width)]' 
			: ''}">
			
			<div class="flex flex-col gap-1 px-5 pt-4 pb-3">
				<div class="flex justify-between items-center">
					<div class="flex items-center md:self-center text-xl font-medium px-0.5 gap-2 shrink-0">
						<div>Файлы</div>
						<div class="text-lg font-medium text-gray-500 dark:text-gray-500">
							{files.length}
						</div>
					</div>

					<div class="flex w-full justify-end gap-1.5">
						<input
							bind:this={fileInput}
							type="file"
							multiple
							on:change={handleFileSelect}
							class="hidden"
							id="file-upload"
						/>
						<Tooltip content="Загрузить файлы">
							<label
								for="file-upload"
								class="px-2 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black transition font-medium text-sm flex items-center cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200"
								class:opacity-50={uploading}
								class:cursor-not-allowed={uploading}
							>
								<Plus className="size-3" strokeWidth="2.5" />
								<div class="hidden md:block md:ml-1 text-xs">
									{uploading ? 'Загрузка...' : 'Новый файл'}
								</div>
							</label>
						</Tooltip>
					</div>
				</div>
			</div>

			<div class="flex-1 overflow-auto px-5">
				<div class="py-2 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100/30 dark:border-gray-850/30">
					<!-- Drag & Drop Zone -->
					<div 
						class="mx-3 mb-4 p-8 border-2 border-dashed rounded-2xl transition-colors
							{dragActive 
								? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
								: 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
							}"
						on:dragover={handleDragOver}
						on:dragleave={handleDragLeave}
						on:drop={handleDrop}
						on:click={() => fileInput?.click()}
						role="button"
						tabindex="0"
					>
						<div class="text-center">
							<div class="flex justify-center mb-2">
								{#if uploading}
									<div class="animate-spin text-4xl">⏳</div>
								{:else}
									<ArrowUpTray className="size-12" strokeWidth="1" />
								{/if}
							</div>
							<div class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
								{uploading ? 'Загрузка файлов...' : 'Перетащите файлы или нажмите для выбора'}
							</div>
							<div class="text-sm text-gray-500 dark:text-gray-400">
								Поддерживаются документы, изображения и другие файлы
							</div>
						</div>
					</div>

					<!-- Files List -->
					{#if files.length === 0 && !uploading}
						<div class="text-center text-gray-500 dark:text-gray-400 py-12 px-3">
							<div class="mb-4 opacity-50 flex justify-center">
								<Note className="size-16" strokeWidth="1" />
							</div>
							<p class="text-lg font-medium mb-2">Нет загруженных файлов</p>
							<p class="text-sm">Загрузите файлы чтобы использовать их в чатах и базах знаний</p>
						</div>
					{:else if files.length > 0}
						<div class="px-3">
							<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
								{#each files as file}
									<div class="group relative bg-gray-50 dark:bg-gray-850 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200/50 dark:border-gray-700/50">
										<div class="flex items-start gap-3">
											<!-- File Icon -->
											<div class="text-2xl flex-shrink-0 mt-1">
												{getFileIcon(file.filename)}
											</div>
											
											<!-- File Info -->
											<div class="flex-1 min-w-0">
												<div class="font-medium text-gray-900 dark:text-gray-100 truncate text-sm mb-1">
													{file.filename || file.meta?.name || 'Неизвестный файл'}
												</div>
												
												<div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
													{#if file.meta?.size}
														<span>{formatFileSize(file.meta.size)}</span>
													{/if}
													
													{#if file.created_at}
														<span>•</span>
														<span>{new Date(file.created_at * 1000).toLocaleDateString('ru-RU')}</span>
													{/if}
												</div>
											</div>

											<!-- Actions -->
											<div class="opacity-0 group-hover:opacity-100 transition-opacity">
												<Tooltip content="Удалить">
													<button
														on:click={() => deleteFile(file)}
														class="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
													>
														<GarbageBin className="size-4 text-red-600 dark:text-red-400" />
													</button>
												</Tooltip>
											</div>
										</div>
										
										<!-- File Type Badge -->
										{#if file.meta?.content_type}
											<div class="absolute top-2 right-2 opacity-60">
												<div class="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
													{file.meta.content_type.split('/')[0]}
												</div>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
