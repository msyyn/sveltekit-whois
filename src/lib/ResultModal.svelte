<script>
  import { browser } from '$app/env';
  import { fade, fly } from 'svelte/transition';

  export let loadedResult;
  export let showResultModal;

  $: {
    if (browser) {
      if (showResultModal) {
        document.querySelector('html').classList.add('no-scroll')
      } else {
        document.querySelector('html').classList.remove('no-scroll')
      }
    }
  }
  $: console.log('loadedResult', loadedResult);
  
</script>

{#if showResultModal}
  <div in:fade out:fade class="modal is-active">
    <div class="modal-background"></div>
    <div in:fly={{duration: 300, delay: 300, y: 50}} out:fade class="modal-content">
      <div class="box">

        <div class="domain-details__heading">
          <h1 class="is-size-3 mb-2">{loadedResult['Domain Name']}</h1>

          <p>Domain was registered on <b>{new Date(loadedResult['Created Date']).toLocaleString()}</b> and it's next expiration date is on <b>{new Date(loadedResult['Expiry Date']).toLocaleString()}</b></p>
        </div>
        
        <hr>

        <div class="domain-details__nameservers">
          <h2 class="is-size-4 mb-2">Names servers</h2>
          {#each Object.values(loadedResult['Name Server']) as nameserver}
            <p>{nameserver}</p>
          {/each}
        </div>

        <hr> 

        <div class="domain-details__disclaimer">
          <p class="is-size-7 has-text-grey">{@html loadedResult['text'].join('<br>')}</p>
        </div>
        
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" on:click={() => showResultModal = false}></button>
  </div>
{/if}

<style global>
  .no-scroll {
    overflow-y: hidden;
  }
  .modal-content {
    max-height: 60vh;
  }
  .modal-content .box {
    padding: 3rem;
  }
  @media all and (max-width:589px) {
    .modal {
      justify-content: flex-end;
    }
    .modal-content {
      max-height: 80vh;
    }
    .modal-content .box {
      padding: 1.5rem;
    }
  }
</style>