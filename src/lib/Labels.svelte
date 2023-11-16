<script>
	import { labels } from '$lib/store';
</script>

<div class="flex flex-col">
	{#each $labels as label}
		<div class="flex flex-row flex-wrap">
			{#if label.selectedType == 'Topic'}
				<span>Topic:</span>
				{#each label.topics.split(',') as topic}
					<span class="mx-2 badge badge-warning h-max">{topic}</span>
				{/each}
			{:else if label.selectedType == 'Pubkey'}
				Pubkey: <div class="mx-2 badge badge-warning h-max">{label.pubkey}</div>
			{:else if label.selectedType == 'Custom Label'}
				<p>
					<span
						>Namespace: <div class="mx-2 badge badge-warning h-max">
							{label.labelNamespace}
						</div></span
					>
				</p>
				<p>
					<span
						>Label:
						<div class="mx-2 badge badge-warning h-max">{label.label}</div>
					</span>
				</p>
			{/if}
		</div>
	{/each}
</div>
