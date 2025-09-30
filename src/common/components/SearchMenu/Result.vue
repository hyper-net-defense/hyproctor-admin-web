<script lang="ts" setup>
import type { RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router';

interface Props {
  data: RouteRecordRaw[];
  isPressUpOrDown: boolean;
}

const props = defineProps<Props>();

/** Selected menu */
const modelValue = defineModel<RouteRecordNameGeneric | undefined>({ required: true });

const instance = getCurrentInstance();

const scrollbarHeight = ref<number>(0);

/** Menu style */
function itemStyle(item: RouteRecordRaw) {
  const flag = item.name === modelValue.value;
  return {
    background: flag ? 'var(--el-color-primary)' : '',
    color: flag ? '#ffffff' : ''
  };
}

/** Mouse enter */
function handleMouseenter(item: RouteRecordRaw) {
  // If up or down key and mouseenter event take effect simultaneously, the up and down keys take precedence, and this function's assignment logic is not executed
  if (props.isPressUpOrDown) return;
  modelValue.value = item.name;
}

/** Calculate scrollable area height */
function getScrollbarHeight() {
  // el-scrollbar max-height="40vh"
  scrollbarHeight.value = Number((window.innerHeight * 0.4).toFixed(1));
}

/** Calculate distance from top based on index */
function getScrollTop(index: number) {
  const currentInstance = instance?.proxy?.$refs[`resultItemRef${index}`] as HTMLDivElement[];
  if (!currentInstance) return 0;
  const currentRef = currentInstance[0];
  // 128 = two result-items (56 + 56 = 112) height plus top and bottom margin (8 + 8 = 16)
  const scrollTop = currentRef.offsetTop + 128;
  return scrollTop > scrollbarHeight.value ? scrollTop - scrollbarHeight.value : 0;
}

// Add window resize event listener before component mounting
onBeforeMount(() => {
  window.addEventListener('resize', getScrollbarHeight);
});

// Calculate scrollable area height immediately after component mounting
onMounted(() => {
  getScrollbarHeight();
});

// Remove window resize event listener before component unmounting
onBeforeUnmount(() => {
  window.removeEventListener('resize', getScrollbarHeight);
});

defineExpose({ getScrollTop });
</script>

<template>
  <!-- Outer div cannot be deleted, it is used to receive parent component click events -->
  <div>
    <div
      v-for="(item, index) in props.data"
      :key="index"
      :ref="`resultItemRef${index}`"
      class="result-item"
      :style="itemStyle(item)"
      @mouseenter="handleMouseenter(item)"
    >
      <SvgIcon v-if="item.meta?.svgIcon" :name="item.meta.svgIcon" class="svg-icon" />
      <component v-else-if="item.meta?.elIcon" :is="item.meta.elIcon" class="el-icon" />
      <span class="result-item-title">
        {{ item.meta?.title }}
      </span>
      <SvgIcon v-if="modelValue && modelValue === item.name" name="keyboard-enter" class="svg-icon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@@/assets/styles/mixins.scss';

.result-item {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 15px;
  margin-bottom: 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  .svg-icon {
    min-width: 1em;
    font-size: 18px;
  }
  .el-icon {
    width: 1em;
    font-size: 18px;
  }
  &-title {
    flex: 1;
    margin-left: 12px;
    @extend %ellipsis;
  }
}
</style>
