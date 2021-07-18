<template lang="pug">
#app
  b-container.vw-100.h-100
    #box
      b-link(href='#/list')
        font-awesome-icon(:icon='["fas", "list"]')
      b-link(href='#/settings')
        font-awesome-icon(:icon='["fas", "music"]')
      b-link#homeIcon(href='#/') POMODORO
    //- 有倒數之類的東西要用 keep-alive 把 router-view 包住, 防止換頁時東西被清掉導致倒數錯誤
  keep-alive
    //- 用 router-view 換頁的時候東西資料會被清掉
    router-view
</template>
