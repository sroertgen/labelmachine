<script>
	import { labels } from '$lib/store';
</script>

<div class="flex flex-col w-3/4">
	{#each $labels as label}
		<div class="flex flex-row flex-wrap">
			{#if label.selectedType == 'Topic'}
				<span>Topic:</span>
				{#each label.topics.split(',') as topic}
					<span class="mx-2 badge badge-warning">{topic}</span>
				{/each}
			{:else if label.selectedType == 'Pubkey'}
				Pubkey: <div class="mx-2 badge badge-warning">{label.pubkey}</div>
			{:else if label.selectedType == 'Custom Label'}
				<span
					>Namespace: <div class="mx-2 badge badge-warning">{label.labelNamespace}</div></span
				>
				<span>Label:</span>
				<div class="mx-2 badge badge-warning">{label.label}</div>
			{/if}
		</div>
	{/each}
</div>
