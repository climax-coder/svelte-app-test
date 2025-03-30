<script lang="ts">
  import { onMount } from 'svelte';
  import type { Resource } from '@prisma/client';
  import UploadModal from './UploadModal.svelte';
  // import Notification from '$lib/components/Notification.svelte';

  let resources: Resource[] = [];
  let filteredResources: Resource[] = [];
  let showUploadModal = false;
  let selectedType = 'All';
  let searchQuery = '';
  let showNotification = false;
  let notificationMessage = '';
  let sortDirection: 'asc' | 'desc' = 'asc';

  const resourceTypes = ['All', 'Videos', 'Documents', 'Lessons', 'Archive'] as const;

  // Map file extensions to resource types
  const fileTypeMap: Record<string, string> = {
    'mp4': 'Videos',
    'mov': 'Videos',
    'avi': 'Videos',
    'pdf': 'Documents',
    'doc': 'Documents',
    'docx': 'Documents',
    'ppt': 'Lessons',
    'pptx': 'Lessons'
  };

  function getResourceType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return fileTypeMap[extension] || 'Other';
  }

  onMount(async () => {
    await loadResources();
  });

  async function loadResources() {
    const response = await fetch('/api/resources');
    resources = await response.json();
    filterResources();
  }

  function filterResources() {
    let filtered = resources.filter(resource => {
      const resourceType = getResourceType(resource.fileName);
      const matchesType = selectedType === 'All' || resourceType === selectedType;
      const matchesSearch = !searchQuery || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });

    // Apply sorting if direction is set
    if (sortDirection) {
      filtered.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    filteredResources = filtered;
  }

  function handleTypeSelect(type: string) {
    if (type === 'Archive') return; // Prevent Archive selection
    selectedType = type;
    filterResources();
  }

  function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
    filterResources();
  }

  function toggleSort() {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    filterResources();
  }

  async function handleUploadSuccess() {
    showUploadModal = false;
    await loadResources();
    notificationMessage = 'Resource Uploaded Successfully!';
    showNotification = true;
    
    // Automatically hide notification after 3 seconds
    setTimeout(() => {
      showNotification = false;
    }, 3000);
  }

  function handleNotificationClose() {
    showNotification = false;
  }

  async function handleRowClick(resource: Resource) {
    try {
      // Increment view count
      await fetch(`/api/resources/${resource.id}/view`, { method: 'POST' });
      
      // Update local state
      const updatedResource = resources.find(r => r.id === resource.id);
      if (updatedResource) {
        updatedResource.viewCount += 1;
        filterResources(); // Refresh the filtered list
      }

      // Open file in new window
      let file_path = resource.filePath.replace("static", "");
      window.open(file_path, '_blank');
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  }
</script>

<div class="bg-white rounded-lg border-2 border-gray-200 relative">
  {#if showNotification}
    <div class="absolute left-1/2 -translate-x-1/2 top-4 z-50 flex items-center bg-white rounded-lg shadow-sm border border-gray-100 p-4 min-w-[300px]">
      <div class="flex-shrink-0 text-green-400">
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-900">
          {notificationMessage}
        </p>
      </div>
    </div>
  {/if}
  <div class="p-4 sm:p-6">
    <!-- Mobile Header -->
    <div class="sm:hidden mb-4">
      <div class="flex items-center justify-between">
        <div class="flex-1 max-w-[70%]">
          <div class="relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Field"
              class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md"
              bind:value={searchQuery}
              on:input={handleSearch}
            />
          </div>
        </div>
        <div class="flex items-center ml-4">
          <button
            type="button"
            class="px-3 py-1.5 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
            on:click={() => showUploadModal = true}
          >
            Upload
          </button>
        </div>
      </div>

      <!-- Mobile Resource Types -->
      <div class="mt-4 -mb-2 overflow-x-auto">
        <div class="flex space-x-4 pb-2">
          {#each resourceTypes as type}
            <button
              class="whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium
                {type === 'Archive' 
                  ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                  : selectedType === type 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}"
              on:click={() => handleTypeSelect(type)}
              disabled={type === 'Archive'}
            >
              {type}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Desktop Filter and Search Bar -->
    <div class="hidden sm:flex items-center justify-between mb-10">
      <div class="flex-1 flex items-center space-x-6 border-b border-gray-200">
        <!-- Resource Type Stats Icon -->
        <div class="text-gray-400">
          <img src="/diagram.png" alt="Resources" class="w-6 h-6">
        </div>
        <!-- Filter Buttons -->
        <nav class="flex space-x-8">
          {#each resourceTypes as type}
            <button
              class="text-sm font-medium border-b-2 pb-4 pt-4 transition-colors
                {type === 'Archive' 
                  ? 'text-gray-300 cursor-not-allowed border-transparent'
                  : selectedType === type 
                    ? 'border-black text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
              on:click={() => handleTypeSelect(type)}
              disabled={type === 'Archive'}
            >
              {type}
            </button>
          {/each}
        </nav>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Search Field -->
        <div class="relative">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Field"
            class="w-64 pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            bind:value={searchQuery}
            on:input={handleSearch}
          />
        </div>
        <!-- Upload Button -->
        <button
          type="button"
          class="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          on:click={() => showUploadModal = true}
        >
          Upload
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <!-- Desktop Table -->
      <table class="hidden sm:table min-w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="py-3 text-left text-sm font-semibold text-gray-900">
              <div class="flex items-center">
                <span>Content Title</span>
                <button 
                  class="ml-1" 
                  on:click|stopPropagation={toggleSort}
                  aria-label={sortDirection === 'asc' ? "Sort descending" : "Sort ascending"}
                >
                  {#if sortDirection === 'asc'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 24 24">
                      <polygon points="13 17.586 13 4 11 4 11 17.586 4.707 11.293 3.293 12.707 12 21.414 20.707 12.707 19.293 11.293 13 17.586"/>
                    </svg>
                  {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24">
                      <polygon points="3.293 11.293 4.707 12.707 11 6.414 11 20 13 20 13 6.414 19.293 12.707 20.707 11.293 12 2.586 3.293 11.293"/>
                    </svg>
                  {/if}
                </button>
              </div>
            </th>
            <th class="px-3 py-3 text-left text-sm font-semibold text-gray-900">Path</th>
            <th class="px-3 py-3 text-left text-sm font-semibold text-gray-900">View Count</th>
            <th class="px-3 py-3 text-left text-sm font-semibold text-gray-900">Uploaded By</th>
            <th class="px-3 py-3 text-left text-sm font-semibold text-gray-900">Provider</th>
            <th class="px-3 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
            <th class="px-3 py-3 text-left text-sm font-semibold text-gray-900"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {#each filteredResources as resource}
            <tr 
              class="hover:bg-gray-50 cursor-pointer"
              on:click={() => handleRowClick(resource)}
              role="button"
              tabindex="0"
              on:keydown={(e) => e.key === 'Enter' && handleRowClick(resource)}
            >
              <td class="py-4 text-sm font-medium text-gray-900">{resource.title}</td>
              <td class="px-3 py-4 text-sm text-gray-500">{resource.filePath}</td>
              <td class="px-3 py-4 text-sm text-gray-500">{resource.viewCount}</td>
              <td class="px-3 py-4 text-sm text-gray-500">{resource.uploadedBy}</td>
              <td class="px-3 py-4 text-sm text-gray-500">{resource.provider}</td>
              <td class="px-3 py-4 text-sm text-gray-500">{resource.fileType}</td>
              <td class="px-3 py-4 text-sm text-gray-500">
                <button 
                  class="text-gray-400 hover:text-gray-600"
                  aria-label="Resource options menu"
                >
                  <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Mobile List View -->
      <div class="sm:hidden divide-y divide-gray-200">
        {#each filteredResources as resource}
          <div 
            class="py-4 cursor-pointer"
            on:click={() => handleRowClick(resource)}
            role="button"
            tabindex="0"
            on:keydown={(e) => e.key === 'Enter' && handleRowClick(resource)}
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{resource.title}</p>
                <p class="mt-1 text-sm text-gray-500">{resource.provider}</p>
                <div class="mt-2 flex items-center text-xs text-gray-500">
                  <span>{resource.fileType}</span>
                  <span class="mx-2">•</span>
                  <span>{resource.viewCount} views</span>
                </div>
              </div>
              <button 
                class="ml-4 text-gray-400 hover:text-gray-600"
                aria-label="Resource options menu"
              >
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

{#if showUploadModal}
  <UploadModal
    on:close={() => showUploadModal = false}
    on:success={handleUploadSuccess}
  />
{/if} 