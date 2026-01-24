<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		if ($user?.role === 'admin') {
			// Admins can access models
			goto('/workspace/models');
		} else {
			// Non-admins: skip models, go to other workspace sections
			if ($user?.permissions?.workspace?.knowledge) {
				goto('/workspace/knowledge');
			} else if ($user?.permissions?.workspace?.prompts) {
				goto('/workspace/prompts');
			} else if ($user?.permissions?.workspace?.tools) {
				goto('/workspace/tools');
			} else {
				goto('/');
			}
		}
	});
</script>
