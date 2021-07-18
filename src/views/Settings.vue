<template lang="pug">
#settings
  b-container.d-flex.justify-content-center.align-items-center
    //- :items='items' :fields='fields' 綁定 items 和 fields 為下面 data() 的 items 和 fields
    //- @row-clicked 是 bootstap-vue 的事件
    b-table(:items='items' :fields='fields' @row-clicked='select' outlined)
      //- 自訂表格內容
      template(#cell(src)='data')
        audio(controls :src='require("../assets/"+data.value)')
      template(#cell(select)='data')
        //- 選到的那個欄位 sound === data.item.src, 會加一個打勾的 icon
        font-awesome-icon(:icon='["fas", "check"]' v-if='sound === data.item.src')
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      // 鈴聲
      items: [
        { name: '鈴聲', src: 'alarm.mp3' },
        { name: 'Yay', src: 'yay.mp3' }
      ],
      // 欄位
      fields: [
        { key: 'name', label: '名稱' },
        { key: 'src', label: '試聽' },
        { key: 'select', label: '選擇' }
      ]
    }
  },
  computed: {
    // 呼叫 VUEX 的 state 的 sound
    // 呼叫 VUEX 的 state 一定要用 computed
    // 呼叫 VUEX 的東西可以直接用 this.$store.state, 若從 VUEX 呼叫的資料要經過處理可以用 this.$store.getters
    sound () {
      return this.$store.state.sound
    }
  },
  methods: {
    // this.$store.commit('selectSound', item.src) 呼叫 VUEX 的 mutations 裡的 selectSound 然後把值 item.src 代進去,代進去後 item.src 就會是 VUEX 的 mutations 裡 selectSound (state, data) 的 data
    select (item) {
      this.$store.commit('selectSound', item.src)
    }
  }
}
</script>
