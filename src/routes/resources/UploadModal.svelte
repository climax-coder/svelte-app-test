<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { z } from 'zod';

  const dispatch = createEventDispatcher();

  const categories = ['Leadership', 'Managing Complexity', 'Communication', 'Problem Solving'];
  const languages = ['en', 'it', 'es', 'fr', 'de'];
  const providers = ['Skilla', 'Linkedin', 'Pack', 'Mentor'];
  const roles = ['Mentor/Coach', 'Mentee/Coachee'];

  let title = '';
  let description = '';
  let category = '';
  let language = '';
  let provider = '';
  let role = '';
  let file: FileList | null = null;
  let errors: Record<string, string> = {};

  // Dropdown states
  let showCategoryDropdown = false;
  let showLanguageDropdown = false;
  let showProviderDropdown = false;
  let showRolesDropdown = false;

  function handleClickOutside(event: MouseEvent, dropdownName: string) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      switch(dropdownName) {
        case 'category': showCategoryDropdown = false; break;
        case 'language': showLanguageDropdown = false; break;
        case 'provider': showProviderDropdown = false; break;
        case 'role': showRolesDropdown = false; break;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent, dropdownName: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      switch(dropdownName) {
        case 'category': showCategoryDropdown = !showCategoryDropdown; break;
        case 'language': showLanguageDropdown = !showLanguageDropdown; break;
        case 'provider': showProviderDropdown = !showProviderDropdown; break;
        case 'role': showRolesDropdown = !showRolesDropdown; break;
      }
    } else if (event.key === 'Escape') {
      switch(dropdownName) {
        case 'category': showCategoryDropdown = false; break;
        case 'language': showLanguageDropdown = false; break;
        case 'provider': showProviderDropdown = false; break;
        case 'role': showRolesDropdown = false; break;
      }
    }
  }

  const schema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(1000),
    category: z.string().min(1),
    language: z.string().min(1),
    provider: z.string().min(1),
    role: z.string().optional(),
    file: z.instanceof(FileList).refine((files) => files.length > 0, 'File is required')
      .refine((files) => {
        const file = files[0];
        const validTypes = [
          'video/mp4', 'video/quicktime', 'video/x-msvideo',
          'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
        return validTypes.includes(file.type);
      }, 'Only Videos, Documents, and Slide files are allowed')
  });

  async function handleSubmit() {
    try {
      const formData = new FormData();
      const data = {
        title,
        description,
        category,
        language,
        provider,
        role,
        file
      };
      schema.parse(data);
      errors = {};
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('language', language);
      formData.append('provider', provider);
      formData.append('role', role);
      if (file?.[0]) {
        formData.append('file', file[0]);
      }
      const response = await fetch('/api/resources', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        dispatch('success');
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          // Handle duplicate error
          errors = {
            ...errors,
            duplicate: errorData.message
          };
          throw new Error(errorData.message);
        } else {
          throw new Error(errorData.message || 'Error uploading resource');
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors = Object.fromEntries(
          Object.entries(error.formErrors.fieldErrors).map(([key, value]) => [
            key,
            value?.[0] || ''
          ])
        );
      } else {
        // Display error at the top of the form
        errors.duplicate = error instanceof Error ? error.message : 'An unknown error occurred';
      }
    }
  }
</script>

<svelte:window on:click={(e) => {
  if (showCategoryDropdown) handleClickOutside(e, 'category');
  if (showLanguageDropdown) handleClickOutside(e, 'language');
  if (showProviderDropdown) handleClickOutside(e, 'provider');
  if (showRolesDropdown) handleClickOutside(e, 'role');
}} />

<div class="fixed inset-0 bg-black bg-opacity-30"></div>

