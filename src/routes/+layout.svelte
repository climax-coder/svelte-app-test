{#key $page.url.pathname}
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span class="text-2xl font-bold">pack</span>
          </div>
          <!-- Desktop Navigation -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="/" class="{$page.url.pathname === '/' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="/users" class="{$page.url.pathname === '/users' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Users
            </a>
            <a href="/feedbacks" class="{$page.url.pathname === '/feedbacks' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Feedbacks
            </a>
            <a href="/programs" class="{$page.url.pathname === '/programs' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Programs
            </a>
            <a href="/resources" class="{$page.url.pathname === '/resources' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Resources
            </a>
            <a href="/counterparties" class="{$page.url.pathname === '/counterparties' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Counterparties
            </a>
            <a href="/events" class="{$page.url.pathname === '/events' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Events
            </a>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="sm:hidden flex items-center">
          <button 
            type="button" 
            class="text-gray-500 hover:text-gray-900"
            on:click={() => showMobileMenu = !showMobileMenu}
            aria-expanded={showMobileMenu}
          >
            <span class="sr-only">Open main menu</span>
            <svg 
              class="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {#if showMobileMenu}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              {:else}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              {/if}
            </svg>
          </button>
        </div>

        <!-- Desktop right section -->
        <div class="hidden sm:flex items-center space-x-4">
          <button class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100">
            <img src="/images/flags/us.svg" alt="US English" class="w-5 h-5" />
          </button>
          <button class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
            <img src="/images/avatar.png" alt="User profile" class="w-6 h-6 rounded-full" />
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      {#if showMobileMenu}
        <div class="sm:hidden pb-3 pt-2">
          <div class="space-y-1">
            <a 
              href="/" 
              class="{$page.url.pathname === '/' ? 'bg-orange-50 border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Dashboard
            </a>
            <a 
              href="/users" 
              class="{$page.url.pathname === '/users' ? 'bg-orange-50 border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Users
            </a>
            <a 
              href="/feedbacks" 
              class="{$page.url.pathname === '/feedbacks' ? 'bg-orange-50 border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Feedbacks
            </a>
            <a 
              href="/programs" 
              class="{$page.url.pathname === '/programs' ? 'bg-orange-50 border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Programs
            </a>
            <a 
              href="/resources" 
              class="{$page.url.pathname === '/resources' ? 'bg-orange-50 border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Resources
            </a>
            <a 
              href="/counterparties" 
              class="{$page.url.pathname === '/counterparties' ? 'bg-orange-50 border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Counterparties
            </a>
            <a 
              href="/events" 
              class="{$page.url.pathname === '/events' ? 'bg-orange-50 border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Events
            </a>
          </div>
          <!-- Mobile right section -->
          <div class="mt-4 flex items-center justify-between px-4">
            <button class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100">
              <img src="/images/flags/us.svg" alt="US English" class="w-5 h-5" />
            </button>
            <button class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
              <img src="/images/avatar.png" alt="User profile" class="w-6 h-6 rounded-full" />
            </button>
          </div>
        </div>
      {/if}
    </div>
  </nav>

  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <slot />
  </main>
{/key}

<script lang="ts">
  import { page } from '$app/stores';
  import '../app.css';

  let showMobileMenu = false;
</script> 