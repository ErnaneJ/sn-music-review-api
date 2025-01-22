<script>
  import { query } from "$lib/stores/search.svelte";
  import { user } from "$lib/stores/user.svelte";
  import { reviews } from "$lib/stores/reviews.svelte";
  import { token } from "$lib/stores/auth.svelte";
  import { setFlash } from "$lib/stores/flash.svelte";
  import { getLastReviews } from "$lib/api/reviews";
  import { createComment } from "$lib/api/comment";

  import { addLike, removeLike } from "$lib/api/likes";

  export let selectedReview;

  let content;

  async function handleLike(add, reviewId){
    if(add){
      await removeLike($token, reviewId);
    } else {
      await addLike($token, reviewId);
    }

    reviews.set(await getLastReviews());

    selectedReview = null;
    selectedReview = $reviews.find(r => r.id === selectedReview);
  }

  async function handleComment(){
    await createComment($token, content, selectedReview.id, null);
    reviews.set(await getLastReviews());

    selectedReview = null;
    selectedReview = $reviews.find(r => r.id === selectedReview);
  }
</script>


{#if selectedReview}
  <section class="fixed flex  items-center justify-center top-0 left-0 right-0 bottom-0 bg-black/30 z-50 p-6" >
    <div class="relative overflow-hidden w-full p-4 mt-1/2 bg-gray-50 shadow-md rounded-xl">
      <button on:click={() => selectedReview = null} class="absolute -end-1 -top-1 rounded-full border border-gray-300 bg-gray-100 p-1">
        <span class="sr-only">Close</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div class="grid grid-cols-8">
        <article class="relative border-r-2 border-gray-300 col-span-2 min-h-full">
          <div class="flex flex-col items-start gap-4 p-4 sm:p-6 lg:p-8">
            <a href="#" class="block shrink-0">
              <img
                alt=""
                src="{selectedReview.song.cover_image || `https://placehold.co/56x56/F3F4F6/666666/png?text=${selectedReview.song.title[0]}`}"
                class="size-36 rounded-lg object-cover"
              />
            </a>
        
            <div>
              <h3 class="font-medium sm:text-lg hover:underline">
                {selectedReview.song.title}
              </h3>
              <span class="text-xs text-gray-500 block -mt-1">
                {selectedReview.song.artist}
              </span>
            </div>
          </div>
        </article>

        <div class="col-span-6 relative h-[90vh]">
          <article class="relative ml-2 px-4 py-2 border-gray-200 w-full">
            <div class="flex items-start gap-4">
              <a href="#" class="block shrink-0">
                <img
                  alt=""
                  src="{selectedReview.user.image || `https://placehold.co/96x96/F3F4F6/666666/png?text=${selectedReview.user.email[0]}`}"
                  class="size-14 rounded-lg object-cover"
                />
              </a>
          
              <div>
                <h3 class="font-medium sm:text-lg hover:underline">
                  {selectedReview.user.name || selectedReview.user.email.split('@')[0]}
                </h3>
                <span class="text-xs text-gray-500 block -mt-1">
                  {new Date(selectedReview.createdAt).toLocaleString()}
                </span>
          
                <i class="line-clamp-2 text-sm text-gray-700 mt-2">
                  {@html selectedReview.content}
                </i>
  
                <div class="mt-2 sm:flex sm:items-center sm:gap-2">
                  <div class="flex items-center gap-1 text-gray-500">
                    {#if selectedReview.likes.find(l => l.userId === $user?.id)}
                      <i class="fa-solid fa-heart cursor-pointer" on:click={() => {handleLike(true, selectedReview.id)}}></i>
                    {:else}
                      <i class="fa-regular fa-heart cursor-pointer" on:click={() => {handleLike(false, selectedReview.id)}}></i>
                    {/if}
          
                    <a href="/" class="text-xs">{selectedReview.likes.length} Likes</a>
                  </div>
  
                  <span class="hidden sm:block" aria-hidden="true">&middot;</span>
  
                  <div class="flex items-center gap-1 text-gray-500">
                    {#if selectedReview.rating >= 4}
                      <i class="fa-solid fa-star"></i>
                    {:else if selectedReview.rating >= 2 && selectedReview.rating < 4}
                      <i class="fa-solid fa-star-half-stroke"></i>
                    {:else if selectedReview.rating < 2}
                      <i class="fa-regular fa-star"></i>
                    {/if}
          
                    <a href="/" class="text-xs">{selectedReview.rating}/5</a>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div class="h-[80vh] overflow-auto pb-80">
            {#each selectedReview.comments as comment}
              <article class="relative px-4 py-2 border-l-2 border-gray-200 w-full ml-12">
                <div class="flex items-start gap-4">
                  <a href="#" class="block shrink-0">
                    <img
                      alt=""
                      src="{comment.user.image || `https://placehold.co/96x96/F3F4F6/666666/png?text=${comment.user.email[0]}`}"
                      class="size-10 rounded-lg object-cover"
                    />
                  </a>
              
                  <div>
                    <h3 class="font-medium sm:text-lg hover:underline">
                      {comment.user.name || comment.user.email.split('@')[0]}
                    </h3>
                    <span class="text-xs text-gray-500 block">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
              
                    <i class="line-clamp-2 text-sm text-black mt-2">
                      {comment.content}
                    </i>
                  </div>
                </div>
              </article>
            {/each}
          </div>
      
          <form on:submit={handleComment} class="flex bg-gray-50 items-center justify-center gap-2 w-full absolute -bottom-4 left-0 right-0 p-4">
            <div class="w-full">
              <label class="sr-only" for="content">Review</label>
    
              <input
                class="w-full rounded-lg border-gray-200 p-2 text-sm mt-2"
                placeholder="what do you think?"
                type="text"
                id="content"
                bind:value={content}
              />
            </div>
    
            <div>
              <button
                type="submit"
                class="inline-block w-full rounded-lg bg-blue-700 px-4 py-2 font-medium text-white sm:w-auto"
              >
                <i class="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
{/if}