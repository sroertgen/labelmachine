<script>
	import toast from 'svelte-french-toast';
	import { labels, thingToLabel, searchInput, assignedLabels } from '$lib/store';
	import { user } from '$lib/user';
	import Check from '$lib/icons/check.svelte';

	let publishing = false;
	let published = false;
	$: publishEnabled = $labels.length > 1 && Boolean($user.pk);
</script>

<div class="gap-4 mt-2 flex md:flex-row flex-col justify-center">
	<div
		class="tooltip"
		data-tip={publishEnabled ? null : 'Login, add an event and do some labeling!'}
	>
		<button
			on:click={async () => {
				if (!publishEnabled) {
					toast.error('Please login first');
				} else {
					publishing = true;
					const publishedEvents = await labels.publishEvents();
					$assignedLabels = [...$assignedLabels, ...publishedEvents];
					publishing = false;
					published = true;
				}
			}}
			class="btn bg-green-400 hover:bg-green-400 text-black"
		>
			{#if publishing}
				<span class="loading loading-spinner" />
			{:else if published}
				<Check />
			{/if}
			Publish!
		</button>
	</div>
	<button
		disabled={!Object.keys($thingToLabel).length}
		onclick="my_modal_2.showModal()"
		class="btn btn-warning text-black">Add Custom Labels</button
	>
	<button
		on:click={(e) => {
			e.preventDefault();
			published = false;
			publishing = false;
			labels.reset();
			searchInput.set('');
			thingToLabel.set({});
		}}
		class="btn bg-red-400 hover:bg-red-400 text-black md:mt-0 mt-6">Start over!</button
	>
</div>
