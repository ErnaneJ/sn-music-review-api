<script>
  import { token } from '$lib/stores/auth.svelte';
  import { onMount } from 'svelte';
  import SideBar from '$lib/components/SideBar.svelte';
  import Flash from '$lib/components/Flash.svelte';
  import { setFlash } from '$lib/stores/flash.svelte';
  import Announcement from '$lib/components/Announcement.svelte';
    import Feed from '$lib/components/Feed.svelte';

  onMount(() => {
    if ($token === null) {
      window.location.href = '/login';
    }else{
      setFlash({
        title: 'Welcome 👋🏼',
        message: 'Welcome back to the SoundFlow',
        type: 'success'
      })
    }
  });
</script>

{#if $token}
  <main class="flex items-start justify-center flex-grow pl-16">
    <SideBar />
    <section class="relative flex-1">
      <Feed/>
    </section>
  </main>
{/if}