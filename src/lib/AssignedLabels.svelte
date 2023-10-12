<script>
	import Badge from './Badge.svelte';

	export let labels = [];

	function parseLabels(labels) {
		const parsedLabels = {
			topics: [],
			userGeneratedLabels: [],
			otherLabels: [],
			publicKeys: []
		};
		labels.forEach((l) => {
			const labelNamespace = l.tags.find((t) => t[0] === 'L')[1];
			if (labelNamespace === '#t') {
				parsedLabels.topics = [...parsedLabels.topics, l.tags.find((t) => t[0] === 'l')[1]];
			}
			if (labelNamespace === '#p') {
				parsedLabels.publicKeys = [
					...parsedLabels.publicKeys,
					...l.tags.filter((t) => t[2] === '#p').map((p) => p[1])
				];
			}
			if (labelNamespace === 'ugc') {
				parsedLabels.userGeneratedLabels = [
					...parsedLabels.userGeneratedLabels,
					l.tags.find((t) => t[0] === 'l')[1]
				];
			}
			if (!labelNamespace.startsWith('#')) {
				const namespacelabel = l.tags.find((t) => t[0] === 'l');
				parsedLabels.otherLabels = [
					...parsedLabels.otherLabels,
					namespacelabel[2] + ' ' + namespacelabel[1]
				];
			}
		});
		return parsedLabels;
	}

	const parsedLabels = parseLabels(labels);
</script>

{#if parsedLabels.topics.length}
	<p>
		Topics:
		{#each parsedLabels.topics as label}
			<Badge {label} />
		{/each}
	</p>
{/if}
{#if parsedLabels.userGeneratedLabels.length}
	<p>
		User Generated Labels:
		{#each parsedLabels.userGeneratedLabels as label}
			<Badge {label} />
		{/each}
	</p>
{/if}
{#if parsedLabels.otherLabels.length}
	<p>
		Other Labels:
		{#each parsedLabels.otherLabels as label}
			<Badge {label} />
		{/each}
	</p>
{/if}
{#if parsedLabels.publicKeys.length}
	<p>
		Public Keys:
		{#each parsedLabels.publicKeys as label}
			<Badge {label} />
		{/each}
	</p>
{/if}
