<script lang="ts">
  const items = [
    { symbol: 'W', label: 'Cabana' },
    { symbol: 'p', label: 'Pool' },
    { symbol: '#', label: 'Path' },
    { symbol: 'c', label: 'Chalet' },
    { symbol: '.', label: 'Empty space' }
  ];

  const assetMap: Record<string, string> = {
    'W': '/assets/cabana.png',
    'p': '/assets/pool.png',
    '#': '/assets/parchmentBasic.png',
    'c': '/assets/houseChimney.png',
    '.': '/assets/parchmentBasic.png'
  };
</script>

<div class="legend">
  <h3>Map Legend</h3>
  <div class="legend-items">
    {#each items as item}
      {#if item.symbol != '.'}
        <div class="legend-item">
          <img src={assetMap[item.symbol]} alt={item.label} />
          <span><strong>{item.symbol}</strong> = {item.label}</span>
        </div>
      {:else if item.symbol === '.'}
        <div class="legend-item">
          <span><strong>{item.symbol}</strong> = {item.label}</span>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .legend {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  }

  h3 {
    margin: 0 0 0.75rem 0;
    color: #333;
  }

  .legend-items {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend-item img {
    width: 24px;
    height: 24px;
    object-fit: cover;
    border: 1px solid #ddd;
  }

  span {
    font-size: 0.875rem;
    color: #555;
  }
</style>