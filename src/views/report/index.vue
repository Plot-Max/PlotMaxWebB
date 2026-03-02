<template>
  <div class="group-report">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">Group Report</h2>
    </div>

    <!-- 表格区域 -->
    <DataTable
      :data="tableData"
      :loading="loading"
      :columns="tableColumns"
      :total="total"
      :current-page="page"
      :page-size="size"
      table-class="report-table"
      @current-change="handleCurrentChange"
    >
      <!-- MARK列 - 星标和上传图标 -->
      <template v-slot:mark="{ row }">
        <div class="mark-icons" @click="changeTop(row.report_id, row.top)">
          <img
            v-if="row.top"
            src="@/assets/icons/newicon-2026/top.png"
            alt="Star"
            class="mark-icon star-icon"
          />
          <img
            v-else
            src="@/assets/icons/newicon-2026/Canceltop.png"
            alt="Upload"
            class="mark-icon upload-icon"
          />
        </div>
      </template>

      <!-- ADDRESS列 -->
      <template v-slot:address="{ row }">
        <span class="address-text">{{ row.address }}</span>
      </template>

      <!-- FRONTAGE列 -->
      <template v-slot:frontage="{ row }">
        <span v-if="row.state == 4"
          >{{ (row.frontage_ft || 0).toFixed(2) }} ft</span
        >
        <span v-else>-</span>
      </template>

      <!-- LOT SIZE列 -->
      <template v-slot:lot_size_sgft="{ row }">
        <span
          >{{ ((row.lot_size_sqft || 0) / 43556).toFixed(2) }}
          acer</span
        >
      </template>

      <!-- BUILDABLE SIZE列 -->
      <template v-slot:buildable_sgft="{ row }">
        <span v-if="row.state == 4"
          >{{ (row.buildable_sqft || 0).toFixed(2) }} sqft</span
        >
        <span v-else>-</span>
      </template>

      <!-- USER列 -->
      <template v-slot:user_email="{ row }">
        <span>{{ row.user_email }}</span>
      </template>

      <!-- pay_type列 -->
      <template v-slot:pay_type="{ row }">
        <span>{{ row.pay_type === 0 ? "Normal" : "Advanced" }}</span>
      </template>

      <!-- Report列 -->
      <template v-slot:report="{ row }">
        <div
          style="
            display: flex;
            align-items: center;
            gap: 5px;
            flex-wrap: wrap;
          "
        >
          <BasicButton
            v-if="row.status === 'processing'"
            type="info"
            size="small"
            disabled
            class="report-btn processing"
          >
            Processing
          </BasicButton>
          <el-button
            v-if="row.pay_type === 0 && row.state == 4"
            size="mini"
            type="primary"
            @click="downloadReport(row.pdf_url)"
            >Download</el-button
          >
          <el-button
            v-if="row.pay_type === 2 && row.state == 4"
            size="mini"
            type="primary"
            @click="downloadReport(row.pdf_url)"
            >Ordinary</el-button
          >
          <el-button
            v-if="
              row.pay_type === 2 &&
              row.state == 4 &&
              row.advance_pdf_url
            "
            size="mini"
            type="primary"
            @click="downloadReport(row.advance_pdf_url)"
            >Premium</el-button
          >
          <BasicButton v-if="row.state != 4" type="text" disabled>
            Processing
          </BasicButton>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import { groupReportList, myReportList, topReport } from "@/apis";
import BasicButton from "@/components/newui-202603/BasicButton.vue";
import SearchPagination from "@/components/newui-202603/SearchPagination.vue";
import DataTable from "@/components/newui-202603/DataTable.vue";

