<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { showSidebar, user } from '$lib/stores';

	// Icons
	import Plus from '$lib/components/icons/Plus.svelte';
	import GarbageBin from '$lib/components/icons/GarbageBin.svelte';
	import ArrowUpTray from '$lib/components/icons/ArrowUpTray.svelte';
	import Note from '$lib/components/icons/Note.svelte';
	import ChevronUp from '$lib/components/icons/ChevronUp.svelte';
	import ChevronDown from '$lib/components/icons/ChevronDown.svelte';

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

	let users = {};

	// Сортировка
	let sortField = 'created_at';
	let sortDirection = 'desc';

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

	// Загрузка информации о пользователях
	async function loadUsers() {
		try {
			const res = await fetch('/api/v1/users/');
			if (res.ok) {
				const data = await res.json();
				const usersArray = data.users || data;
				users = usersArray.reduce((acc, u) => {
					acc[u.id] = u;
					return acc;
				}, {});
			}
		} catch (e) {
			console.error('Ошибка загрузки пользователей:', e);
		}
	}

	// Загрузка списка файлов
	async function loadFiles() {
		try {
			// Если админ - загрузить пользователей сначала
			if ($user?.role === 'admin') {
				await loadUsers();
			}

			const res = await fetch('/api/v1/files/');
			if (res.ok) {
				files = await res.json();
			}
		} catch (e) {
			console.error('Ошибка загрузки файлов:', e);
		}
	}

	// Получить имя пользователя по ID
	function getUserName(userId) {
		const u = users[userId];
		if (!u) return '—';
		return u.name || u.email || '—';
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
		if (!bytes) return '—';
		const k = 1024;
		const dm = 1;
		const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	// Получение расширения файла
	function getFileExt(filename) {
		if (!filename) return '';
		const parts = filename.split('.');
		return parts.length > 1 ? parts.pop().toUpperCase() : '';
	}

	// Сортировка
	function handleSort(field) {
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'asc';
		}
	}

	$: sortedFiles = [...files].sort((a, b) => {
		let valA, valB;

		switch (sortField) {
			case 'filename':
				valA = (a.filename || a.meta?.name || '').toLowerCase();
				valB = (b.filename || b.meta?.name || '').toLowerCase();
				break;
			case 'size':
				valA = a.meta?.size || 0;
				valB = b.meta?.size || 0;
				break;
			case 'created_at':
				valA = a.created_at || 0;
				valB = b.created_at || 0;
				break;
			case 'user':
				valA = getUserName(a.user_id).toLowerCase();
				valB = getUserName(b.user_id).toLowerCase();
				break;
			default:
				valA = 0;
				valB = 0;
		}

		if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
		if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
		return 0;
	});

	onMount(async () => {
		await loadFiles();
		loaded = true;
	});
</script>

<svelte:head>
	<title>Файлы</title>
</svelte:head>

