<script>
	import MagnifyingGlass from './icons/magnifying-glass.svelte';
	import { searchInput } from '$lib/store';
</script>

<div class="join flex justify-center my-2">
	<input
		bind:value={$searchInput}
		class="input input-bordered join-item w-full"
		placeholder="Enter event id, note id or nevent"
	/>
	<button class="btn join-item rounded-r-lg bg-purple-500 w-fit hover:bg-purple-500"
		><MagnifyingGlass /></button
	>
</div>
