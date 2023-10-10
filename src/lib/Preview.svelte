<script>
	import { searchInput, event, labels, assignedLabels } from '$lib/store';
	import { ndkStore } from '$lib/ndk';
	import Labels from './Labels.svelte';
	import { nip19 } from 'nostr-tools';
	import AssignedLabels from './AssignedLabels.svelte';

	let userProfile;
	let existingLabels = [];

	async function getAssignedLabels(eventId) {
		console.log('getting labels', eventId);
		const filter = { kinds: [1985], limit: 200, '#e': [eventId] };
		const labels = await $ndkStore.fetchEvents(filter);
		console.log(labels);
		assignedLabels.set([...labels]);
	}

	async function getEvent(input) {
		if (input.length > 3) {
			// parse input to hexcode
			let noteId;
			try {
				const { type, data } = nip19.decode(input);
				if (type === 'note') {
					noteId = data;
				} else if (type === 'nevent') {
					noteId = data.id;
				}
			} catch (e) {
				// id is probably hex
				noteId = input;
			}
			const filter = { ids: [noteId] };
			$event = await $ndkStore.fetchEvent(filter);

			// TODO labels in store speichern und nach publish event neu fetchen
			getAssignedLabels($event.id);
		}
	}
	async function getUserProfile(pubkey) {
		const user = await $ndkStore.getUser({ hexpubkey: pubkey });
		const profile = await user.fetchProfile();
		return profile;
	}

	$: (async () => await getEvent($searchInput))();
	$: (async () => {
		if (Object.keys($event).length) {
			userProfile = await getUserProfile($event.pubkey);
		}
	})();
</script>

<div class="border-white border-2 border-solid rounded h-64 overflow-auto">
	{#if Object.keys($event).length}
		<div class="p-2">
			{#key $labels.length}
				<Labels />
			{/key}
			{#key $assignedLabels.length}
				<AssignedLabels labels={$assignedLabels} />
			{/key}
			<a target="_blank" href="https://snort.social/p/{event.pubkey}">
				<img class="w-16 h-16 m-2 rounded-full" src={userProfile?.image} />
			</a>
			<p class="whitespace-pre-wrap break-words">{$event.content}</p>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center h-full">
			<p class="">Login & Enter an event id, note id or nevent</p>
			<p class="">Then do some labeling and publish!</p>
		</div>
		<p />{/if}
</div>
