<script>
  import { user } from '$lib/stores/user.svelte';
  import SideBar from '$lib/components/SideBar.svelte';
  import { onMount } from 'svelte';
  import { getUserDetails } from '$lib/api/user';

  let { data } = $props();
  let userDetails = $state(null);
  
  onMount(async () => {
    userDetails = await getUserDetails(data.userId);
  });
</script>

{#if userDetails !== null}
  <main class="flex items-start justify-center flex-grow pl-16">
    <SideBar />

    <section class="bg-white flex items-center justify-center h-screen">
      <div class="max-w-xl lg:max-w-3xl flex items-center justify-center flex-col w-full">
        <div class="block text-blue-600 cursor-pointer" >
          <img
            alt=""
            src="{userDetails.image}"
            class="size-36 rounded-full object-cover"
          />
        </div>

        <h1 class="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          {userDetails.name}
        </h1>
        <span class="text-md text-gray-500 block">
          {userDetails.email}
        </span>

        <div class="mx-auto w-full">
          <ul class="mt-8 grid gap-4 m-auto">
            {#each userDetails.reviews as review}
              <li>
                <article class="relative rounded-xl border-2 border-gray-100 bg-white">
                  <div class="flex items-start gap-4 p-4 sm:p-6 lg:p-8">
                    <a href="#" class="block shrink-0">
                      <img
                        alt=""
                        src="{review.song?.cover_image || `https://placehold.co/56x56/F3F4F6/666666/png?text=${review.song?.title[0]}`}"
                        class="size-14 rounded-lg object-cover"
                      />
                    </a>
                
                    <div>
                      <h3 class="font-medium sm:text-lg hover:underline" on:click={() => {query.set(review.song?.title); window.scrollTo({top: 0, behavior: 'smooth'})}}>
                        {review.song?.title}
                      </h3>
                      <span class="text-xs text-gray-500 block -mt-1">
                        {review.song?.artist}
                      </span>
                
                      <i class="line-clamp-2 text-sm text-gray-700 mt-2">
                        {@html review.content}
                      </i>
      
                      <div class="mt-2 sm:flex sm:items-center sm:gap-2">
                        <div class="flex items-center gap-1 text-gray-500">
                          {#if false}
                            <i class="fa-solid fa-heart cursor-pointer"></i>
                          {:else}
                            <i class="fa-regular fa-heart cursor-pointer"></i>
                          {/if}
                
                          <a href="/" class="text-xs">{review.likes?.length} Likes</a>
                        </div>
      
                        <span class="hidden sm:block" aria-hidden="true">&middot;</span>
      
                        <div class="flex items-center gap-1 text-gray-500">
                          {#if review.rating >= 4}
                            <i class="fa-solid fa-star"></i>
                          {:else if review.rating >= 2 && review.rating < 4}
                            <i class="fa-solid fa-star-half-stroke"></i>
                          {:else if review.rating < 2}
                            <i class="fa-regular fa-star"></i>
                          {/if}
                
                          <a href="/" class="text-xs">{review.rating}/5</a>
                        </div>
      
                        <span class="hidden sm:block" aria-hidden="true">&middot;</span>
      
      
                        <div class="flex items-center gap-1 text-gray-500">
                          <i class="fa-regular fa-comments"></i>
                
                          <a href="/" class="text-xs hover:underline">{review.comments?.length} comments</a>
                        </div>
                
                        <span class="hidden sm:block" aria-hidden="true">&middot;</span>
                
                        <p class="flex items-center gap-1 text-xs text-gray-500">
                          <span>by</span>
                          <button class="font-medium overflow-hidden w-80 underline hover:text-gray-700 text-ellipsis truncate text-left"> </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            {/each}
          </ul>
        </div>

      </div>
    </section>
  </main>
{/if}