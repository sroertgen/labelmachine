<script>
	import { ndkStore } from '$lib/ndk';
	import { user } from '$lib/user';
	import { generatePrivateKey, getPublicKey } from 'nostr-tools';

	async function login() {
		if (typeof window.nostr !== 'undefined') {
			console.log('nostr is available!');
			const pk = await window.nostr.getPublicKey();
			await user.setUser($ndkStore, pk);
		} else {
			alert(`window.nostr is not available. Please install a compatible 
    browser extension (e.g. Alby).`);
		}
	}
	function genKey() {
		let sk = generatePrivateKey(); // `sk` is a hex string
		let pk = getPublicKey(sk); // `pk` is a hex string
		user.setUser($ndkStore, pk);
	}
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog id="login_modal" class="modal">
	<div class="modal-box flex flex-col gap-2">
		{#if !$user.pk}
			<button disabled class="btn">Login with NSEC</button>
			<button on:click={async () => await login()} class="btn">Login with Browser Extension</button>
			<button on:click={() => genKey()} class="btn">Generate Key</button>
		{:else}
			<form class="flex flex-col justify-center" method="dialog">
				<p>Logged In! Now do some labeling</p>
				<button class="btn bg-green-400 hover:bg-green-400 text-black">Close!</button>
			</form>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