export default {
  name: "GroupReport",
  components: { BasicButton, SearchPagination, DataTable },
  data() {
    return {
      // 表格数据
      tableData: [],
      loading: false,

      // 表格列配置
      tableColumns: [
        { prop: "mark", label: "MARK", width: 80, align: "center", slot: "mark" },
        { prop: "address", label: "ADDRESS", minWidth: 170, slot: "address" },
        { prop: "frontage", label: "FRONTAGE", width: 120, align: "center", slot: "frontage" },
        { prop: "lot_size_sgft", label: "LOT SIZE", width: 120, align: "center", slot: "lot_size_sgft" },
        { prop: "buildable_sgft", label: "BUILDABLE SIZE", width: 150, align: "center", slot: "buildable_sgft" },
        { prop: "user_email", label: "USER", width: 150, align: "center", slot: "user_email" },
        { prop: "pay_type", label: "TYPE", width: 120, align: "center", slot: "pay_type" },
        { prop: "report", label: "Report", minWidth: 170, slot: "report" },
      ],

      // 分页相关
      page: 1,
      size: 20,
      total: 0,
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    // 加载数据
    loadData() {
      this.loading = true;
      if (
        !this.$route.query.reportType ||
        this.$route.query.reportType === "1"
      ) {
        groupReportList({ page: this.page - 1, size: this.size })
          .then((response) => {
            if (response.data && response.data.items) {
              this.tableData = response.data.items;
              this.total = response.data.total;
            }
            this.loading = false;
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        myReportList({ page: this.page - 1, size: this.size })
          .then((response) => {
            if (response.data && response.data.items) {
              this.tableData = response.data.items;
              this.total = response.data.total;
            }
            this.loading = false;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    // 生成模拟数据
    generateMockData() {
      const mockList = [];
      const totalCount = 47; // 模拟总数据量

      for (let i = 0; i < this.page; i++) {
        const index = (this.currentPage - 1) * this.page + i + 1;
        if (index > totalCount) break;

        // 根据索引决定状态和图标
        const isProcessing = index <= 3;
        const hasUpload = index >= 4 && index <= 7;
        const isStarred = index <= 3 || (index >= 4 && index <= 6);

        mockList.push({
          id: index,
          address: "10 STILLMEADOW RD, WESTON, MA",
          frontage: "2372.49 ft",
          lotSize: "88.00 acre",
          buildableSize: "8321 sqft",
          user: "Ola Boluwatife",
          status: isProcessing ? "processing" : "completed",
          starred: isStarred,
          uploaded: hasUpload,
        });
      }

      return {
        list: mockList,
        total: totalCount,
      };
    },

    // 下载报告
    handleDownload(row) {
      this.$message.success(`下载 ${row.address} 的报告`);
      // 这里可以实现实际的下载逻辑
    },

    // 每页数量改变
    handleSizeChange(val) {
      this.page = val;
      this.currentPage = 1;
      this.loadData();
    },
    changeTop(id, top) {
      const loading = this.$loading({
        lock: true,
        text: "loading...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      topReport(id, !top)
        .then(() => {
          this.$message.success("Change successfully");
          this.loadData();
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.page = val;
      this.loadData();
    },
    downloadReport(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
// 引入通用样式变量
@import '@/assets/css/common.scss';

// 页面颜色配置（基于 $--color-primary 绿色系）
$report-primary: $--color-primary;

.group-report {
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

  // 特有的 mark-icons 样式（DataTable 无法覆盖的）
  ::v-deep .mark-icons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: pointer;

    .mark-icon {
      width: 24px;
      height: 24px;
      object-fit: contain;

      &.star-icon {
        width: 24px;
        height: 24px;
      }

      &.upload-icon {
        width: 24px;
        height: 24px;
      }
    }
  }

  ::v-deep .address-text {
    color: #2c3e50;
    font-weight: 500;
  }

  ::v-deep .report-btn {
    min-width: 80px;

    &.processing {
      background: #909399;
      border-color: #909399;
      cursor: not-allowed;
    }

    &.download {
      background: #5a8dee;
      border-color: #5a8dee;

      &:hover {
        background: #4a7ce8;
        border-color: #4a7ce8;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .group-report {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .group-report {
    padding: 10px;

    .page-header {
      .page-title {
        font-size: 20px;
      }
    }
  }
}
</style>
