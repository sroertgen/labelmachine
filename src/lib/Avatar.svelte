<script>
	import { user } from '$lib/user';
</script>

<details class="dropdown dropdown-bottom dropdown-end">
	<summary class="avatar w-10">
		<img
			class="rounded-full border-purple-500 border"
			src={$user.profile.image || `https://robohash.org/${$user.npub}.png`}
		/>
	</summary>
	<ul
		class="p-2 shadow menu dropdown-content border-purple-500 border z-[1] bg-base-100 rounded-box w-52"
	>
		<li class=""><a on:click={() => user.reset()}>Logout</a></li>
	</ul>
</details>
