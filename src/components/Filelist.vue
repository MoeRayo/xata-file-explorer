<template>
	<main class="flex flex-wrap items-center justify-between">
		<section
			class="w-33-l w-50-m w-100 h-50"
			v-for="file in files"
			:key="file.id">
			<div
				class="link dt bb b--black-10 pb2 mt2 blue pointer flex items-center">
				<div class="dtc w3">
					<div v-if="file.file.mediaType.toLowerCase().includes('image')">
						<img :src="file.file.url" alt="Uploaded Image" />
					</div>
					<div v-else-if="file.file.mediaType.toLowerCase().includes('pdf')">
						<img
							src="../assets//pdf-placeholder.png"
							alt="pdf placeholder Image" />
					</div>
				</div>
				<div class="dtc v-top pl2">
					<h1 class="f6 f5-ns fw6 lh-title black mv0">File Name:</h1>
					<h2 class="f7 fw4 mt2 mb0 black-60">{{ file.file.name }}</h2>
					<a
						class="bg-purple dib mv2 f7 pa1 br2 pointer black"
						@click="viewFile(file)"
						>View File</a
					>

					<file-viewer-overlay
						v-if="showOverlay"
						ref="goat"
						:fileUrl="overlayFileUrl"
						:fileType="overlayFileType"
						@close-overlay="closeOverlay"
						@download-image="downloadImage"></file-viewer-overlay>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
	import { transformImage } from "@xata.io/client";
	import VuePdfEmbed from "vue-pdf-embed";
	import { getXataClient } from "@/xata";
	import FileViewerOverlay from "@/components/FileViewerOverlay.vue";
	const xata = getXataClient();
	export default {
		data() {
			return {
				files: [],
				showOverlay: false,
				overlayFileUrl: "",
				overlayFileType: "",
				print_progress_percent: 0,
			};
		},
		components: {
			VuePdfEmbed,
			FileViewerOverlay,
		},
		mounted() {
			this.getFilesFromXata();
		},
		methods: {
			async getFilesFromXata() {
				const userId = this.$route.params.id;
				this.files = await xata.db.files
					.filter({ "user.id": userId })
					.getMany();
			},
			viewFile(file) {
				this.overlayFileUrl = file.file.url;
				file.file.mediaType.toLowerCase().includes("image")
					? (this.overlayFileType = "image")
					: (this.overlayFileType = "pdf");
				this.showOverlay = true;
			},

			closeOverlay() {
				this.showOverlay = false;
			},

			downloadImage() {
				const imageToDownload = transformImage(this.overlayFileUrl, {
					download: "image",
					format: "jpeg",
				});
				window.open(imageToDownload, "_blank");
			},
			downloadPDF() {},
		},
	};
</script>
