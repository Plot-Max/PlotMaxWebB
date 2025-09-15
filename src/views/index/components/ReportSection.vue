<template>
  <el-card class="report-section" shadow="hover">
    <div class="section-header">
      <h3 class="section-title">{{ title }} <span class="count">({{ totalCount || reports.length }})</span></h3>
      <el-button 
        v-if="showViewAll" 
        type="text" 
        class="view-all-btn"
        @click="handleViewAll"
      >
        View All
      </el-button>
    </div>
    <div class="report-list">
      <div 
        v-for="(report, index) in reports" 
        :key="index"
        class="report-item"
      >
        <div class="report-content">
          <span class="report-text">{{ report.address }}</span>
        </div>
        <div class="report-icon"  @click="downloadReport(report.pdf_url)">
          <img v-if="report.state==4" src="@/assets/index/document.png" alt="Report Image" class="report-image">
          <img v-else src="@/assets/index/document_grey.png" alt="Report Image" class="report-image">
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ReportSection',
  props: {
    title: {
      type: String,
      required: true
    },
    reports: {
      type: Array,
      required: true
    },
    showViewAll: {
      type: Boolean,
      default: true
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleViewAll() {
      this.$emit('view-all')
    },
    downloadReport(url) {
      if (!url) return;
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.report-section {
  height: 100%;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .section-title {
      font-size: 18px;
      color: #333;
      margin: 0;
      font-weight: 600;

      .count {
        color: #666;
        font-weight: normal;
      }
    }

    .view-all-btn {
      color: #4a90e2;
    }
  }

  .report-list {
    height: 300px;
    padding-bottom: 20px;
    overflow: hidden;
    box-sizing: border-box;
    .report-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .report-content {
        flex: 1;

        .report-text {
          font-size: 14px;
          color: #333;
        }
      }

      .report-icon {
        img {
          width: 14px;
          display: block;
        }
      }

      &:hover {
        background: #f8f9fa;
        cursor: pointer;
      }
    }
  }
}
</style>
