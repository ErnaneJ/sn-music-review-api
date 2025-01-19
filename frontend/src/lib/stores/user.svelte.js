import { createPersistentStore } from '../utils/localstorage.js';

export const user = createPersistentStore('user', null);