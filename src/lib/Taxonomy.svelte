<script>
	import { taxonomies } from './taxonomies';

	let selectedConcept = {};
	$: console.log(selectedConcept);
	$: console.log($taxonomies);

	//TODO parents var
	let parents = [];
	$: console.log(parents);

	function publishLabel() {
		console.log('publish');
	}
</script>

{#if $taxonomies.length}
	{#if Object.keys(selectedConcept).length && selectedConcept.narrower}
		<div>
			<button
				class="btn btn-sm"
				on:click={() => {
					if (parents.length === 1) {
						selectedConcept = {};
						parents = [];
					} else {
						selectedConcept = parents.pop();
					}
				}}>Back</button
			>
			<span>{[...parents.map((p) => p.prefLabel.en)]}</span>
		</div>
		{#each selectedConcept.narrower as concept}
			<button
				on:click={() => parents.push(concept)}
				on:click={() => {
					if (concept.narrower) {
						selectedConcept = concept;
					} else {
						publishLabel();
					}
				}}
				class="btn btn-sm w-full">{concept.prefLabel.en}</button
			>
		{/each}
	{:else}
		{#each $taxonomies[0].hasTopConcept as topConcept}
			<button
				on:click={() => (parents = [...parents, topConcept])}
				on:click={() => (selectedConcept = topConcept)}
				class="btn btn-sm w-full">{topConcept.prefLabel.en}</button
			>
		{/each}
	{/if}
{/if}
