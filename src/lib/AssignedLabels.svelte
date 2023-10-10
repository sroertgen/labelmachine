<script>
	import Badge from './Badge.svelte';

	export let labels = [];

	function parseLabels(labels) {
		const parsedLabels = {
			topics: [],
			userGeneratedLabels: [],
			otherLabels: []
		};

		labels.forEach((l) => {
			if (l.tags.some((item) => item[1] === '#t')) {
				parsedLabels.topics = [...parsedLabels.topics, l.tags.find((t) => t[0] === 'l')[1]];
				console.log(parsedLabels);
			} else if (l.tags.some((item) => item[1] === 'ugc')) {
				parsedLabels.userGeneratedLabels = [
					...parsedLabels.userGeneratedLabels,
					l.tags.find((t) => t[0] === 'l')[1]
				];
			} else {
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

	$: console.log(parsedLabels);
</script>

<p>
	Topics:
	{#each parsedLabels.topics as label}
		<Badge {label} />
	{/each}
</p>
<p>
	User Generated Labels:
	{#each parsedLabels.userGeneratedLabels as label}
		<Badge {label} />
	{/each}
</p>
<p>
	Other Labels:
	{#each parsedLabels.otherLabels as label}
		<Badge {label} />
	{/each}
</p>
