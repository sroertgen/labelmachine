import { writable } from "svelte/store";

const taxoUrls = [
  {
    url: "https://sroertgen.github.io/LabelTaxonomies/labelmachine.org/ontolo.social/index.json",
    preferredNamespaceUri: "social.ontolo.categories"
  },
  {
    url: "https://skohub.io/dini-ag-kim/hochschulfaechersystematik/heads/master/w3id.org/kim/hochschulfaechersystematik/scheme.json"
  }
]

export async function loadTaxonomies() {
  const taxos = Promise.all(taxoUrls.map(async (t) => {
    const resp = await fetch(t.url)
    const taxonomy = await resp.json()
    // TODO 
    return { ...taxonomy, preferredNamespaceUri: t.preferredNamespaceUri }
  }))
  return taxos
}

// TODO maybe don't need this?
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
