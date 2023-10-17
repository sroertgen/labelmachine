<script>
	import { bech32 } from '@scure/base';
	import { searchInput, thingToLabel, labels, assignedLabels } from '$lib/store';
	import { ndkStore } from '$lib/ndk';
	import Labels from './Labels.svelte';
	import { nip19 } from 'nostr-tools';
	import AssignedLabels from './AssignedLabels.svelte';

	const Bech32MaxSize = 5000;

	/**
	 * Bech32 regex.
	 * @see https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki#bech32
	 */
	export const BECH32_REGEX = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;

	let userProfile;
	let existingLabels = [];

	async function getAssignedLabels(eventId) {
		const filter = { kinds: [1985], limit: 200, '#e': [eventId] };
		const labels = await $ndkStore.fetchEvents(filter);
		if (labels) {
			assignedLabels.set([...labels]);
		} else [assignedLabels.set([])];
	}

	/**
	 * @param {string} pubkey
	 * @returns {Promise<object>} profile
	 */
	async function getProfile(pubkey) {
		try {
			const user = $ndkStore.getUser({ hexpubkey: pubkey });
			await user.fetchProfile();
			if (!Object.keys(user.profile).length) {
				throw new Error('No user profile found!');
			}
			thingToLabel.set({
				...user
			});
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	/**
	 * Retrieve event and store in event store
	 * @param {string} eventId as hex
	 * @returns {Promise<object>} event
	 */
	async function getEvent(eventId) {
		try {
			const filter = { ids: [eventId] };
			const event = await $ndkStore.fetchEvent(filter);
			thingToLabel.set({
				...event
			});
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 * Checks if a string is a valid hexadecimal.
	 * @param {string} str - The string to check.
	 * @returns {boolean} - True if the string is a valid hexadecimal, false otherwise.
	 */
	function isHexadecimal(str) {
		const hexRegex = /^[0-9A-Fa-f]+$/g;
		return hexRegex.test(str);
	}

	/**
	 * Checks if a string is a valid URL.
	 * @param {string} str - The string to check.
	 * @returns {boolean} - True if the string is a valid URL, false otherwise.
	 */
	function isValidUrl(str) {
		try {
			new URL(str);
			return true;
		} catch (err) {
			return false;
		}
	}

	/**
	 * Parses the input string and returns a Map
	 * defining a type and more metadata on the thing to label
	 * @param {string} input
	 * @returns {Promise<Map<string, (string|object)>>} A Map with a "type" key and a "ThingToLabel" key.
	 */
	async function parseInput(input) {
		try {
			const { prefix, words } = bech32.decode(input, Bech32MaxSize);
			const { type, data } = nip19.decode(input);
			if (prefix === 'note') {
				await getEvent(data);
				getAssignedLabels(data);
			} else if (prefix === 'nevent') {
				await getEvent(data.id);
				getAssignedLabels(data.id);
			} else if (prefix === 'npub') {
				const pubkey = data;
				await getProfile(pubkey);
				getAssignedLabels(pubkey);
			} else if (prefix === 'nprofile') {
				const pubkey = data.pubkey;
				await getProfile(pubkey);
				getAssignedLabels(pubkey);
			}
		} catch (e) {
			// check if hex or url
			if (isHexadecimal(input)) {
				try {
					await getProfile(input);
					getAssignedLabels(input);
				} catch (error) {
					console.error(error);

					// now try if it is an event
					try {
						await getEvent(input);
						getAssignedLabels(input);
					} catch (ex2) {
						console.error(ex2);
					}
				}
			} else if (isValidUrl(input)) {
			}
			console.error('unknown input, what is that?');
		}
	}
	async function getUserProfile(pubkey) {
		const user = await $ndkStore.getUser({ hexpubkey: pubkey });
		const profile = await user.fetchProfile();
		return profile;
	}

	async function getProfileImage() {
		const roboImage = `https://robohash.org/${
			$thingToLabel?.pubkey || $thingToLabel._hexpubkey
		}.png`;
		if ($thingToLabel?.kind === 1) {
			const profile = await getUserProfile($thingToLabel.pubkey);
			return profile?.image || roboImage;
		} else if ($thingToLabel?.profile) {
			return $thingToLabel.profile?.image || roboImage;
		} else {
			return roboImage;
		}
	}
	$: (async () => $searchInput.length > 3 && (await parseInput($searchInput)))();
</script>

<div class="border-white border-2 border-solid rounded h-64 overflow-auto">
	{#if Object.keys($thingToLabel).length}
		<div class="p-2">
			{#key $labels.length}
				<Labels />
			{/key}
			{#key $assignedLabels.length}
				<AssignedLabels labels={$assignedLabels} />
			{/key}
			<a
				target="_blank"
				href="https://snort.social/p/{$thingToLabel?.pubkey || $thingToLabel._hexpubkey}"
			>
				{#key $thingToLabel}
					{#await getProfileImage() then image}
						<img class="w-16 h-16 m-2 rounded-full" src={image} />
					{/await}
				{/key}
			</a>
			{#if $thingToLabel.kind === 1}
				<p class="whitespace-pre-wrap break-words">{$thingToLabel.content}</p>
			{:else if $thingToLabel._hexpubkey}
				<p class="whitespace-pre-wrap break-words">{$thingToLabel.profile.about}</p>
			{:else}
				<p class="whitespace-pre-wrap break-words italic">No content to show</p>
			{/if}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center h-full">
			<p class="">Login & Enter an event id, note id or nevent</p>
			<p class="">Then do some labeling and publish!</p>
		</div>
		<p />{/if}
</div>
