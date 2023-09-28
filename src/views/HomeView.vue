<template>
	<header class="vh-100 bg-light-pink dt w-100 helvetica">
		<div class="background-container dtc v-mid cover ph3 ph4-m ph5-l">
			<div class="flex justify-around">
				<div>
					<h1 class="f2 f-subheadline-l measure lh-title nb1 fw9 white">
						Xata File Explorer
					</h1>
					<h2 class="f6 fw6 white">
						Storing and managing files made easy with Xata (File Attachments)
					</h2>
				</div>
				<div class="mv2">
					<div v-if="userHasAccount">
						<Signin @go-to-sign-up="switchToSignUp" />
					</div>
					<div v-else>
						<Signup @user-has-account="handleUserHasAccount" />
					</div>
				</div>
			</div>
		</div>
	</header>
</template>
<script>
	import Signin from "@/components/Signin.vue";
	import Signup from "@/components/Signup.vue";

	export default {
		components: {
			Signin,
			Signup,
		},
		data() {
			return {
				userHasAccount: false,
			};
		},
		methods: {
			handleUserHasAccount(value) {
				this.userHasAccount = value;
			},
			switchToSignUp() {
				this.userHasAccount = false;
			},
		},
	};
</script>

<style>
	.background-container {
		background-image: url("../assets/tamanna-rumee-QR56LDZADZ4-unsplash.jpg");
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
	}
</style>
