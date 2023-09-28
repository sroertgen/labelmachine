<script>
	import { labels } from '$lib/store';
	import Plus from './icons/plus.svelte';

	/**
	 * @typedef {Object} Label
	 * @property {string} selectedType
	 * @property {string} topics
	 * @property {string} pubkey
	 * @property {string} labelNamespace
	 * @property {string} label
	 * @property {function} addLabel
	 */

	/** @type {Label} */
	export let label;
</script>

<div class="flex flex-col items-center">
	<select bind:value={label.selectedType} class="select select-bordered w-full max-w-xs mb-1">
		<option disabled selected>What info to add?</option>
		<option>Topic</option>
		<option>Pubkey</option>
		<option>Custom Label</option>
	</select>
	{#if label.selectedType === 'Topic'}
		<input
			value={label.topics}
			on:input={(e) => {
				labels.updateLabel('topics', label.id, e.target.value);
			}}
			type="text"
			placeholder="Add comma separated topics"
			class="input input-bordered w-full max-w-xs"
		/>
	{:else if label.selectedType === 'Pubkey'}
		<input
			value={label.pubkey}
			on:input={(e) => {
				labels.updateLabel('pubkey', label.id, e.target.value);
			}}
			type="text"
			placeholder="Add a pubkey for the event"
			class="input input-bordered w-full max-w-xs"
		/>
	{:else if label.selectedType === 'Custom Label'}
		<input
			value={label.labelNamespace}
			on:input={(e) => {
				labels.updateLabel('labelNamespace', label.id, e.target.value);
			}}
			type="text"
			placeholder="Add a namespace"
			class="input input-bordered w-full max-w-xs"
		/>
		<input
			value={label.label}
			on:input={(e) => {
				labels.updateLabel('label', label.id, e.target.value);
			}}
			type="text"
			placeholder="Add a label"
			class="input input-bordered w-full max-w-xs"
		/>
	{/if}
	<button
		on:click={() => labels.addLabel()}
		class="mx-auto my-2 btn btn-circle bg-green-400 hover:bg-green-400 text-black"><Plus /></button
	>
</div>
