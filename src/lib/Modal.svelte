<script>
	import AddLabel from './AddLabel.svelte';
	import { labels } from '$lib/store.js';
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog id="my_modal_2" class="modal">
	<div class="modal-box">
		{#each $labels as label (label.id)}
			<AddLabel {label} />
		{/each}
		<form class="flex flex-row justify-between" method="dialog">
			<button
				on:click={(e) => {
					e.preventDefault();
					labels.reset();
				}}
				class="btn bg-red-400 hover:bg-red-400 text-black">Start over!</button
			>
			<button class="btn bg-green-400 hover:bg-green-400 text-black">I labeled it!</button>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
