<template>
  <el-card class="stats-card" shadow="hover">
    <div  @click="handleClick" style="cursor: pointer;">
      <div class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-subtitle" v-if="subtitle" v-html="subtitle"></p>
    </div>
    <div class="card-content">
      <div class="main-number" v-if="mainNumber != null">
        <!-- {{ mainNumber }} -->
        <el-statistic
            group-separator=","
            :precision="0"
            :value="mainNumber"
          ></el-statistic>
      </div>
      <el-progress 
        v-if="showProgressBar"
        :percentage="progressPercentage || 0"
        :show-text="false"
        :stroke-width="6"
        color="#4a90e2"
        class="progress-bar"
      />
      <p class="card-description" v-if="description">{{ description }}</p>
      <!-- 插槽用于自定义内容，如按钮等 -->
      <slot name="action"></slot>
    </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'StatsCard',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    mainNumber: {
      type: [String, Number],
      default: null,
      required: false
    },
    description: {
      type: String,
      default: ''
    },
    showProgressBar: {
      type: Boolean,
      default: true
    },
    progressPercentage: {
      type: Number,
      default: 0
    }
  },
  methods: {

    handleClick() {
      console.log('Card clicked');
      this.$emit('card-click');
    } 
  }
}
</script>

<style lang="scss" scoped>
.stats-card {
  height: 100%;
  border-radius: 10px;

  .card-header {
    margin-bottom: 16px;

    .card-title {
      font-size: 16px;
      color: #666;
      margin: 0 0 4px 0;
      font-weight: 500;
    }

    .card-subtitle {
      font-size: 14px;
      color: #4a90e2;
      margin: 0;
      font-weight: 500;
    }
  }

  .card-content {
    ::v-deep .el-statistic .con {
      font-size: 20px;
      font-weight: bold;
      color: #4a90e2;
      margin-bottom: 12px;
      text-align: left;
      justify-content: flex-start;
    }

    .progress-bar {
      margin-bottom: 8px;
    }

    .card-description {
      font-size: 12px;
      color: #666;
      margin: 0;
    }
  }
  ::v-deep .el-card__body {
    padding: 10px;
  }
}
</style>
