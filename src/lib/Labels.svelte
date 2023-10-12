<script>
	import { labels } from '$lib/store';
</script>

<div class="flex flex-col">
	{#each $labels as label}
		<div class="flex flex-row">
			{#if label.selectedType == 'Topic'}
				Topic:
				{#each label.topics.split(',') as topic}
					<span class="mx-2 badge badge-warning">{topic}</span>
				{/each}
			{:else if label.selectedType == 'Pubkey'}
				Pubkey: <div class="mx-2 badge badge-warning">{label.pubkey}</div>
			{:else if label.selectedType == 'Custom Label'}
				Namespace: <div class="mx-2 badge badge-warning">{label.labelNamespace}</div>
				Label:
				<div class="mx-2 badge badge-warning">{label.label}</div>
			{/if}
		</div>
	{/each}
</div>
