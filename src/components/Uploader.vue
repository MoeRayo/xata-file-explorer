<template>
	<div class="flex flex-column flex-row-ns pa3 calisto bg-black-05">
		<div class="w-100 ph3">
			<form enctype="multipart/form-data" v-if="isInitial || isSaving">
				<h2>Upload File</h2>
				<div
					class="b--dashed bw1 b--light-purple pa3 hover-bg-black-10 bg-animate pointer relative h4">
					<input
						type="file"
						accept="image/*,application/pdf"
						:name="uploadFieldName"
						:disabled="isSaving"
						@change="filesChange($event.target.name, $event.target.files)"
						class="input-file absolute w-100 h4 pointer o-0" />
					<p v-if="isInitial" class="tc f4">
						Drag your file here to begin<br />
						or click to browse
					</p>
					<p v-if="isSaving" class="tc f4">Uploading file...</p>
				</div>
			</form>
			<!--upload successful-->
			<div v-if="isSuccess" class="flex justify-between">
				<div class="w-50-m w-100">
					<h2>File upload is successful.</h2>
					<button
						@click.prevent="reset()"
						class="bg-light-purple pa3 mv4 link dim br2 pointer ba b--light-blue dib white">
						Upload again
					</button>
				</div>

				<div class="w-50-m w-100">
					<div v-if="metaData.toLowerCase().includes('image')">
						<img :src="fileURL" alt="Uploaded Image" />
					</div>
					<div v-else-if="metaData.toLowerCase().includes('pdf')">
						<vue-pdf-embed :source="fileURL" />
						<!-- <vue-pdf-app style="height: 50vh" :pdf="fileURL"></vue-pdf-app> -->
					</div>
					<div v-else>
						<p>Unsupported file type.</p>
					</div>
				</div>
			</div>
			<!--upload failed-->
			<div v-if="isFailed">
				<h2>Uploaded failed.</h2>
				<button @click.prevent="reset()">Try again</button>
				<pre>{{ uploadError }}</pre>
			</div>
		</div>
	</div>
</template>

<script>
	import VuePdfEmbed from "vue-pdf-embed";

	import { upload } from "@/utils/file-upload.service.js";
	import { getXataClient } from "@/xata";
	const xata = getXataClient();

	const STATUS_INITIAL = 0,
		STATUS_SAVING = 1,
		STATUS_SUCCESS = 2,
		STATUS_FAILED = 3;

	export default {
		data() {
			return {
				uploadedFiles: [],
				uploadError: null,
				currentStatus: null,
				uploadFieldName: "photos",
				detectedText: "",
				shareText: "Copy Text",
				fileDataObject: {},
				metaData: "",
				fileName: "",
				userData: {},
				fileURL: "",
			};
		},
		components: {
			VuePdfEmbed,
		},
		computed: {
			isInitial() {
				return this.currentStatus === STATUS_INITIAL;
			},
			isSaving() {
				return this.currentStatus === STATUS_SAVING;
			},
			isSuccess() {
				return this.currentStatus === STATUS_SUCCESS;
			},
			isFailed() {
				return this.currentStatus === STATUS_FAILED;
			},
		},
		methods: {
			reset() {
				// reset form to initial state
				this.currentStatus = STATUS_INITIAL;
				this.uploadedFiles = [];
				this.uploadError = null;
			},
			save(formData) {
				// upload data to the server
				this.currentStatus = STATUS_SAVING;
				upload(formData)
					.then((x) => {
						this.uploadedFiles = [].concat(x);
						this.uploadFileToXata();
						this.currentStatus = STATUS_SUCCESS;
					})
					.catch((err) => {
						this.uploadError = err.response;
						this.currentStatus = STATUS_FAILED;
					});
			},
			filesChange(fieldName, fileList) {
				// handle file changes
				const formData = new FormData();
				if (!fileList.length) return;
				// append the files to FormData
				Array.from(Array(fileList.length).keys()).map((x) => {
					formData.append(fieldName, fileList[x], fileList[x].name);
				});
				// save it
				this.save(formData);
			},
			prepareFormData() {
				const parts = this.uploadedFiles[0].id.split(",");

				const metaDataMatch = parts[0].match(/^data:(.*?);base64/);
				this.metaData = metaDataMatch[1];
				const base64Data = parts[1];
				this.fileDataObject = {
					mediaType: this.metaData,
					base64Content: base64Data,
					name: this.uploadedFiles[0].fileName,

					enablePublicUrl: true,
				};
			},
			async uploadFileToXata() {
				this.prepareFormData();
				await xata.db.files
					.create({
						file: this.fileDataObject,
						file_name: this.uploadedFiles[0].fileName,
						user: this.$route.params.id,
					})
					.then((res) => {
						this.fileDataObject = [];
						this.fileURL = res.file.url;
						this.fileName = res.file.name;
						this.recordId = res.id;
						this.$notify({ type: "success", text: "Image uploaded!" });
					})
					.catch(() => {
						this.$notify({ type: "error", text: "Uploading failed!" });
					});
			},
		},
		mounted() {
			this.reset();
		},
	};
</script>
