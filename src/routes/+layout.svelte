<script lang="ts">
  import Legend from '$lib/components/Legend.svelte';

  let { children } = $props();
</script>

<div class="app">
  <header>
    <h1>Resort Map</h1>
  </header>

  <main>
    {@render children()}
  </main>

  <footer>
    <Legend />
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    background: #2c3e50;
    color: white;
    padding: 1rem 2rem;
  }

  header h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  main {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  footer {
    padding: 1rem 2rem;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
  }
</style>