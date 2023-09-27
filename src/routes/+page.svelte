<script>
	import Search from '$lib/Search.svelte';
	import Preview from '$lib/Preview.svelte';
	import Modal from '$lib/Modal.svelte';
	import ModalLogin from '$lib/ModalLogin.svelte';
	import Check from '$lib/icons/check.svelte';
	import { labels, event } from '$lib/store';
	import { user } from '$lib/user';

	let publishing = false;
	let published = false;
</script>

<div class="flex flex-col mx-auto w-full md:w-2/3">
	<div class="flex flex-row justify-between items-center">
		<h1 class="text-3xl font-bold text-purple-500 italic">Label Machine</h1>
		{#if !$user.pk}
			<button onclick="login_modal.showModal()" class="btn bg-purple-500 text-black">Login</button>
		{:else}
			<img
				class="w-10 h-10 m-2 rounded-full border-purple-500 border"
				src={$user.profile.image || `https://robohash.org/${$user.npub}.png`}
			/>
		{/if}
	</div>
	<div>
		<Search />
		<Preview />
		<Modal />
		<ModalLogin />
		<div class="gap-4 mt-2 flex flex-row justify-center">
			<button
				disabled={!$event.id}
				onclick="my_modal_2.showModal()"
				class="btn bg-green-400 hover:bg-green-400 text-black">Add Labels!</button
			>
			<button
				disabled={$labels[0].selectedType === 'What info to add?' || !$user.pk}
				on:click={async () => {
					publishing = true;
					await labels.publishEvents();
					publishing = false;
					published = true;
				}}
				class="btn bg-green-400 hover:bg-green-400 text-black"
			>
				{#if publishing}
					<span class="loading loading-spinner" />
				{:else if published}
					<Check />
				{/if}
				Publish labels!
			</button>
		</div>
	</div>
</div>
