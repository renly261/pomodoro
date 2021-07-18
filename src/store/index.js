import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const time = parseInt(process.env.VUE_APP_TIME)
const timeBreak = parseInt(process.env.VUE_APP_TIME_BREAK)

Vue.use(Vuex)

export default new Vuex.Store({
  //! VUEX 的東西在不同頁面之間都可以共享資料, 用法是在 state 裡面定義你要存那些資料, 在下面 mutations 去改他
  //! 改完後 views 要直接呼叫 state 的東西的話要在 computed: funciton () { return this.$store.state.state 裡你要呼叫的東西 },
  //! 若是要呼叫 mutations 的東西要在 methods: funciotn () { this.$store.commit('你要呼叫的 mutations 的 funciton', 你要帶進去的東西) }
  // VUEX 存的東西和變數, 也就是你要儲存那些資料全部寫在這裡, 在下面用 mutations 修改資料, 在 views 呼叫後在各個分頁使用
  // 在 VUEX 宣告後要在 views 用 computed 引用 VUEX
  state: {
    sound: 'alarm.mp3',
    // 待辦清單
    list: [],
    // 完成的清單
    finished: [],
    // 目前顯示的東西
    current: '',
    // 剩餘時間
    timeleft: time,
    // 是否休息的狀態
    isBreak: false,
    // 0 = 停止
    // 1 = 倒數中
    // 2 = 暫停
    status: 0
  },
  // 修改 VUEX 用的 function 一定要用 mutations, VUEX 的資料不能用 = 或直接修改
  mutations: {
    // state 是上面的 state, data 是要丟進來這個 function 的東西, data 就是 Settings.vue 裡 methods 的 select function this.$store.commit('selectSound', item.src) 裡面的 item.src
    // 寫完後要在 Settings.vue 裡的 methods 寫一個 function 搭配, 最後在 b-table 加上點擊事件 @row-clicked='select', select 是 methods 裡寫的 function
    selectSound (state, data) {
      state.sound = data
    },
    // state 是上面的 state, data 是 List.vue 裡 methods 裡 additem function this.$store.commit('addList', this.newitem) 的 this.newitem
    addList (state, data) {
      state.list.push({
        name: data,
        // 預設編輯關閉, 下面 VUEX editList function 先將 false 改為 true, 當點編輯按鈕時執行 List.vue 呼叫 VUEX => methods => methods 的 editlist function, this.$store.commit('editList', index)
        edit: false,
        model: data
      })
    },
    editList (state, data) {
      // 將上面的 state.list[data].edit 改成 true
      state.list[data].edit = true
    },
    changeList (state, data) {
      state.list[data].name = state.list[data].model
      state.list[data].edit = false
    },
    cancelList (state, data) {
      state.list[data].model = state.list[data].name
      state.list[data].edit = false
    },
    delList (state, data) {
      state.list.splice(data, 1)
    },
    start (state) {
      // 若是休息狀態
      if (state.isBreak) {
        // 目前顯示休息一下
        state.current = '休息一下'
        // 若是倒數狀態
      } else {
        // 目前顯示清單名稱
        state.current = state.list.shift().name
      }
    },
    // 修改上面的 status
    changeStatus (state, data) {
      state.status = data
    },
    // 修改上面的 timeleft
    countdown (state) {
      state.timeleft--
    },
    addFinish (state) {
      // 若不是休息時間
      if (!state.isBreak) {
        // 把目前顯示的東西塞進已完成清單
        state.finished.push(state.current)
      }
      // 目前顯示的東西清空
      state.current = ''
      // 若清單有東西, 才去判斷是否進休息時間
      if (state.list.length > 0) {
        // 番茄鐘25分鐘工作5分鐘休息, 若現在是休息時間下一次倒數就不是休息時間, 若現在不是休息時間下一次就是休息時間
        state.isBreak = !state.isBreak
      }
      // 若是休息狀態的話 state.timeleft = timeBreak, else state.timeleft = time
      state.timeleft = state.isBreak ? timeBreak : time
    },
    delFinish (state, data) {
      // 將完成的清單的第一筆刪掉
      state.finished.splice(data, 1)
    }
  },
  // 若在 views 裡呼叫 VUEX 的東西需要經過處裡的話用 gatters
  getters: {
    list (state) {
      return state.list
    }
  },
  // 改 VUEX 的東西, 但可支援非同步 ajax async await
  actions: {
  },
  // 把 VUEX 的資料拆成一個一個的模組, 例如把 state mutations actions 分別寫在 引用進 modules
  modules: {
  },
  // npm i vuex-persistedstate@3
  // 將 VUEX 的東西儲存在 localstorage
  // key 要自己改
  plugins: [
    createPersistedState({
      key: 'pomodoro'
    })
  ]
})
