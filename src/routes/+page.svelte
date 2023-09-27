<script>
	import Search from '$lib/Search.svelte';
	import Preview from '$lib/Preview.svelte';
	import Modal from '$lib/Modal.svelte';
	import ModalLogin from '$lib/ModalLogin.svelte';
	import { labels, event } from '$lib/store';
	import { user } from '$lib/user';
</script>

<div class="flex flex-col items-center">
	<div class="flex flex-row justify-between items-center w-full md:w-1/2">
		<h1 class="text-3xl font-bold text-purple-500 italic">Label Machine</h1>
		{#if !$user.pk}
			<button onclick="login_modal.showModal()" class="btn bg-purple-500 text-black">Login</button>
		{:else}
			<img class="w-10 h-10 m-2 rounded-full" src={$user.profile.image} />
		{/if}
	</div>
	<div class="md:w-1/2 w-full">
		<Search />
		<Preview />
		<Modal />
		<ModalLogin />
		<div class="m-2 flex flex-row justify-center">
			<button
				onclick="my_modal_2.showModal()"
				class="btn bg-green-400 hover:bg-green-400 text-black">Add Labels!</button
			>
			<button
				disabled={$labels[0].selectedType === 'What info to add?'}
				on:click={() => labels.publishEvents()}
				class="btn bg-green-400 hover:bg-green-400 text-black">Publish labels!</button
			>
		</div>
	</div>
</div>
