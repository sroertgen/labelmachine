<script>
	import { selectedTaxonomy, loadTaxonomies } from '$lib/taxonomies';

	let selected;

	$: selectedTaxonomy.set(selected);
</script>

{#await loadTaxonomies() then taxonomies}
	<select bind:value={selected} class="mr-2 select select-bordered w-full">
		<option disabled>Choose a taxonomy!</option>
		{#each taxonomies as taxonomy, i}
			<option class="truncate" value={taxonomy} selected={i === 0}
				>{taxonomy.title.en ?? 'No title in en found'}</option
			>{/each}
	</select>
{/await}
