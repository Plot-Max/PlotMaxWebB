<template>
  <el-card class="search-results" shadow="hover">
    <div class="section-header">
      <h3 class="section-title">{{ title }} <span class="count">({{ results.length }})</span></h3>
      <el-button 
        v-if="showViewAll" 
        type="text" 
        class="view-all-btn"
        @click="handleViewAll"
      >
        View All
      </el-button>
    </div>
    <div class="results-list">
      <div 
        v-for="(result, index) in results" 
        :key="index"
        class="result-item"
      >
        <div class="result-content" @click="$router.push({path: '/search', query:{mode: 1, ...result.search_params}})">
          <div class="result-date">
            <span>{{ $dayjs(result.create_at).format('MM/DD/YYYY HH:mm:ss') }}</span>
            <span>{{result.search_count}} Results</span>
          </div>
          <div class="result-description">{{ formatSearchParams(result.search_params) }} </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { searchOrderList } from '@/apis';
export default {
  name: 'SearchResults',
  props: {
    title: {
      type: String,
      required: true
    },
    showViewAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      results: []
    }
  },
  mounted() {
    searchOrderList({
      page: 0,
      size: 3
    }).then(res => {
      console.log('searchOrderList', res);
      this.results = res.data.items
    });
  },
  methods: {
    handleViewAll() {
      this.$emit('view-all')
      this.$router.push('/search/result');
    },
  }
}
</script>

<style lang="scss" scoped>
.search-results {
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

  .results-list {
    height: 300px;
    padding-bottom: 20px;
    overflow: hidden;
    box-sizing: border-box;
    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
      color: #475F7B;

      &:last-child {
        border-bottom: none;
      }

      .result-content {
        flex: 1;

        .result-date {
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
        }

        .result-description {
          font-size: 14px;
          margin-bottom: 4px;
          font-weight: 500;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
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
