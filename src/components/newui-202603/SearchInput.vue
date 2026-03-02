<template>
  <component
    :is="inputComponent"
    :value="value"
    :placeholder="placeholder"
    :fetch-suggestions="fetchSuggestions"
    :debounce="debounce"
    :clearable="clearable"
    class="search-input"
    v-bind="$attrs"
    v-on="inputListeners"
  >
    <template slot="prefix">
      <img
        src="@/assets/icons/newicon-2026/Search.png"
        alt="Search"
        class="search-prefix-icon"
      />
    </template>
  </component>
</template>

<script>
export default {
  name: 'SearchInput',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Search',
    },
    /** 是否可清空 */
    clearable: {
      type: Boolean,
      default: false,
    },
    /** 异步获取建议（传入则渲染为 el-autocomplete） */
    fetchSuggestions: {
      type: Function,
      default: null,
    },
    /** 自动完成防抖毫秒数 */
    debounce: {
      type: Number,
      default: 500,
    },
  },
  computed: {
    inputComponent() {
      return this.fetchSuggestions ? 'el-autocomplete' : 'el-input';
    },
    inputListeners() {
      const vm = this;
      return {
        ...this.$listeners,
        input(val) {
          vm.$emit('input', val);
        },
        select(...args) {
          vm.$emit('select', ...args);
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  width: 100%;

  // 去掉聚焦时的边框颜色和阴影
  ::v-deep .el-input__inner {
    &:focus {
      outline: none;
      box-shadow: none !important;
      border-color: transparent;
    }
  }

  // 去掉 autocomplete 的聚焦样式
  ::v-deep .el-autocomplete-suggestion {
    &.is-focused {
      box-shadow: none;
    }
  }

  ::v-deep .el-input.is-active .el-input__inner,
  ::v-deep .el-input__inner:focus {
    box-shadow: none !important;
    border-color: rgb(220, 223, 230);
  }
}

.search-prefix-icon {
  width: 15px;
  height: 15px;
  object-fit: contain;
  display: block;
}

// 搜索图标在 input 内水平、垂直居中，整体向右偏移 10px
::v-deep .el-input__prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  left: 10px;
}
</style>
