<script>
  import { token } from '$lib/stores/auth.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    if ($token === null) {
      window.location.href = '/login';
    }
  });
</script>