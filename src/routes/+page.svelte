<script>
	import Search from '$lib/Search.svelte';
	import Preview from '$lib/Preview.svelte';
	import Modal from '$lib/Modal.svelte';
	import ModalLogin from '$lib/ModalLogin.svelte';
	import Avatar from '$lib/Avatar.svelte';
	import Check from '$lib/icons/check.svelte';
	import { labels, event, searchInput, assignedLabels } from '$lib/store';
	import { user } from '$lib/user';

	let publishing = false;
	let published = false;

	$: publishEnabled = $labels[0].selectedType !== 'What info to add?' && Boolean($user.pk);
</script>

<div class="flex flex-col mx-auto w-full md:max-w-[640px]">
	<div class="flex flex-row justify-between items-center mt-2 mx-2">
		<h1 class="text-3xl font-bold text-purple-500 italic">LabelMachine</h1>
		{#if !$user.pk}
			<button
				onclick="login_modal.showModal()"
				class="btn bg-purple-500 hover:bg-purple-500 text-black">Login</button
			>
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
				class="tooltip"
				data-tip={publishEnabled ? null : 'Login, add an event and do some labeling!'}
			>
				<button
					disabled={!publishEnabled}
					on:click={async () => {
						publishing = true;
						const publishedEvents = await labels.publishEvents();
						$assignedLabels = [...$assignedLabels, ...publishedEvents];
						publishing = false;
						published = true;
					}}
					class="btn bg-green-400 hover:bg-green-400 text-black w-full md:w-fit"
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
	<div class="mt-12 text-center flex flex-col md:flex-row items-center justify-between gap-6">
		<p>
			Made with 💜 by <a
				class="underline"
				href="https://coracle.social/npub1r30l8j4vmppvq8w23umcyvd3vct4zmfpfkn4c7h2h057rmlfcrmq9xt9ma"
				>laoc42</a
			>
		</p>
		<button
			data-npub="npub1r30l8j4vmppvq8w23umcyvd3vct4zmfpfkn4c7h2h057rmlfcrmq9xt9ma"
			data-relays="wss://relay.damus.io,wss://relay.snort.social,wss://nostr.wine,wss://relay.nostr.band"
			class=" h-fit transition-all rounded-md bg-indigo-600/80 py-1 px-3 text-white hover:bg-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-400 ring-1 ring-inset ring-indigo-400/40 dark:hover:bg-indigo-400/20 dark:hover:text-indigo-300 hover:ring-indigo-300 border-0 no-underline"
			>⚡ Zap LabelMachine</button
		>
	</div>
</div>