<div class="fixed inset-0 z-10 overflow-y-auto">
  <div class="flex min-h-full items-center justify-center p-4">
    <div class="relative w-full max-w-md bg-white rounded-lg shadow-lg mx-4 sm:mx-0">
      <div class="absolute right-2 top-2">
        <button
          type="button"
          class="text-gray-400 hover:text-gray-500"
          on:click={() => dispatch('close')}
        >
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div class="p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Upload Resource</h2>
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          {#if errors.duplicate}
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-600">{errors.duplicate}</p>
            </div>
          {/if}
          <div>
            <input
              type="text"
              placeholder="Title*"
              bind:value={title}
              class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 {title ? 'text-gray-900' : 'text-gray-400'}"
            />
            {#if errors.title}
              <p class="mt-1 text-xs text-red-600">{errors.title}</p>
            {/if}
          </div>

          <div>
            <textarea
              placeholder="Description*"
              bind:value={description}
              rows="1"
              class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 {description ? 'text-gray-900' : 'text-gray-400'}"
            ></textarea>
            {#if errors.description}
              <p class="mt-1 text-xs text-red-600">{errors.description}</p>
            {/if}
          </div>

          <div class="dropdown-container relative">
            <button
              type="button"
              class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm cursor-pointer flex justify-between items-center {category ? 'text-gray-900' : 'text-gray-400'}"
              on:click={() => showCategoryDropdown = !showCategoryDropdown}
              on:keydown={(e) => handleKeyDown(e, 'category')}
              aria-haspopup="listbox"
              aria-expanded={showCategoryDropdown}
              aria-controls="category-listbox"
            >
              <span>{category || "Category*"}</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            {#if showCategoryDropdown}
              <div 
                class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
                role="listbox"
                id="category-listbox"
                aria-label="Categories"
              >
                {#each categories as cat}
                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left hover:bg-gray-50 cursor-pointer text-sm"
                    role="option"
                    aria-selected={category === cat}
                    on:click={() => {
                      category = cat;
                      showCategoryDropdown = false;
                    }}
                    on:keydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        category = cat;
                        showCategoryDropdown = false;
                      }
                    }}
                  >
                    {cat}
                  </button>
                {/each}
              </div>
            {/if}
            {#if errors.category}
              <p class="mt-1 text-xs text-red-600" role="alert">{errors.category}</p>
            {/if}
          </div>

          <div class="dropdown-container relative">
            <button
              type="button"
              class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm cursor-pointer flex justify-between items-center {language ? 'text-gray-900' : 'text-gray-400'}"
              on:click={() => showLanguageDropdown = !showLanguageDropdown}
              on:keydown={(e) => handleKeyDown(e, 'language')}
              aria-haspopup="listbox"
              aria-expanded={showLanguageDropdown}
              aria-controls="language-listbox"
            >
              <span>{language || "Language*"}</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            {#if showLanguageDropdown}
              <div 
                class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
                role="listbox"
                id="language-listbox"
                aria-label="Languages"
              >
                {#each languages as lang}
                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left hover:bg-gray-50 cursor-pointer text-sm"
                    role="option"
                    aria-selected={language === lang}
                    on:click={() => {
                      language = lang;
                      showLanguageDropdown = false;
                    }}
                    on:keydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        language = lang;
                        showLanguageDropdown = false;
                      }
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                {/each}
              </div>
            {/if}
            {#if errors.language}
              <p class="mt-1 text-xs text-red-600" role="alert">{errors.language}</p>
            {/if}
          </div>

          <div class="dropdown-container relative">
            <button
              type="button"
              class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm cursor-pointer flex justify-between items-center {provider ? 'text-gray-900' : 'text-gray-400'}"
              on:click={() => showProviderDropdown = !showProviderDropdown}
              on:keydown={(e) => handleKeyDown(e, 'provider')}
              aria-haspopup="listbox"
              aria-expanded={showProviderDropdown}
              aria-controls="provider-listbox"
            >
              <span>{provider || "Provider*"}</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            {#if showProviderDropdown}
              <div 
                class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
                role="listbox"
                id="provider-listbox"
                aria-label="Providers"
              >
                {#each providers as prov}
                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left hover:bg-gray-50 cursor-pointer text-sm"
                    role="option"
                    aria-selected={provider === prov}
                    on:click={() => {
                      provider = prov;
                      showProviderDropdown = false;
                    }}
                    on:keydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        provider = prov;
                        showProviderDropdown = false;
                      }
                    }}
                  >
                    {prov}
                  </button>
                {/each}
              </div>
            {/if}
            {#if errors.provider}
              <p class="mt-1 text-xs text-red-600" role="alert">{errors.provider}</p>
            {/if}
          </div>

          <div class="dropdown-container relative">
            <button
              type="button"
              class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm cursor-pointer flex justify-between items-center {role ? 'text-gray-900' : 'text-gray-400'}"
              on:click={() => showRolesDropdown = !showRolesDropdown}
              on:keydown={(e) => handleKeyDown(e, 'role')}
              aria-haspopup="listbox"
              aria-expanded={showRolesDropdown}
              aria-controls="roles-listbox"
            >
              <span>{role || "Role"}</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            {#if showRolesDropdown}
              <div 
                class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
                role="listbox"
                id="roles-listbox"
                aria-label="Roles"
              >
                {#each roles as role_list}
                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left hover:bg-gray-50 cursor-pointer text-sm"
                    role="option"
                    aria-selected={role === role_list}
                    on:click={() => {
                      role = role_list;
                      showRolesDropdown = false;
                    }}
                    on:keydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        role = role_list;
                        showRolesDropdown = false;
                      }
                    }}
                  >
                    {role_list}
                  </button>
                {/each}
              </div>
            {/if}
            {#if errors.role}
              <p class="mt-1 text-xs text-red-600" role="alert">{errors.role}</p>
            {/if}
          </div>

          <div class="flex items-center space-x-2">
            <div class="flex-grow">
              <input
                type="text"
                readonly
                value={file?.[0]?.name || "No file selected*"}
                class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-400 bg-white cursor-default"
              />
            </div>
            <div>
              <input
                type="file"
                id="file-upload"
                bind:files={file}
                accept=".mp4,.mov,.avi,.pdf,.doc,.docx,.ppt,.pptx"
                class="hidden"
              />
              <button
                type="button"
                class="px-4 py-2 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
                on:click={() => document.getElementById('file-upload')?.click()}
              >
                Select file
              </button>
            </div>
            {#if errors.file}
              <p class="mt-1 text-xs text-red-600">{errors.file}</p>
            {/if}
          </div>

          <div class="flex justify-end mt-6">
            <button
              type="submit"
              class="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div> 