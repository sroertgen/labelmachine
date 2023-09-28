<script>
	import Search from '$lib/Search.svelte';
	import Preview from '$lib/Preview.svelte';
	import Modal from '$lib/Modal.svelte';
	import ModalLogin from '$lib/ModalLogin.svelte';
	import Avatar from '$lib/Avatar.svelte';
	import Check from '$lib/icons/check.svelte';
	import { labels, event, searchInput } from '$lib/store';
	import { user } from '$lib/user';

	let publishing = false;
	let published = false;

	$: publishEnabled = $labels[0].selectedType !== 'What info to add?' && Boolean($user.pk);
</script>

<div class="flex flex-col mx-auto w-full md:w-2/3">
	<div class="flex flex-row justify-between items-center mt-2 mx-2">
		<h1 class="text-3xl font-bold text-purple-500 italic">Label Machine</h1>
		{#if !$user.pk}
			<button onclick="login_modal.showModal()" class="btn bg-purple-500 text-black">Login</button>
		{:else}
			<Avatar />
		{/if}
	</div>
	<div class="mx-2">
		<Search />
		<Preview />
		<Modal />
		<ModalLogin />
		<div class="gap-4 mt-2 flex md:flex-row flex-col justify-center">
			<button
				disabled={!$event.id}
				onclick="my_modal_2.showModal()"
				class="btn bg-green-400 hover:bg-green-400 text-black">Add Labels!</button
			>
			<div
				class="tooltip w-full"
				data-tip={publishEnabled ? null : 'Login, add an event and do some labeling!'}
			>
				<button
					disabled={!publishEnabled}
					on:click={async () => {
						publishing = true;
						await labels.publishEvents();
						publishing = false;
						published = true;
					}}
					class="btn bg-green-400 hover:bg-green-400 text-black w-full"
				>
					{#if publishing}
						<span class="loading loading-spinner" />
					{:else if published}
						<Check />
					{/if}
					Publish labels!
				</button>
			</div>
			<button
				on:click={(e) => {
					e.preventDefault();
					published = false;
					publishing = false;
					labels.reset();
					searchInput.set('');
					event.set({});
				}}
				class="btn bg-red-400 hover:bg-red-400 text-black md:mt-0 mt-6">Start over!</button
			>
		</div>
	</div>
</div>
