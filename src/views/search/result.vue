<template>
  <div class="search-result">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">Search Results</h2>
    </div>

    <!-- 表格区域 -->
    <DataTable
      :data="tableData"
      :loading="loading"
      :columns="tableColumns"
      :total="total"
      :current-page="page"
      :page-size="size"
      table-class="result-table"
      @current-change="handleCurrentChange"
    >
      <!-- Date/Time列 -->
      <template v-slot:create_at="{ row }">
        <span class="date-text">{{ $dayjs(row.create_at).format('MM/DD/YYYY HH:mm:ss') }}</span>
      </template>

      <!-- Condition列 -->
      <template v-slot:search_params="{ row }">
        <span>{{ formatSearchParams(row.search_params) }}</span>
      </template>

      <!-- QTY列 -->
      <template v-slot:search_count="{ row }">
        <span>{{ row.search_count }}</span>
      </template>

      <!-- Operate列 -->
      <template v-slot:operate="{ row }">
        <el-button type="text" size="mini" @click="$router.push({path: '/search', query:{mode: 1, ...row.search_params}})">View</el-button>
      </template>
    </DataTable>
  </div>
</template>

<script>
import { searchOrderList } from '@/apis';
import DataTable from '@/components/newui-202603/DataTable.vue';

export default {
    name: 'SearchResult',
    components: { DataTable },
    data() {
        return {
            // 表格数据
            tableData: [],
            loading: false,

            // 表格列配置
            tableColumns: [
                { prop: "create_at", label: "Date/Time", width: 140, slot: "create_at" },
                { prop: "search_params", label: "Condition", align: "center", slot: "search_params" },
                { prop: "search_count", label: "QTY", width: 70, align: "center", slot: "search_count" },
                { prop: "operate", label: "Operate", width: 120, align: "center", fixed: "right", slot: "operate" },
            ],

            // 分页相关
            page: 1,
            size: 20,
            total: 0
        }
    },

    mounted() {
        this.loadData()
    },

    methods: {
        // 加载数据
        loadData() {
            this.loading = true
            searchOrderList({
                page: this.page - 1,
                size: this.size
            }).then(response => {
                if (response.data && response.data.items) {
                    this.tableData = response.data.items
                    this.total = response.data.total || 0
                } else {
                    this.tableData = []
                    this.total = 0
                }
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        // 每页数量改变
        handleSizeChange(val) {
            this.size = val
            this.page = 1
            this.loadData()
        },
        // 当前页改变
        handleCurrentChange(val) {
            this.page = val
            this.loadData()
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/common.scss';

.search-result {
    padding: 0px 20px 20px 20px;
    background: #fff;
    min-height: 80vh;

    .page-header {
        margin-bottom: 20px;

        .page-title {
            color: $--color-primary;
            font-size: 24px;
            font-weight: 600;
            margin: 0;
            padding: 20px 0 0;
        }
    }

    ::v-deep .date-text {
        color: #2c3e50;
        font-weight: 500;
    }
}
</style>
