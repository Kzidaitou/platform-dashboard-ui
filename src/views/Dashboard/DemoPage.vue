<script setup lang="ts">
import { ElCard, ElSkeleton } from 'element-plus'
import { ref } from 'vue'

const loading = ref(true)

const getAllApi = async () => {
  await Promise.all([])
  loading.value = false
}

getAllApi()
</script>

<template>
  <div class="dkContainer">
    <ElCard shadow="hover">
      <ElSkeleton :loading="loading" animated> 案例 </ElSkeleton>
    </ElCard>
  </div>
</template>

<style lang="less" scoped>
.dkContainer {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
