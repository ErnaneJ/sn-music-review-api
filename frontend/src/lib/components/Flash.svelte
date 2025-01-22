<script>
  import {fly} from 'svelte/transition';
  import { writable } from 'svelte/store';
  import { flash } from '$lib/stores/flash.svelte';

  function closeFlash(){
    clearTimeout($flash.timeout);
    flash.set(null);
  }

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
  };
</script>

{#if $flash}
  <div class="fixed top-2 translate-x-1/2 right-1/2 rounded-lg border border-gray-200 shadow-lg z-50 bg-white" transition:fly={{ y: -10, duration: 200 }}>
    <button on:click={closeFlash} class="absolute -end-1 -top-1 rounded-full border border-gray-300 bg-gray-100 p-1">
      <span class="sr-only">Close</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div class="flex items-center gap-4 p-4">
      {#if $flash.image}
        <img
          alt=""
          src="{$flash.image}"
          class="size-12 rounded-lg object-cover"
        />
      {:else}
        <div class="size-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <span>{icons[$flash.type] || '🎯'}</span>
        </div>
      {/if}

      <div>
        <p class="font-medium text-gray-900">{$flash.title}</p>

        <p class="line-clamp-1 text-sm text-gray-500">
          {$flash.message}
        </p>
      </div>
    </div>
  </div>
{/if}