import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "tachyons/css/tachyons.css";
import Notifications from "@kyvg/vue3-notification";

const app = createApp(App);

app.use(Notifications);
app.use(router);
app.mount("#app");
