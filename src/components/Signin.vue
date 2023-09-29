<template>
	<form
		class="ba f6 b--white bw4 bg-black dark-pink br2 center pa3 shadow-5"
		@submit.prevent="signIn">
		<h2 class="ttc tc">Sign In</h2>

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
			class="f7 center db pv2 ph3 mb3 tracked bg-black ba br3 white pointer hover-black hover-bg-dark-pink bg-animate pointer">
			Sign in
		</button>
		<p>
			Don't have an account?
			<a @click="goToSignUp" class="white b f7 pointer">Sign up</a>
		</p>
	</form>
</template>

<script>
	import { getXataClient } from "@/xata";

	export default {
		name: "Signin",
		data: () => ({
			email: "",
			password: "",
		}),
		methods: {
			goToSignUp() {
				this.$emit("go-to-sign-up");
			},
			async signIn() {
				const xata = getXataClient();
				const user = await xata.db.users.filter("email", this.email).getFirst();
				if (!this.email || !this.password) {
					this.$notify({ type: "error", text: "Please fill all empty fields" });
				} else if (
					this.email !== user.email ||
					this.password !== user.password
				) {
					this.$notify({ type: "error", text: "Incorrect credentials" });
					this.email = "";
					this.password = "";
				} else {
					this.$router.push({
						name: "dashboard",
						params: { id: user.id },
					});
					this.$notify({ type: "success", text: "Login successful!" });
				}
			},
		},
	};
</script>
