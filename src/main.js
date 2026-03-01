import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
/* 拆分为两处 import，避免 index.scss 单次编译 Element 全量主题导致 heap OOM */
import "./assets/css/element-theme.scss";
import "./assets/css/app.scss";
import enLang from "element-ui/lib/locale/lang/en"; // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

Vue.use(ElementUI, {
  size: "small",
  locale: enLang,
});

import "./utils/utils.js";

const dayjs = require("dayjs");
Vue.prototype.$dayjs = dayjs;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
