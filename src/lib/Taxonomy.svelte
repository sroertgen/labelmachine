<script>
	import { taxonomies, selectedTaxonomy } from './taxonomies';
	import { labels } from '$lib/store';

	let selectedConcept = {};

	let parents = [];

	function addLabel(label) {
		const newLabel = labels.addLabel();
		if ($selectedTaxonomy?.preferredNamespaceUri) {
			labels.updateLabel('labelNamespace', newLabel.id, $selectedTaxonomy.preferredNamespaceUri);
			labels.updateLabel('label', newLabel.id, label);
		} else {
			labels.updateLabel('topics', newLabel.id, label);
		}
	}
</script>

{#if typeof $selectedTaxonomy !== 'undefined' && Object.keys($selectedTaxonomy).length}
	{#if Object.keys(selectedConcept).length}
		<div>
			<button
				class="btn btn-sm btn-accent m-1"
				on:click={() => {
					if (parents.length === 1) {
						selectedConcept = {};
						parents = [];
					} else {
						parents.pop();
						parents = parents;
						selectedConcept = parents[parents.length - 1];
					}
				}}>Back</button
			>
			{#each parents as parent}
				<span class="badge badge-primary h-max mx-1 text-center">{parent.prefLabel.en}</span>
			{/each}
		</div>
		{#each selectedConcept.narrower as concept}
			<button
				on:click={() => {
					if (concept?.narrower) parents = [...parents, concept];
				}}
				on:click={() => {
					if (concept?.narrower) {
						selectedConcept = concept;
					} else {
						addLabel(concept.prefLabel.en);
					}
				}}
				class="btn btn-sm w-full btn-primary m-1 h-max">{concept.prefLabel.en}</button
			>
		{/each}
	{:else}
		{#each $selectedTaxonomy.hasTopConcept as topConcept}
			{#if !topConcept.narrower}
				<button
					on:click={() => publishLabel(topConcept.prefLabel.en)}
					class="btn btn-sm w-full btn-primary m-1 h-max">{topConcept.prefLabel.en}</button
				>
			{:else}
				<button
					on:click={() => (parents = [...parents, topConcept])}
					on:click={() => (selectedConcept = topConcept)}
					class="btn btn-sm btn-primary w-full m-1 h-max">{topConcept.prefLabel.en}</button
				>
			{/if}
		{/each}
	{/if}
{/if}
