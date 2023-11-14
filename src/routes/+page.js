import { taxonomies } from "$lib/taxonomies";


/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const resp = await fetch("https://sroertgen.github.io/LabelTaxonomies/labelmachine.org/ontolo.social/index.json")
  const taxonomy = await resp.json()
  taxonomies.set([taxonomy])
  return {
    taxonomy
  };
}
