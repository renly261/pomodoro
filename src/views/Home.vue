<template lang="pug">
#home
  b-container.w-100
    b-row.w-100
      //- 新增按鈕
      b-col.w-100.d-flex(cols='12')
        b-form-input.w-50(v-model='newitem' :state='state' trim @keydown.enter='additem' placeholder='ADD A NEW MISSION')
        b-btn#plus(variant='primary' @click='additem') +
      //- 目前進行中的東西及剩餘時間
      b-col#nowShow(cols='12')
        //- 目前顯示的東西
        h1 {{ currentText }}
        //- 目前倒數剩餘時間
        h2 {{ timeText }}
      //- 待辦清單
      b-col(cols='12')
        b-table(:items='list' :fields='listfields')
          template(#cell(name)='data')
            b-form-input(
              v-if='data.item.edit'
              v-model='data.item.model'
              trim
              :state='data.item.state'
              @keydown.enter='changelist(data.index)'
              @keydown.esc='cancellist(data.index)'
            )
            span(v-else) {{ data.value }}
          template(#cell(action)='data')
            //- 如果不是編輯狀態
            span(v-if='!data.item.edit')
              //- 如果不是編輯狀態, 顯示編輯按鈕
              //- @click='editlist(data.index)', data.index 編輯陣列裡第幾筆資料, 點下去執行 methods => editlist
              b-btn(@click='editlist(data.index)' variant='success')
                font-awesome-icon(:icon='["fas", "pen"]')
              //- 如果不是編輯狀態, 顯示刪除按鈕
              b-btn(@click='dellist(data.index)' variant='danger')
                font-awesome-icon(:icon='["fas", "trash"]')
            //-  如果是編輯狀態
            span(v-else)
              //- 如果是編輯狀態, 顯示確認編輯按鈕
              b-btn(@click='changelist(data.index)' variant='success')
                font-awesome-icon(:icon='["fas", "check"]')
              //- 如果是編輯狀態, 顯示取消編輯按鈕
              b-btn(@click='cancellist(data.index)' variant='danger')
                font-awesome-icon(:icon='["fas", "undo"]')
      //- 按鈕
      b-col(cols='12')
        #circle
          //- 若下面 computed 的 status() 呼叫 VUEX 的 this.$store.state.status !== 1, 顯示開始按鈕
          b-btn#start(variant='primary' v-if='status !== 1' @click='start')
            font-awesome-icon(:icon='["fas", "play"]')
          //- 若下面 computed 的 status() 呼叫 VUEX 的 this.$store.state.status === 1, 顯示暫停按鈕
          b-btn#pause(variant='primary' v-if='status === 1' @click='pause')
            font-awesome-icon(:icon='["fas", "pause"]')
          //- 若下面 computed 的 status() 呼叫 VUEX 的 this.$store.state.current > 0, 顯示跳過按鈕
          //- 代一個參數 true 或 false 進去判斷是時間到的 finish 還是跳過的 finish
          b-btn#skip(variant='primary' v-if='current.length > 0' @click='finish(true)')
            font-awesome-icon(:icon='["fas", "step-forward"]')
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // setIterval
      timer: 0,
      newitem: '',
      listfields: [
        { key: 'name', label: '' },
        { key: 'action', label: '' }
      ]
    }
  },
  computed: {
    status () {
      return this.$store.state.status
    },
    list () {
      return this.$store.state.list
    },
    current () {
      return this.$store.state.current
    },
    // 目前倒數的東西
    currentText () {
      let text = this.current
      // 如果目前沒有顯示東西
      if (text.length === 0) {
        // 如果目前沒有顯示東西, 如果目前待辦清單也是空的
        if (this.list.length === 0) {
          // 目前顯示沒有事項
          text = '沒有事項'
          // 如果目前沒有顯示東西, 如果待辦清單有東西
        } else {
          text = '點擊開始'
        }
      }
      return text
    },
    // 倒數計時剩幾秒的資料存在 VUEX, 呼叫 VUEX => state => timeleft
    timeleft () {
      return this.$store.state.timeleft
    },
    // 顯示倒數時間
    timeText () {
      // Math.floor() 無條件捨去
      // 目前剩幾分鐘
      const m = Math.floor(this.timeleft / 60)
      // 除以 60 取餘數, 目前剩幾秒
      const s = Math.floor(this.timeleft % 60)
      // 把分秒組成字串顯示
      return `${m} : ${s}`
    },
    state () {
      // 若沒有新增東西進去
      if (this.newitem.length === 0) {
        return null
        // 若新增的東西 < 2個字
      } else if (this.newitem.length < 2) {
        return false
        // 若新增的東西 > 2個字
      } else {
        return true
      }
    }
  },
  methods: {
    // 暫停
    pause () {
      // 暫停倒數
      clearInterval(this.timer)
      // 將 VUEX 的 this.$store.state.status 改成 2 (暫停)
      this.$store.commit('changeStatus', 2)
    },
    // 開始倒數
    start () {
      // 若 computed => status() 呼叫 VUEX 的 this.$store.state.status !== 2 (暫停), 且清單裡面有東西
      if (this.status !== 2 && this.list.length > 0) {
        // 呼叫 VUEX => start
        this.$store.commit('start')
      }
      // 若 current 目前顯示有東西
      if (this.current.length > 0) {
        // 將 VUEX => changeStatus (state, data) {state.status = data} 的 data 改為 1 (倒數中)
        this.$store.commit('changeStatus', 1)
        // 倒數
        this.timer = setInterval(() => {
          // 呼叫 VUEX => countdown (state) {state.timeleft--}, 每過一秒 VUEX state.timeleft -1
          this.$store.commit('countdown')
          if (this.timeleft <= -1) {
            // 自然倒數結束, 非跳過
            this.finish(false)
          }
        }, 1000)
      }
    },
    // 跳過, 非自然倒數結束
    finish (skip) {
      // 暫停倒數
      clearInterval(this.timer)
      // 將 VUEX => changeStatus (state, data) {state.status = data} 的 data 改為 0
      this.$store.commit('changeStatus', 0)
      this.$store.commit('addFinish')

      // 若自然倒數結束
      if (!skip) {
        // 播放音效
        const audio = new Audio()
        audio.src = require('../assets/' + this.$store.state.sound)
        audio.play()
      }

      // 若結束後清單還有東西
      if (this.list.length > 0) {
        // 繼續倒數
        this.start()
        // 若結束後清單沒有東西
      } else {
        // 顯示結束
        this.$swal({
          icon: 'success',
          title: '結束'
        })
      }
    },
    // 新增東西
    additem () {
      if (this.state) {
        // 呼叫 VUEX => mutations => addList (state, data), data 就是這邊的 this.newitem
        // 呼叫 VUEX 的 mutations 然後把資料傳進去
        this.$store.commit('addList', this.newitem)
        // 新增完後清空內容, 方便下一次新增
        this.newitem = ''
      } else {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '必須要兩個字以上'
        })
      }
    },
    editlist (index) {
      // 要把 VUEX => state => edit 改為 true, 但 VUEX 的東西不能直接修改, 要在 VUEX => mutations 改完後再呼叫進 views
      this.$store.commit('editList', index)
    },
    // 確認編輯
    changelist (index) {
      console.log(index)
      // 先驗證東西對不對, 如果 state 過才做修改, 一樣是呼叫 VUEX => changeList
      if (this.list[index].state) {
        this.$store.commit('changeList', index)
      }
    },
    // 取消編輯
    cancellist (index) {
      // 呼叫 VUEX => cancelList
      this.$store.commit('cancelList', index)
    },
    // 刪除清單
    // 呼叫 VUEX => delList
    dellist (index) {
      this.$store.commit('delList', index)
    }
  }
}
</script>
