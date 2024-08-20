<script lang="ts">
	import '../app.pcss';
	import '@fontsource-variable/overpass-mono';

	import { ModeWatcher } from 'mode-watcher';

	import Navbar from './_components/navbar.svelte';

	export let data;

	console.log(data);
</script>

<svelte:head>
	<title>translate5</title>
</svelte:head>

<ModeWatcher />
<Navbar />
<div class="mx-auto w-3/4">
	<slot />
</div>
