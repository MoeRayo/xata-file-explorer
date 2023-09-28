<template>
	<form
		@submit.prevent="signUp"
		class="ba b--white dark-pink bw4 bg-black br2 mw6 center pv2 ph4 shadow-5 f6">
		<h2 class="ttc tc">Sign Up</h2>

		<label for="name" class="db mb2">Username</label>
		<input
			id="username"
			v-model="username"
			name="username"
			type="text"
			class="db mb3 w-100 br2 pa2 ba bw1 b--black"
			placeholder="John Doe" />

		<label for="email" class="db mb2">Email</label>
		<input
			id="email"
			v-model="email"
			name="email"
			type="email"
			class="db mb3 w-100 br2 pa2 ba bw1 b--black"
			placeholder="example@email.com" />

		<label for="password" class="db mb2">Password</label>
		<input
			id="password"
			v-model="password"
			name="password"
			type="password"
			class="db mb3 w-100 br2 pa2 ba bw1 b--black"
			placeholder="••••••••" />

		<button
			type="submit"
			class="center db pv2 ph3 mb3 tracked bg-black ba br3 white hover-black hover-bg-dark-pink bg-animate pointer f7">
			Sign up
		</button>
		<p class="f7">
			Already have an account?
			<a @click="switchToSignin" class="white pointer b">Sign in</a>
			<!-- johndoe13 -->
		</p>
	</form>
</template>

<script>
	import { getXataClient } from "@/xata";

	export default {
		name: "Signup",
		data: () => ({
			username: "",
			email: "",
			password: "",
		}),
		methods: {
			switchToSignin() {
				this.$emit("user-has-account", true);
			},
			async signUp() {
				const xata = getXataClient();

				const user = await xata.db.users.filter("email", this.email).getFirst();
				if (!user) {
					await xata.db.users
						.create({
							username: this.username,
							password: this.password,
							email: this.email,
						})
						.then((res) => {
							this.$router.push({
								path: `/dashboard/${res.username}`,
							});
							this.$notify({
								type: "success",
								text: "Account creation successful!",
							});
						});
				}
			},
		},
	};
</script>
