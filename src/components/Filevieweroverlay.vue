<template>
	<div class="overlay">
		<!-- Overlay content -->
		<div class="overlay-content">
			<!-- Close button -->

			<span
				class="close-button f3 bg-dark-pink white b h1 w1 br3 pa2 center auto flex items-center dim pointer"
				@click="closeOverlay"
				>X</span
			>
			<div v-if="fileType === 'image'">
				<img :src="fileUrl" alt="File" />
				<img
					@click="downloadImage"
					src="../assets/icon_download.svg"
					class="bg-dark-pink pa2 flex items-center br2 white download-button dim" />
			</div>
			<div v-else-if="fileType === 'pdf'">
				<a ref="downloadLink" @click="downloadPdf(fileUrl)">
					<img
						src="../assets/icon_download.svg"
						class="bg-dark-pink pa2 flex items-center br2 white download-button dim" />
				</a>

				<vue-pdf-embed :source="fileUrl" />
			</div>
		</div>
	</div>
</template>

<script>
	import VuePdfEmbed from "vue-pdf-embed";
	export default {
		props: {
			fileUrl: String,
			fileType: String,
		},

		components: {
			VuePdfEmbed,
		},
		methods: {
			closeOverlay() {
				this.$emit("close-overlay");
			},
			downloadImage() {
				this.$emit("download-image");
			},

			async downloadPdf(file) {
				try {
					const response = await this.axios.get(file, {
						responseType: "blob", // Set the response type to 'blob' for binary data
					});

					const blob = new Blob([response.data], { type: "application/pdf" });

					const url = window.URL.createObjectURL(blob);

					const link = document.createElement("a");
					link.href = url;
					link.download = "downloaded.pdf"; // Set the desired file name

					link.click();

					window.URL.revokeObjectURL(url);
				} catch (error) {
					console.error("Error downloading PDF:", error);
				}
			},
		},
	};
</script>

<style scoped>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.overlay-content {
		background: #fff;
		padding: 20px;
		max-width: 80%;
		max-height: 80%;
		overflow: auto;
	}

	.close-button {
		position: absolute;
		top: 25px;
		right: 30px;
	}
	.download-button {
		position: absolute;
		top: 25px;
		left: 30px;
	}
</style>
