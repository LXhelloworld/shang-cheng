// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Lazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll';
import {currency } from "./util/currency";
import Vuex from "vuex";

Vue.use(Vuex);
Vue.use(infiniteScroll);

Vue.config.productionTip = false;

Vue.use(Lazyload,{
  loading:"/static/loading-svg/loading-balls.svg"
});
Vue.filter("currency",currency);

const store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName = nickName.userName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount
    }
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
