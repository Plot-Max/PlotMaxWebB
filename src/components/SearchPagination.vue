<template>
  <div class="search-pagination">
    <span class="pagination-summary">{{ summaryText }}</span>
    <div class="pagination-nav">
      <button
        type="button"
        class="nav-btn prev"
        :disabled="currentPage <= 1"
        @click="goPrev"
      >
        Previous
      </button>
      <template v-for="p in pageList">
        <button
          v-if="p !== -1"
          :key="p"
          type="button"
          class="nav-btn page"
          :class="{ active: p === currentPage }"
          @click="goPage(p)"
        >
          {{ p }}
        </button>
        <span v-else :key="'ellipsis-' + p" class="ellipsis">...</span>
      </template>
      <button
        type="button"
        class="nav-btn next"
        :disabled="currentPage >= totalPages"
        @click="goNext"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
/**
 * 分页组件：左侧 "Showing x-y of z results"，右侧 Previous + 页码 + Next
 * 接口与 el-pagination 的 current-change 一致：@current-change(pageNum)
 */
export default {
  name: "SearchPagination",
  props: {
    total: { type: Number, default: 0 },
    currentPage: { type: Number, default: 1 },
    pageSize: { type: Number, default: 20 },
    /** 最多展示的页码按钮数（不含 prev/next） */
    pagerCount: { type: Number, default: 5 },
  },
  computed: {
    totalPages() {
      if (this.pageSize <= 0) return 0;
      return Math.max(1, Math.ceil(this.total / this.pageSize));
    },
    summaryText() {
      const total = this.total || 0;
      if (total === 0) return "Showing 0 of 0 results";
      const start = (this.currentPage - 1) * this.pageSize + 1;
      const end = Math.min(this.currentPage * this.pageSize, total);
      return `Showing ${start}-${end} of ${total} results`;
    },
    pageList() {
      const total = this.totalPages;
      const cur = this.currentPage;
      const count = this.pagerCount;
      if (total <= count) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      const half = Math.floor(count / 2);
      let left = Math.max(1, cur - half);
      let right = Math.min(total, left + count - 1);
      if (right - left + 1 < count) {
        left = Math.max(1, right - count + 1);
      }
      const list = [];
      if (left > 1) {
        list.push(1);
        if (left > 2) list.push(-1);
      }
      for (let i = left; i <= right; i++) list.push(i);
      if (right < total) {
        if (right < total - 1) list.push(-1);
        list.push(total);
      }
      return list;
    },
  },
  methods: {
    goPrev() {
      if (this.currentPage <= 1) return;
      this.$emit("current-change", this.currentPage - 1);
    },
    goNext() {
      if (this.currentPage >= this.totalPages) return;
      this.$emit("current-change", this.currentPage + 1);
    },
    goPage(p) {
      if (p === this.currentPage || p < 1 || p > this.totalPages) return;
      this.$emit("current-change", p);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.pagination-summary {
  font-size: 14px;
  color: #333;
}

.pagination-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid #e5e5e0;
  background: #f9f9f7;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  line-height: 1;
  transition: background 0.2s, border-color 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    border-color: #c5c5c0;
    color: #1e463a;
  }

  &:disabled {
    color: #bbb;
    border-color: #eee;
    cursor: not-allowed;
  }

  &.page {
    min-width: 32px;
    padding: 0 8px;

    &.active {
      background: #11332f;
      border-color: #11332f;
      color: #fff;

      &:hover {
        background: #11332f;
        border-color: #11332f;
        color: #fff;
      }
    }
  }
}

.ellipsis {
  padding: 0 4px;
  color: #666;
  font-size: 14px;
  user-select: none;
}
</style>
