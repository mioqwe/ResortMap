<script lang="ts">
  interface Props {
    cabanaId: string;
    isOpen: boolean;
    onClose: () => void;
    onBook: (room: string, guestName: string) => Promise<boolean>;
    onSuccess: () => void;
    onError: (message: string) => void;
  }

  let { cabanaId, isOpen, onClose, onBook, onSuccess, onError }: Props = $props();

  let room = $state('');
  let guestName = $state('');
  let errorMessage = $state('');
  let isSubmitting = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = '';

    if (!room.trim() || !guestName.trim()) {
      errorMessage = 'Please enter both room number and guest name';
      return;
    }

    isSubmitting = true;

    try {
      const success = await onBook(room.trim(), guestName.trim());
      if (success) {
        onSuccess();
      }
    } catch (err) {
      onError('Booking failed. Please try again.');
    } finally {
      isSubmitting = false;
    }
  }

  function handleClose() {
    room = '';
    guestName = '';
    errorMessage = '';
    onClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }

  $effect(() => {
    if (!isOpen) {
      room = '';
      guestName = '';
      errorMessage = '';
      isSubmitting = false
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div class="modal-overlay" role="presentation">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
      <button class="close-btn" onclick={handleClose} aria-label="Close modal">×</button>
      <h2 id="modal-title">Book Cabana {cabanaId}</h2>
      <form onsubmit={handleSubmit}>
        <div class="form-group">
          <label for="room">Room Number</label>
          <input
            type="text"
            id="room"
            bind:value={room}
            placeholder="e.g., 101"
            disabled={isSubmitting}
          />
        </div>
        <div class="form-group">
          <label for="guestName">Guest Name</label>
          <input
            type="text"
            id="guestName"
            bind:value={guestName}
            placeholder="e.g., Alice Smith"
            disabled={isSubmitting}
          />
        </div>

        {#if errorMessage}
          <p class="error">{errorMessage}</p>
        {/if}

        <div class="buttons">
          <button type="button" class="cancel" onclick={handleClose} disabled={isSubmitting}>Cancel</button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Booking...' : 'Book'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    min-width: 300px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 100;
  }

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0.25rem 0.5rem;
    line-height: 1;
  }

  .close-btn:hover {
    color: #333;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border-color: #007bff;
  }

  .error {
    color: #dc3545;
    margin: 0.5rem 0;
    font-size: 0.875rem;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    background: #007bff;
    color: white;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button.cancel {
    background: #6c757d;
  }

  button:hover:not(:disabled) {
    opacity: 0.9;
  }
</style>