{#if loaded}
	<div class="w-full h-screen max-h-[100dvh]">
		<ConfirmDialog
			bind:show={showDeleteConfirm}
			on:confirm={confirmDelete}
		>
			<div class="text-sm text-gray-500">
				Удалить файл "{deleteFileObj?.filename || 'файл'}"?
			</div>
		</ConfirmDialog>

		<div class="w-full h-full flex flex-col overflow-x-hidden transition-all duration-300 {$showSidebar
			? 'md:max-w-[calc(100%-var(--sidebar-width))] md:ml-[var(--sidebar-width)]'
			: ''}">

			<!-- Header -->
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
								class="px-3 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black transition font-medium text-sm flex items-center cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200"
								class:opacity-50={uploading}
								class:cursor-not-allowed={uploading}
							>
								<Plus className="size-4" strokeWidth="2.5" />
								<span class="ml-2">
									{uploading ? 'Загрузка...' : 'Загрузить'}
								</span>
							</label>
						</Tooltip>
					</div>
				</div>
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-auto px-5 pb-5">
				<!-- Drag & Drop Zone (compact) -->
				<div
					class="mb-4 p-4 border-2 border-dashed rounded-xl transition-colors cursor-pointer
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
					<div class="flex items-center justify-center gap-3">
						{#if uploading}
							<div class="animate-spin text-xl">⏳</div>
							<span class="text-gray-600 dark:text-gray-300">Загрузка...</span>
						{:else}
							<ArrowUpTray className="size-5 text-gray-500" strokeWidth="1.5" />
							<span class="text-gray-600 dark:text-gray-300">Перетащите файлы сюда или нажмите для выбора</span>
						{/if}
					</div>
				</div>

				<!-- Files Table -->
				{#if files.length === 0 && !uploading}
					<div class="text-center text-gray-500 dark:text-gray-400 py-16">
						<div class="mb-4 opacity-50 flex justify-center">
							<Note className="size-16" strokeWidth="1" />
						</div>
						<p class="text-lg font-medium mb-2">Нет загруженных файлов</p>
						<p class="text-sm">Загрузите файлы чтобы использовать их в чатах</p>
					</div>
				{:else if files.length > 0}
					<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
						<table class="w-full">
							<thead>
								<tr class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
									<th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300 text-sm">
										<button
											class="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
											on:click={() => handleSort('filename')}
										>
											Название
											{#if sortField === 'filename'}
												{#if sortDirection === 'asc'}
													<ChevronUp className="size-4" />
												{:else}
													<ChevronDown className="size-4" />
												{/if}
											{/if}
										</button>
									</th>
									<th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300 text-sm w-24">
										Тип
									</th>
									<th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300 text-sm w-28">
										<button
											class="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
											on:click={() => handleSort('size')}
										>
											Размер
											{#if sortField === 'size'}
												{#if sortDirection === 'asc'}
													<ChevronUp className="size-4" />
												{:else}
													<ChevronDown className="size-4" />
												{/if}
											{/if}
										</button>
									</th>
									<th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300 text-sm w-32">
										<button
											class="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
											on:click={() => handleSort('created_at')}
										>
											Дата
											{#if sortField === 'created_at'}
												{#if sortDirection === 'asc'}
													<ChevronUp className="size-4" />
												{:else}
													<ChevronDown className="size-4" />
												{/if}
											{/if}
										</button>
									</th>
									{#if $user?.role === 'admin'}
										<th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300 text-sm w-40">
											<button
												class="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
												on:click={() => handleSort('user')}
											>
												Пользователь
												{#if sortField === 'user'}
													{#if sortDirection === 'asc'}
														<ChevronUp className="size-4" />
													{:else}
														<ChevronDown className="size-4" />
													{/if}
												{/if}
											</button>
										</th>
									{/if}
									<th class="w-16"></th>
								</tr>
							</thead>
							<tbody>
								{#each sortedFiles as file, idx}
									<tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors {idx === sortedFiles.length - 1 ? 'border-b-0' : ''}">
										<td class="py-3 px-4">
											<div class="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs" title={file.filename}>
												{file.filename || file.meta?.name || 'Неизвестный файл'}
											</div>
										</td>
										<td class="py-3 px-4">
											<span class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
												{getFileExt(file.filename) || '—'}
											</span>
										</td>
										<td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
											{formatFileSize(file.meta?.size)}
										</td>
										<td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
											{#if file.created_at}
												{new Date(file.created_at * 1000).toLocaleDateString('ru-RU')}
											{:else}
												—
											{/if}
										</td>
										{#if $user?.role === 'admin'}
											<td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
												{getUserName(file.user_id)}
											</td>
										{/if}
										<td class="py-3 px-4 text-right">
											<Tooltip content="Удалить">
												<button
													on:click={() => deleteFile(file)}
													class="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
												>
													<GarbageBin className="size-4 text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
												</button>
											</Tooltip>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
