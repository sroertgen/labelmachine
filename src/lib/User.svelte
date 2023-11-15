<script>
	import Avatar from '$lib/Avatar.svelte';
	import { user } from '$lib/user';
</script>

{#if !$user.pk}
	<button onclick="login_modal.showModal()" class="btn bg-purple-500 hover:bg-purple-500 text-black"
		>Login</button
	>
{:else}
	<Avatar />
{/if}
