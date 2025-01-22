<script>
	import Announcement from '$lib/components/Announcement.svelte';
	import Flash from '$lib/components/Flash.svelte';
	import '$lib/styles/app.css';
	let { children } = $props();
</script>

<Flash/>
{@render children()}
