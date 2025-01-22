import { setFlash } from '$lib/stores/flash.svelte';
import { user } from '$lib/stores/user.svelte';
import { getUserDetails } from './user.js';

const ENDPOINT = "http://localhost:3000/auth";

export async function login(email, password) {
  try {
    const response = await fetch(`${ENDPOINT}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setFlash({title: 'Erro', message: errorData.message, type: 'error'});
      return;
    }

    const data = await response.json();
    const token = data.token;

    setFlash({title: 'Sucesso', message: 'Successful login!', type: 'success'});

    const userResponse = await getUserDetails(data.id);
    user.set(userResponse);
    return token;
  } catch (error) {
    console.error('Error when logging in:', error);
    setFlash({title: 'Erro', message: 'Error when logging in', type: 'error'});
  }
};