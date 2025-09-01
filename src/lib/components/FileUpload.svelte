<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    let isDragOver = false;
    let fileInput;
    let fileName = '';
    
    function handleDragOver(event) {
        event.preventDefault();
        isDragOver = true;
    }
    
    function handleDragLeave(event) {
        event.preventDefault();
        isDragOver = false;
    }
    
    function handleDrop(event) {
        event.preventDefault();
        isDragOver = false;
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }
    
    function handleFileSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }
    
    function processFile(file) {
        fileName = file.name;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const content = e.target.result;
            dispatch('fileLoaded', { content, fileName: file.name });
        };
        
        reader.readAsText(file);
    }
    
    function openFileDialog() {
        fileInput.click();
    }
</script>

<div class="relative">
    <input
        type="file"
        accept=".txt,.log"
        bind:this={fileInput}
        on:change={handleFileSelect}
        class="hidden"
    />
    
    <div
        class="glass-accent rounded-2xl border-2 border-dashed transition-all duration-300 ease-out
               {isDragOver 
                 ? 'border-primary-400 bg-primary-50/20 scale-105' 
                 : 'border-primary-300/50 hover:border-primary-400/70 hover:bg-primary-50/10'
               }"
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
        role="button"
        tabindex="0"
        on:click={openFileDialog}
        on:keydown={(e) => e.key === 'Enter' && openFileDialog()}
    >
        <div class="p-12 text-center">
            {#if fileName}
                <div class="mb-6">
                    <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 
                                rounded-xl flex items-center justify-center text-white text-2xl">
                        📄
                    </div>
                    <h3 class="text-xl font-semibold text-primary-800 mb-2">
                        File Loaded Successfully
                    </h3>
                    <p class="text-primary-600 font-medium">{fileName}</p>
                </div>
                
                <button
                    on:click|stopPropagation={openFileDialog}
                    class="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 
                           text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 
                           transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    Choose Different File
                </button>
            {:else}
                <div class="mb-6">
                    <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500/20 to-primary-600/30 
                                rounded-2xl flex items-center justify-center text-primary-500 text-3xl">
                        📁
                    </div>
                    <h3 class="text-2xl font-bold text-primary-300 mb-3">
                        Upload Git Log File
                    </h3>
                    <p class="text-primary-200 mb-6 max-w-md mx-auto leading-relaxed">
                        Drag and drop your git log file here, or click to browse. 
                        We'll analyze your commit history and show you beautiful insights.
                    </p>
                </div>
                
                <button
                    class="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 
                           text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 
                           transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105
                           inline-flex items-center gap-3"
                >
                    <span>Browse Files</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                </button>
                
                <div class="mt-6 text-sm text-primary-500">
                    Supported formats: .txt, .log
                </div>
            {/if}
        </div>
        
        {#if isDragOver}
            <div class="absolute inset-0 bg-primary-500/10 rounded-2xl border-2 border-primary-400 
                        flex items-center justify-center">
                <div class="text-primary-600 font-semibold text-lg">
                    Drop your git log file here
                </div>
            </div>
        {/if}
    </div>
</div>