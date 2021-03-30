<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let localStorageItems;
  export let localStorageKey;

  function clearLocalHistory() {
    localStorageItems = [];
    localStorage.removeItem(localStorageKey);
  };

  function loadDomainWhois(e, domain) {
    dispatch('loadDomainWhois', {
      domain: domain
    });
  };
</script>

<div class="level mt-6">
  <div class="level-left">
    <div>
      <h2 class="subtitle mb-1">Your search history</h2>
      <small class="small">Showing last 10 searches</small>
    </div>
  </div>
  <div class="level-right">
    <button type="button" class="button is-small is-danger is-light" on:click={clearLocalHistory}>
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </span>
      <span>Clear history</span>
    </button>
  </div>
</div>

<table style="width: 100%; background: transparent;" class="table">
  <thead>
    <tr>
      <th>Domain</th>
      <th class="has-text-right"></th>
    </tr>
  </thead>
  <tbody>
    {#each localStorageItems.sort((a,b) => b.id - a.id).slice(0,10) as item}
      <tr>
        <td>
          <a class="is-flex is-align-items-center" href="https://{item.domain}" target="_blank">
            <span class="mr-1">{item.domain}</span>
            <span class="icon" style="width: 20px; height: 20px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </span>
          </a>
        </td>
        <td class="has-text-right">
          <button type="button" class="button is-small" on:click={(e) => {loadDomainWhois(e, item.domain)}}>
            Show details
          </button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>