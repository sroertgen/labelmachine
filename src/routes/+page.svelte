<script>
	import { Toaster } from 'svelte-french-toast';
	import Search from '$lib/Search.svelte';
	import Preview from '$lib/Preview.svelte';
	import Modal from '$lib/Modal.svelte';
	import ModalLogin from '$lib/ModalLogin.svelte';
	import Header from '$lib/Header.svelte';
	import Taxonomy from '$lib/Taxonomy.svelte';
	import LabelActions from '$lib/LabelActions.svelte';
	import { user } from '$lib/user';
	import { ndkStore } from '$lib/ndk';
	import { events } from '$lib/events';

	async function loadEvents() {
		const filter = {
			kinds: [1],
			limit: 100,
			since: Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)
		};
		// If we're in follows mode, add authors filter
		if ($user.pk && $user.followers.size > 0) {
			filter.authors = Array.from($user.followers).map((f) => f._hexpubkey);
		} else {
		}

		// Fetch events
		const eventSet = await $ndkStore.fetchEvents(filter);

		// Filter out reposts and quotes
		$events = [...eventSet]
			.filter((e) => !e.tags.map((t) => t[0]).includes('e'))
			.filter((e) => !e.tags.map((t) => t[0]).includes('q'));
	}
</script>

<Toaster />

{#key $user.pk}
	{#await loadEvents()}{/await}
{/key}
<div class="flex flex-col mx-auto w-full md:max-w-[640px]">
	<Header />
	<div class="mx-2 w-full">
		<Search />
		<div class="sm:flex sm:flex-row h-full">
			<div class="hidden sm:flex sm:flex-col sm:w-2/3 h-64">
				<Preview />
				<LabelActions />
			</div>
			<div class="sm:hidden h-64">
				<Preview />
			</div>
			<div class="sm:w-1/3">
				<Taxonomy />
			</div>
			<div class="sm:hidden h-64">
				<LabelActions />
			</div>
		</div>
		<Modal />
		<ModalLogin />
	</div>
	<div class="sm:mt-12 text-center flex flex-col md:flex-row items-center justify-between gap-6">
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
