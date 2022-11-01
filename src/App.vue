<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
html, body,#app {
  width: 100%;
  height: 100%;
}
div,
p,
span {
  font-family: 宋黑, 'Times New Roman', Times, serif !important;
}
.flex-height-center {
  align-items: center;
}
.iconfont {
  color: $global-color;
}
</style>
