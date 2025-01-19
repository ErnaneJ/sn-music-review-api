import { writable } from 'svelte/store';

export function getLocalStorageWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}

export function setLocalStorageWithExpiry(key, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function isLocalStorageAvailable() {
  try {
    const testKey = '__svelte_localstorage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function createPersistentStore(key, initialValue) {
  const storedValue = isLocalStorageAvailable()
    ? getLocalStorageWithExpiry(key)
    : null;
  const initial = storedValue || initialValue;

  const store = writable(initial);
  store.subscribe((value) => {
    if (isLocalStorageAvailable()) {
      setLocalStorageWithExpiry(key, value, 300000);
    }
  });
  return store;
}