<template>
  <div class="app-container">
    <h4>
      <span>
        Caching for level 3 and deeper routes is disabled by default. To enable it, please modify this config file:
      </span>
      <el-link
        type="primary"
        href="https://github.com/anthon92/copilot-admin/blob/main/src/router/config.ts"
        target="_blank"
      >
        src/router/config.ts
      </el-link>
    </h4>
    <el-card header="Level 2 Route">
      <router-view />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
h4 {
  display: flex;
  align-items: center;
}

.el-link {
  font-size: 18px;
}
</style>
