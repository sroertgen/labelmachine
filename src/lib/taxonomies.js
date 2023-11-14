import { writable } from "svelte/store";

export const taxonomies = createTaxonomies()

function createTaxonomies() {
  const { subscribe, set, update } = writable([])
  return {
    set,
    subscribe,
    update,
  }
}

export const selectedTaxonomy = writable({})
