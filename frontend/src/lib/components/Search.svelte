<script>
  import { fly, fade } from "svelte/transition";
  import { deezerSearch } from "$lib/api/deezer";
  import { query } from "$lib/stores/search.svelte";
  import ReviewForm from "./ReviewForm.svelte";

  let timeout;
  let tracks = $state([]);
  let selectedMusic = $state(null);

  query.subscribe(value => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      if(value === "") return tracks = [];
      
      tracks = [];
      tracks = await deezerSearch(value);
    }, 300);
  });
</script>

<ReviewForm bind:selectedMusic={selectedMusic}/>

<section class="relative w-1/2 mx-auto rounded-b-xl border-b mt-4">
  <div class="relative">
    <label for="Search" class="sr-only"> Search </label>
  
    <input
      type="text"
      id="Search"
      bind:value={$query}
      placeholder="Add a review to.."
      class="w-full mx-auto rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
    />
  
    <span class="absolute inset-y-0 end-0 grid w-10 place-content-center">
      <button type="button" class="text-gray-600 hover:text-gray-700">
        <span class="sr-only">Search</span>
  
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </span>
  
  </div>
 
  {#if tracks.length !== 0 && selectedMusic === null}
    <div class="bg-white rounded-md border-gray-200 fixed w-[46.5%] mx-auto top-16 rigt-1/2 z-10 border p-4 shadow" transition:fade>
      {#if tracks.length > 0}
        <ul class="flex flex-col h-[700px] overflow-y-auto pr-4">
          {#each tracks as track}
            <article class="rounded-xl bg-white p-4 border border-gray-200 sm:p-6 lg:p-8 mb-4">
              <div class="flex items-start sm:gap-8">
                <div
                  class="hidden sm:grid sm:shrink-0 sm:place-content-center rounded-md border-2 border-gray-200 "
                  aria-hidden="true"
                >
                  <div class="flex items-center gap-1">
                    <img
                      src={track.album.cover_big}
                      alt={track.album.title}
                      class="w-24 h-24 rounded-md object-cover"/>
                  </div>
                </div>
            
                <div>
                  <button on:click={() => selectedMusic = track} class="text-lg text-left font-medium sm:text-xl cursor-pointer hover:underline">
                    {track.title}
                  </button>
                  <strong
                    class="text-[10px] block -mt-0.5 italic font-normal text-gray-500"
                  >
                    {track.album.title}
                  </strong>
            
                  <div class="mt-10 sm:flex sm:items-center sm:gap-2">
                    <div class="flex items-center gap-1 text-gray-500">
                      <svg
                        class="size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
            
                      <p class="text-xs font-medium">{track.duration} minutes</p>
                    </div>
            
                    <span class="hidden sm:block" aria-hidden="true">&middot;</span>
            
                    <p class="mt-2 text-xs font-medium text-gray-500 sm:mt-0">
                      {track.artist.name}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</section>