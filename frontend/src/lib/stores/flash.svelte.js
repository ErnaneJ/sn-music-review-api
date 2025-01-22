import { writable } from 'svelte/store';

export const flash = writable(null);

export const setFlash = (data, duration=5000) => {
  flash.set({ 
    title: data.title, 
    message: data.message, 
    type: data.type, 
    image: data.image,
    timeout: setTimeout(() => {
      flash.set(null);
    }, duration)
  });
};