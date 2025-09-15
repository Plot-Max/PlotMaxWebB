<template>
  <div class="dashboard-container">
    <!-- Top Statistics Row -->
    <div class="stats-row">
      <div class="stats-col">
        <StatsCard title="Current subscription"
          :subtitle="(getPlanName(subscriptionInfo.plan)||'-')+'<br/>' + (subscriptionInfo.template?.report_point || 0) + ' reports & ' + (subscriptionInfo.template?.search_point || 0) + ' results'"
          :description="'Valid to '+formatDate(subscriptionInfo.plan?.end_day)" :showProgressBar="false"  @card-click="toWalletPage"/>
      </div>
      <div class="stats-col">
        <StatsCard title="Report Point balance" :mainNumber="subscriptionInfo.totalReportPointBalance || 0" :progressPercentage="reportBalancePercentage"  @card-click="toWalletPage"/>
      </div>
      <div class="stats-col">
        <StatsCard title="Result balance" :mainNumber="subscriptionInfo.totalSearchPointBalance || 0" :progressPercentage="searchBalancePercentage" @card-click="toWalletPage"/>
      </div>
      <div class="stats-col">
        <div class="purchase-card-wrapper">
          <StatsCard title="Purchase additional" subtitle="supplementary package" :mainNumber="''"  @card-click="toWalletPage"
            :showProgressBar="false" class="purchase-stats-card">
            <template #action>
              <i class="add-btn el-icon-circle-plus"></i>
            </template>
          </StatsCard>
        </div>
      </div>
    </div>

    <!-- Main Content Row -->
    <div class="content-row">
      <div class="content-col">
        <ReportSection title="Group Report" :reports="groupReports" :totalCount="groupReportListTotal" @view-all="$router.push('/report?reportType=1')"/>
      </div>
      <div class="content-col">
        <ReportSection title="My Report" :reports="myReports" :totalCount="myReportListTotal" @view-all="$router.push('/report?reportType=2')"/>
      </div>
      <div class="content-col">
        <SearchResults title="Search Results" />
      </div>
    </div>
  </div>
</template>
<script>
import Header from '@/components/Header.vue'
import StatsCard from '@/views/index/components/StatsCard.vue'
import ReportSection from '@/views/index/components/ReportSection.vue'
import SearchResults from '@/views/index/components/SearchResults.vue'
import { subscribeDetail, groupReportList, myReportList } from '@/apis';
import { subscribes } from '@/utils/enums'
export default {
  name: 'HomeView',
  components: {
    Header,
    StatsCard,
    ReportSection,
    SearchResults
  },
  computed: {
    reportBalancePercentage() {
      return   parseFloat(((this.subscriptionInfo.plan?.report_balance || 0) / this.subscriptionInfo.totalReportPointBalance).toFixed(2)) * 100;
    },
    searchBalancePercentage() {
      return parseFloat(((this.subscriptionInfo.plan?.search_balance || 0) / this.subscriptionInfo.totalSearchPointBalance).toFixed(2)) * 100;
    }
  },
  data() {
    return {
      subscribes,
      subscriptionInfo: {
        reports: 80,
        results: 2500,
        validTo: 'Valid to Aug. 30, 2025'
      },
      groupReportListTotal: 0,
      groupReports: [
        
      ],
      myReportListTotal: 0,
      myReports: [
        
      ],
    }
  },
  mounted() {
    subscribeDetail().then(response => {
      if (response.data) {
        this.subscriptionInfo = response.data;
      }
    });
    groupReportList({page: 0, size: 10}).then(response => {
      if (response.data && response.data.items) {
        this.groupReports = response.data.items.map(item => {
          return {
            address: item.address,
            pdf_url: item.pdf_url,
            state: item.state,
          }
        });
        this.groupReportListTotal = response.data.total;
      }
    });
    myReportList({page: 0, size: 10}).then(response => {
      if (response.data && response.data.items) {
        this.myReports = response.data.items.map(item => {
          return {
            address: item.address
          }
        });
        this.myReportListTotal = response.data.total;
      }
    });
  },
  methods: {
    formatDate(date) {
      if(!date) return '-';
      return this.$dayjs(date).format('MMM, DD, YYYY');  
    },
    toWalletPage() {
      if(this.$route.path === '/wallet') return;
      this.$router.push('/wallet');
    },
    getPlanName(plan) {
      if(!plan) return null;
      const subscription = this.subscribes.find(item => item.id === plan.plan_template_id);
      return `${subscription?.name || '-'}<span class="plan-pay">${plan.plan_type==0?'M':'Y'}.Pay</span>`;
    },
  }
  
}
</script>
<style lang="scss" scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;

    .stats-col {
      .purchase-card-wrapper {
        .purchase-stats-card {
          background: #5A8DEE;
          border: none;
          height: 100%;

          // 重写ElementUI卡片内部样式
          ::v-deep .el-card__body {
            color: white;
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            min-height: 100px;
            padding: 10px !important;

            .card-header {
              .card-title {
                color: white;
                font-size: 16px;
                margin-bottom: 4px;
              }

              .card-subtitle {
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
              }
            }

            .card-content {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
              flex: 1;

              .add-btn {
                color: white;
                font-size: 30px;
                border: none;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }

  .content-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;

    .content-col {
      height: fit-content;
    }
  }
}

::v-deep .plan-pay {
  background: #5A8DEE;
  box-shadow: 0px 2px 4px 0px rgba(90,141,238,0.4);
  border-radius: 4px;
  color: #FFFFFF;
  padding: 1px 6px;
  margin-left: 5px;
}

@media (max-width: 1024px) {
  .dashboard-container {
    .stats-row {
      grid-template-columns: 1fr 1fr;
    }

    .content-row {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;

    .stats-row {
      grid-template-columns: 1fr;
    }
  }
}
</style>