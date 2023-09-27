<script>
	import { searchInput, event, labels } from '$lib/store';
	import { ndkStore } from '$lib/ndk';
	import Labels from './Labels.svelte';
	import { nip19 } from 'nostr-tools';

	let userProfile;

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

<div class="border-white border-2 border-solid rounded min-h-[64px]">
	{#if Object.keys($event).length}
		<div class="p-2">
			{#key $labels.length}
				<Labels />
			{/key}
			<a target="_blank" href="https://snort.social/p/{event.pubkey}">
				<img class="w-16 h-16 m-2 rounded-full" src={userProfile?.image} />
			</a>
			<p class="whitespace-pre-wrap break-words">{$event.content}</p>
		</div>
	{:else}
		<p class="m-24 text-center">Enter an event id, note id or nevent</p>
	{/if}
</div>
