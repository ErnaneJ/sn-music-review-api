import { createPersistentStore } from '../utils/localstorage.js';

export const token = createPersistentStore('token', null);