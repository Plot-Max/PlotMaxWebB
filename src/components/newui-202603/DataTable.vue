<template>
  <div class="table-section">
    <el-table
      :data="data"
      v-loading="loading"
      style="width: 100%"
      :row-key="rowKey"
      :class="tableClass"
      :size="size"
    >
    <el-table-column
      v-for="(column, index) in normalizedColumns"
      :key="index"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :min-width="column.minWidth"
      :align="column.align || 'left'"
      :fixed="column.fixed"
    >
        <template slot-scope="scope">
          <slot v-if="column.slot" :name="column.slot" :row="scope.row" />
          <span v-else-if="column.formatter" v-html="column.formatter(scope.row)" />
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div v-if="showPagination" class="pagination-section">
      <SearchPagination
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import SearchPagination from "./SearchPagination.vue";

export default {
  name: "DataTable",
  components: { SearchPagination },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: [Array, Function],
      default: () => [],
    },
    rowKey: {
      type: String,
      default: "id",
    },
    tableClass: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "small",
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 20,
    },
  },
  computed: {
    normalizedColumns() {
      if (typeof this.columns === "function") {
        return this.columns();
      }
      return this.columns;
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("current-change", val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/common.scss";

$table-primary: $--color-primary;

.table-section {
  background: white;
  overflow: hidden;

  .pagination-section {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #ebeef5;
  }
}

// ElementUI 表格样式覆盖
::v-deep .el-table,
::v-deep .report-table {
  .el-table__header {
    background-color: #e7ecea;

    th {
      background-color: #e7ecea !important;
      color: $table-primary;
      font-weight: 600;
      font-size: 14px;
      border-bottom: 2px solid #e9ecef;
      padding: 12px 0;
    }
  }

  .el-table__body {
    tr {
      &:hover {
        background-color: #f8f9ff;
      }

      td {
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
      }
    }
  }

  .el-table__fixed-right {
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  }
}

// 分页样式
::v-deep .el-pagination {
  .el-pager li.active {
    color: $table-primary;
    border-color: $table-primary;
  }

  .btn-prev,
  .btn-next {
    &:hover {
      color: $table-primary;
    }
  }

  .el-pagination__jump {
    .el-input__inner {
      border-color: $table-primary;

      &:focus {
        border-color: $table-primary;
      }
    }
  }
}
</style>
