<script lang="ts">
  interface Props {
    tileType: string;
    isBooked?: boolean;
  }

  let { tileType, isBooked = false }: Props = $props();

  const assetMap: Record<string, string> = {
    'W': '/assets/cabana.png',
    'p': '/assets/pool.png',
    '#': '/assets/parchmentBasic.png',
    'c': '/assets/houseChimney.png',
    '.': '/assets/parchmentBasic.png'
  };

  const src = $derived(assetMap[tileType]);
</script>

<div class="tile" class:booked={isBooked && tileType === 'W'}>
  {#if isBooked && tileType === 'W'}
    <div class="booked-overlay">✕</div>
  {/if}
  {#if tileType != '.'}
    <img {src} alt={tileType} />
  {/if}
</div>

<style>
  .tile {
    width: 40px;
    height: 40px;
    position: relative;
    display: inline-block;
  }

  .tile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .tile.booked {
    opacity: 0.6;
  }

  .booked-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: bold;
  }
</style>