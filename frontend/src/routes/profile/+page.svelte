<script>
  import { user } from '$lib/stores/user.svelte';
  import { token } from '$lib/stores/auth.svelte';
  import SideBar from '$lib/components/SideBar.svelte';
  import { updateUser } from '$lib/api/user';

  let password = $state('');
  let name = $state($user?.name || $user?.email.split('@')[0]);
  let base64Image = $state($user?.image || `https://placehold.co/96x96/F3F4F6/666666/png?text=${$user?.email[0]}`);
  
  async function handleInputImage(event) {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = () => {
        base64Image = reader.result;
      };

      reader.onerror = () => {
        console.error('Erro ao ler o arquivo.');
      };

      reader.readAsDataURL(file);
    } else {
      console.error('Por favor, selecione um arquivo de imagem válido.');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    console.log($user);
    user.set({
      ...(await updateUser($user.id, name, $user.email, password, base64Image, $token))
    });
  }
</script>

{#if $token}
  <main class="flex items-start justify-center flex-grow pl-16">
    <SideBar />

    <section class="bg-white flex items-center justify-center h-screen w-1/2">
      <div class="max-w-xl lg:max-w-3xl flex items-center justify-center flex-col w-full">
        <label class="block text-blue-600 cursor-pointer" for="profile-image" >
          <img
            alt=""
            src="{base64Image}"
            class="size-36 rounded-full object-cover"
          />
          <input 
            on:change={handleInputImage} 
            type="file" class="hidden" id="profile-image" name="profile-image"
            accept="image/*"
          />
        </label>

        <h1 class="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          {name}
        </h1>
        <span class="text-md text-gray-500 block">
          {$user?.email}
        </span>

        <form class="mt-8 grid grid-cols-6 gap-6 w-full" on:submit={handleSubmit}>
          <div class="col-span-6">
            <label for="name" class="block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              bind:value={name}
              class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div class="col-span-6">
            <label for="Password" class="block text-sm font-medium text-gray-700"> Password </label>

            <input
              type="password"
              id="Password"
              name="password"
              bind:value={password}
              class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div class="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button
              class="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </section>
  </main>
{/if}