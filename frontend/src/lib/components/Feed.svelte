<script>
  import { onMount } from "svelte";
  import { deezerSearch } from "$lib/api/deezer";
  import Search from "./Search.svelte";
  import { getLastReviews } from "$lib/api/reviews";
  import { user } from "$lib/stores/user.svelte";
  import { query } from "$lib/stores/search.svelte";
  import { addLike, removeLike } from "$lib/api/likes";
  import { token } from "$lib/stores/auth.svelte";
  import { reviews } from "$lib/stores/reviews.svelte";
  import { deleteReview } from "$lib/api/reviews";
  import { setFlash } from "$lib/stores/flash.svelte";
  import Comments from "./Comments.svelte";

  let selectedReview = $state(null);

  onMount(async () => {
    reviews.set(await getLastReviews());
  });

  async function handleLike(add, reviewId){
    if(add){
      await removeLike($token, reviewId);
    } else {
      await addLike($token, reviewId);
    }

    reviews.set(await getLastReviews());
  }

  async function handleDelete(reviewId){
    await deleteReview($token, reviewId);
    reviews.set(await getLastReviews());
    setFlash("Success!", "Review deleted successfully", "success");
  }
</script>

<section>
  <Search/>
  
  <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <header>
      <h2 class="text-xl font-bold text-gray-900 sm:text-3xl text-center">Last Reviews</h2>
    </header>

    <ul class="mt-8 grid gap-4 w-2/3 m-auto">
      {#each $reviews as review}
        <li>
          <article class="relative rounded-xl border-2 border-gray-100 bg-white">
            <div class="absolute top-2 end-0 z-10 group">
              <button class="h-full p-2 px-6">
                <span class="sr-only">Menu</span>
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
            
              <div
                class="absolute group-hover:block hover:block hidden end-0 z-10 w-36 rounded-md border border-gray-100 bg-white shadow-lg"
                role="menu"
              >
                <div class="p-2">
                  <a
                    href="#"
                    class="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    role="menuitem"
                  >
                  <i class="fa-solid fa-pen-to-square"></i>
                    Edit
                  </a>
            
                    <button
                      on:click={() => handleDelete(review.id)}
                      type="submit"
                      class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      role="menuitem"
                    >
                    <i class="fa-solid fa-trash-can"></i>
            
                      Delete
                    </button>
                </div>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 sm:p-6 lg:p-8">
              <a href="#" class="block shrink-0">
                <img
                  alt=""
                  src="{review.song.cover_image || `https://placehold.co/56x56/F3F4F6/666666/png?text=${review.song.title[0]}`}"
                  class="size-14 rounded-lg object-cover"
                />
              </a>
          
              <div>
                <h3 class="font-medium sm:text-lg hover:underline" on:click={() => {query.set(review.song.title); window.scrollTo({top: 0, behavior: 'smooth'})}}>
                  {review.song.title}
                </h3>
                <span class="text-xs text-gray-500 block -mt-1">
                  {review.song.artist}
                </span>
          
                <i class="line-clamp-2 text-sm text-gray-700 mt-2">
                  {@html review.content}
                </i>

                <div class="mt-2 sm:flex sm:items-center sm:gap-2">
                  <div class="flex items-center gap-1 text-gray-500">
                    {#if review.likes.find(l => l.userId === $user?.id)}
                      <i class="fa-solid fa-heart cursor-pointer" on:click={() => {handleLike(true, review.id)}}></i>
                    {:else}
                      <i class="fa-regular fa-heart cursor-pointer" on:click={() => {handleLike(false, review.id)}}></i>
                    {/if}
          
                    <a href="/" class="text-xs">{review.likes.length} Likes</a>
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


                  <div class="flex items-center gap-1 text-gray-500" on:click={() => selectedReview = review}>
                    <i class="fa-regular fa-comments"></i>
          
                    <a href="/" class="text-xs hover:underline">{review.comments.length} comments</a>
                  </div>
          
                  <span class="hidden sm:block" aria-hidden="true">&middot;</span>
          
                  <p class="flex items-center gap-1 text-xs text-gray-500">
                    <span>by</span>
                    <!-- <img
                      alt=""
                      src="{review.user.image || `https://placehold.co/56x56/F3F4F6/666666/png?text=${review.user.email[0]}`}"
                      class="size-5 rounded-lg object-cover"
                    />  -->
                    <button class="font-medium overflow-hidden w-80 underline hover:text-gray-700 text-ellipsis truncate text-left"> {review.user.name || review.user.email.split('@')[0]} </button>
                  </p>
                </div>
              </div>
            </div>
          </article>
        </li>
      {/each}
    </ul>
  </div>
</section>

<Comments bind:selectedReview={selectedReview}/>