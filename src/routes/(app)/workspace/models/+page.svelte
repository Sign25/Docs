<script>
	import { onMount, getContext } from 'svelte';
	import { config, models, settings, user } from '$lib/stores';
	import { getModels } from '$lib/apis';
	import Models from '$lib/components/workspace/Models.svelte';

	const i18n = getContext('i18n');

	onMount(async () => {
		await Promise.all([
			(async () => {
				models.set(
					await getModels(
						localStorage.token,
						$config?.features?.enable_direct_connections && ($settings?.directConnections ?? null)
					)
				);
			})()
		]);
	});
</script>

{#if $user?.role === 'admin'}
	{#if $models !== null}
		<Models />
	{/if}
{:else}
	<div class="flex flex-col items-center justify-center h-full">
		<div class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
			{$i18n.t('Access Denied')}
		</div>
		<div class="text-sm text-gray-500 dark:text-gray-400">
			{$i18n.t('Only administrators can access this page')}
		</div>
	</div>
{/if}
