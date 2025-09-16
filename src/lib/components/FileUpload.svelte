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

        function triggerFileDialog(event) {
                event.stopPropagation();
                openFileDialog();
        }
</script>

<div class="relative">
	<input
		type="file"
		accept=".txt,.log"
		bind:this={fileInput}
                onchange={handleFileSelect}
		class="hidden"
	/>

	<div
		class="glass-accent rounded-2xl border-2 border-dashed transition-all duration-300 ease-out
               {isDragOver
			? 'scale-105 border-primary-400 bg-primary-50/20'
			: 'border-primary-300/50 hover:border-primary-400/70 hover:bg-primary-50/10'}"
                ondragover={handleDragOver}
                ondragleave={handleDragLeave}
                ondrop={handleDrop}
		role="button"
		tabindex="0"
                onclick={openFileDialog}
                onkeydown={(e) => e.key === 'Enter' && openFileDialog()}
	>
		<div class="p-12 text-center">
			{#if fileName}
				<div class="mb-6">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center
                                rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-2xl text-white"
					>
						📄
					</div>
					<h3 class="mb-2 text-xl font-semibold text-primary-800">File Loaded Successfully</h3>
					<p class="font-medium text-primary-600">{fileName}</p>
				</div>

                                <button
                                        onclick={triggerFileDialog}
					class="transform rounded-xl bg-gradient-to-r from-primary-500 to-primary-600
                           px-6 py-3 font-medium text-white shadow-lg
                           transition-all duration-200 hover:scale-105 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl"
				>
					Choose Different File
				</button>
			{:else}
				<div class="mb-6">
					<div
						class="mx-auto mb-6 flex h-20 w-20 items-center justify-center
                                rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/30 text-3xl text-primary-500"
					>
						📁
					</div>
					<h3 class="mb-3 text-2xl font-bold text-primary-300">Upload Git Log File</h3>
					<p class="mx-auto mb-6 max-w-md leading-relaxed text-primary-200">
						Drag and drop your git log file here, or click to browse. We'll analyze your commit
						history and show you beautiful insights.
					</p>
				</div>

				<button
					class="inline-flex transform items-center gap-3 rounded-xl
                           bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4
                           font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105
                           hover:from-primary-600 hover:to-primary-700 hover:shadow-xl"
				>
					<span>Browse Files</span>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
				</button>

				<div class="mt-6 text-sm text-primary-500">Supported formats: .txt, .log</div>
			{/if}
		</div>

		{#if isDragOver}
			<div
				class="absolute inset-0 flex items-center justify-center rounded-2xl
                        border-2 border-primary-400 bg-primary-500/10"
			>
				<div class="text-lg font-semibold text-primary-600">Drop your git log file here</div>
			</div>
		{/if}
	</div>
</div>
