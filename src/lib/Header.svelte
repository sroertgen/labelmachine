<script>
	import TaxonomySelect from './TaxonomySelect.svelte';
	import User from './User.svelte';
</script>

<!-- mobile view -->
<div class="sm:hidden mx-2 mt-1 w-full">
	<div class="flex flex-row justify-between items-center mb-1">
		<h1 class="text-3xl font-bold text-purple-500 italic">LabelMachine</h1>
		<User />
	</div>
	<TaxonomySelect />
</div>
<!-- normal view -->
<div class="sm:flex hidden w-full justify-between mt-1 items-center">
	<h1 class="ml-2 mr-4 text-3xl font-bold text-purple-500 italic">LabelMachine</h1>
	<div class="flex gap-1">
		<TaxonomySelect />
		<User />
	</div>
</div>
