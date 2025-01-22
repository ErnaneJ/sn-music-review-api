<script>
	import Flash from '$lib/components/Flash.svelte';
	import '$lib/styles/app.css';
	let { children } = $props();
</script>

<Flash/>
{@render children()}
