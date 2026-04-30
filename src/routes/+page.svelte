<script lang="ts">
  import MapTile from '$lib/components/MapTile.svelte';
  import CabanaPopup from '$lib/components/CabanaPopup.svelte';
  import { bookCabana as apiBookCabana } from '$lib/services/api';

  interface TileData {
    row: number;
    col: number;
    type: string;
    cabanaId: string | null;
    isBooked: boolean;
  }

  interface Props {
    data: {
      tiles: TileData[];
      cabanaPositions: Array<{ row: number; col: number; cabanaId: string }>;
      cabanaCount: number;
      bookedCount: number;
    };
  }

  let { data }: Props = $props();

  let selectedCabanaId = $state<string | null>(null);
  let popupOpen = $state(false);
  let message = $state('');
  let messageType = $state<'success' | 'error' | 'info' | null>(null);

  const rows = $derived(() => {
    const maxRow = Math.max(...data.tiles.map(t => t.row));
    const maxCol = Math.max(...data.tiles.map(t => t.col));
    const grid: TileData[][] = [];

    for (let r = 0; r <= maxRow; r++) {
      const row: TileData[] = [];
      for (let c = 0; c <= maxCol; c++) {
        const tile = data.tiles.find(t => t.row === r && t.col === c);
        row.push(tile || { row: r, col: c, type: '.', cabanaId: null, isBooked: false });
      }
      grid.push(row);
    }
    return grid;
  });

  const cabanaStatusMap = $derived(() => {
    const map = new Map<string, boolean>();
    data.tiles.forEach(tile => {
      if (tile.cabanaId) {
        map.set(tile.cabanaId, tile.isBooked);
      }
    });
    return map;
  });

  function handleCabanaClick(cabanaId: string) {
    const isBooked = cabanaStatusMap().get(cabanaId) || false;

    if (isBooked) {
      message = 'This cabana is not available.';
      messageType = 'info';
    } else {
      selectedCabanaId = cabanaId;
      popupOpen = true;
      message = '';
      messageType = null;
    }
  }

  async function handleBook(room: string, guestName: string): Promise<boolean> {
    if (!selectedCabanaId) return false;

    const result = await apiBookCabana(selectedCabanaId, room, guestName);

    if (result.success) {
      message = `Cabana ${selectedCabanaId} booked successfully for ${guestName} in room ${room}!`;
      messageType = 'success';

      const newTiles = data.tiles.map(tile =>
        tile.cabanaId === selectedCabanaId
          ? { ...tile, isBooked: true }
          : tile
      );
      data = { ...data, tiles: newTiles };

      selectedCabanaId = null;
      popupOpen = false;
      return true;
    } else {
      message = result.error || 'Failed to book cabana';
      messageType = 'error';
      return false;
    }
  }

  function handleSuccess() {
    popupOpen = false;
    selectedCabanaId = null;
  }

  function handleError(msg: string) {
    message = msg;
    messageType = 'error';
  }
</script>

<div class="map-container">
  {#if message}
    <div class="message {messageType}">
      {message}
    </div>
  {/if}

  <div class="map">
    {#each rows() as row}
      <div class="row">
        {#each row as tile}
          {#if tile.type === 'W' && tile.cabanaId}
            <button
              class="tile-button"
              onclick={() => handleCabanaClick(tile.cabanaId!)}
            >
              <MapTile tileType={tile.type} isBooked={tile.isBooked} />
            </button>
          {:else}
            <MapTile tileType={tile.type} isBooked={false} />
          {/if}
        {/each}
      </div>
    {/each}
  </div>

  <CabanaPopup
    cabanaId={selectedCabanaId || ''}
    isOpen={popupOpen}
    onClose={() => { popupOpen = false; selectedCabanaId = null; }}
    onBook={handleBook}
    onSuccess={handleSuccess}
    onError={handleError}
  />
</div>

<style>
  .map-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .map {
    border: 2px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: #f0f0f0;
  }

  .row {
    display: flex;
  }

  .tile-button {
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  .tile-button:hover {
    filter: brightness(1.1);
  }

  .message {
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    max-width: 400px;
    text-align: center;
  }

  .message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .message.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
</style>