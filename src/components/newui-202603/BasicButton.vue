<template>
  <el-button
    :type="validType"
    :size="size"
    :class="{ 'basic-button--text': validType === 'text' }"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </el-button>
</template>

<script>
const TYPES = ['info', 'primary', 'text'];

export default {
  name: 'BasicButton',
  inheritAttrs: false,
  props: {
    /** 按钮类型：info | primary | text */
    type: {
      type: String,
      default: 'primary',
      validator: (v) => TYPES.includes(v),
    },
    size: {
      type: String,
      default: 'small',
    },
  },
  computed: {
    validType() {
      return TYPES.includes(this.type) ? this.type : 'primary';
    },
  },
};
</script>

<style lang="scss" scoped>
.basic-button--text {
  color: #007855;

  &:hover,
  &:focus {
    color: #009966;
  }
}
</style>
