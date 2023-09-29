<template>
	<div class="bg-light-purple vh-100 dt w-100 helvetica pv2 ph3">
		<div class="flex justify-between items-center">
			<h1 class="ttc">Xata File Explorer</h1>
			<span class="b db underline-hover pointer" @click="signOut"
				>Sign out</span
			>
		</div>
		<Uploader />
		<Filelist />
	</div>
</template>

<script>
	import Uploader from "@/components/Uploader.vue";
	import Filelist from "@/components/Filelist.vue";

	export default {
		components: {
			Uploader,
			Filelist,
		},

		methods: {
			signOut() {
				this.$router.push({ name: "home" });
				this.$route.params.id = "";
				this.$notify({ type: "success", text: "User logged out!" });
			},
		},
	};
</script>
