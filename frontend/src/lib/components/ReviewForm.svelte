<script>
  import { token } from "$lib/stores/auth.svelte";
  import { createReview } from "$lib/api/reviews";
  import {reviews} from "$lib/stores/reviews.svelte";
  import { getLastReviews } from "$lib/api/reviews";
  import { query } from "$lib/stores/search.svelte";
  export let selectedMusic;

  let content= "", rating = 0;

  async function handleSubmit(){
    if (content === "" || rating === 0) return;

    await createReview($token, selectedMusic, rating, content);

    selectedMusic = null;

    reviews.set(await getLastReviews());
    query.set("");
  }
</script>

{#if selectedMusic}
  <section class="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-black/30 z-50 p-6" on:submit={handleSubmit}>
    <div class="relative px-4 py-16 sm:px-6 lg:px-8 mt-1/2 bg-gray-100 shadow-md rounded-xl">
      <button on:click={() => selectedMusic = null} class="absolute -end-1 -top-1 rounded-full border border-gray-300 bg-gray-100 p-1">
        <span class="sr-only">Close</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <div class="grid lg:grid-cols-5">
        <div class="lg:col-span-2 lg:py-12">
          <img
            alt=""
            src="{selectedMusic.album.cover_big}"
            class="h-96 w-96 object-cover rounded-md shadow-md"
          />
        </div>

        <div class="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12 -ml-4">
          <form action="#" class="space-y-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Review for {selectedMusic.title}</h2>
              <span class="text-sm text-gray-500">by {selectedMusic.artist.name}</span>
            </div>

            <div>
              <label class="sr-only" for="content">Review</label>

              <textarea
                class="w-full rounded-lg border-gray-200 p-3 text-sm"
                placeholder="{selectedMusic.title} is..."
                rows="8"
                id="content"
                bind:value={content}
              ></textarea>
            </div>

            <div>
              <label class="sr-only" for="name">Name</label>
              <input
                class="w-full rounded-lg border-gray-200 p-3 text-sm"
                placeholder="From 0 to 5 {selectedMusic.title} is worth a..."
                type="number"
                id="rating"
                min="0"
                max="5"
                step="1"
                bind:value={rating}
              />
            </div>

            <div class="mt-4">
              <button
                type="submit"
                class="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
{/if}