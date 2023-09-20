import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import dict from './modules/dict'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    dict,
    user,
    tagsView,
    permission,
    settings
  },
  getters,
  state: {
    permissions: false,
    url: '',
    //ws参数
    path: '',
    ws: null,//建立的连接
    lockReconnect: false,//是否真正建立连接
    timeout: 58*10000,//58秒一次心跳
    timeoutObj: null,//心跳心跳倒计时
    serverTimeoutObj: null,//心跳倒计时
    timeoutnum: null,//断开 重连倒计时

  }
})

export default store
