
<script>
  import { browser } from '$app/env';
  import { onMount } from 'svelte';
  import lottie from 'lottie-web';

  import Typewriter from 'svelte-typewriter';
  import ResultModal from '$lib/ResultModal.svelte';
  import SearchHistoryTable from '$lib/SearchHistoryTable.svelte';

  let preloadedDomains = [
    'vercel.com',
    'github.com',
    'facebook.com',
    'twitter.com'
  ];

  let loadedResult = false;
  let loadingResults = false;
  let showResultModal = false;
  let domainSearchQuery;
  let showTypewriter = true;
  
  const localStorageKey = '__domainWhois__history';
  let localStorageItems = [];
  
  if (browser) {
    onMount(() => {
      const localStorageEntry = localStorage.getItem(localStorageKey);
      if (localStorageEntry) {
        localStorageItems = JSON.parse(localStorageEntry);
      };

      lottie.loadAnimation({
        container: document.getElementById('lottiePlayer'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/laptop.json'
      })
    });
  };

  async function loadDomainWhois(evt = false) {
    if (loadingResults) { return };
    const searchQuery = evt.detail && evt.detail.domain || domainSearchQuery;
    loadingResults = true;

    const request = await fetch('/whois', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      referrerPolicy: 'same-origin',
      body: JSON.stringify({ query: searchQuery })
    });

    const { result, error } = await request.json();

    if (error) {
      console.error(error)
      loadingResults = false;
      domainSearchQuery = undefined;
    }

    if (result) {
      const firstMatch = Object.values(result)[0]; // return first entry of object.
      loadingResults = false;
      console.dir(firstMatch);
      openResultModal(firstMatch);

      if (evt.detail && evt.detail.domain) { return };

      // don't trigger local storage adding on "Show details" btn clicks to avoid it growing big.
      localStorageItems = [...localStorageItems, 
        {
          domain: firstMatch['Domain Name'].toLowerCase(),
          id: localStorageItems.length++
        }
      ];
      if (localStorageItems.length > 20) {
        localStorageItems.splice(0,10);
      };
      localStorage.setItem(localStorageKey, JSON.stringify(localStorageItems));
    };
  };

  function openResultModal(data) {
    loadedResult = data;
    showResultModal = true;
  };
</script>

<svelte:head>
  <title>SvelteKit WHOIS</title>
</svelte:head>

<main>
  <div class="hero is-fullheight">
    <div class="hero-body">
      <div class="container is-max-widescreen">
        <div id="lottiePlayer"></div>
        <h1 class="title mt-6 has-text-centered">Domain WHOIS</h1>

        <div class="container">
          <form on:submit|preventDefault={loadDomainWhois}>
            <div class="field is-grouped">
              
              <div class="is-relative control is-expanded">
                <input on:focus={() => showTypewriter = false} bind:value={domainSearchQuery} placeholder="{showTypewriter ? '' : 'Enter domain'}" id="whois_domain_url" class="input is-medium" autocomplete="url" type="text" required/>
                <div class="typewriter-container">
                  {#if showTypewriter}
                    <Typewriter loopRandom delay={300} cursor={false}>
                      {#each preloadedDomains as typetext}
                        <span>{typetext}</span>
                      {/each}
                    </Typewriter>
                  {/if}
                </div>
              </div>
              <div class="control">
                <button type="submit" class="button is-medium is-primary {loadingResults ? 'is-loading' : ''}">Lookup</button>
              </div>
            </div>
          </form>

          {#if localStorageItems.length > 0}
            <SearchHistoryTable localStorageKey={localStorageKey} on:loadDomainWhois={loadDomainWhois} bind:localStorageItems/>
          {/if}

          <p class="mt-6 has-text-centered"><a href="https://github.com/msyyn/sveltekit-whois" target="_blank">GitHub</a></p>
        </div>
      </div>
    </div>
  </div>
</main>

<ResultModal bind:showResultModal bind:loadedResult/>

<style>
  #lottiePlayer { 
    margin: 0 auto 0;
    max-width: 600px;
    min-height: 200px;
  }
  .container {
    margin: 0 auto 0;
  }
  .typewriter-container {
    font-size: 1.25rem;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.7125rem 1rem;
    opacity: 0.3;
  }
  @media all and (min-width: 590px) {
    #lottiePlayer {
      min-height: 400px;
      max-width: 600px;
    }
    .container {
      max-width: 800px;
    }
  }
</style>