<template>
  <div class="search-container">
    <div class="search-content">
      <!-- 左侧筛选面板 -->
      <div class="filter-panel">
        <h2 class="panel-title">Search Criteria</h2>

        <!-- City/Town -->
        <div class="filter-section">
          <h3 class="section-title">City/Town</h3>
          <div class="tag-input">
            <el-tag
              v-for="tag in selectedTags"
              :key="tag"
              :closable="!disableSearch"
              @close="removeTag(tag)"
              class="filter-tag"
            >
              {{ tag }}
            </el-tag>
            <el-autocomplete
              v-model="inputValue"
              ref="saveTagInput"
              class="input-new-tag"
              @keyup.enter.native="handleInputConfirm"
              @select="handleSelect"
              :fetch-suggestions="querySearchAsync"
              placeholder="City/Town"
              :disabled="disableSearch"
            ></el-autocomplete>
          </div>
        </div>

        <!-- Lot Size -->
        <div class="filter-section">
          <div class="section-header-row">
            <h3 class="section-title">Lot Size</h3>
            <div class="unit-selector">
              <button
                class="unit-btn"
                :class="{ active: lotSizeUnit === 'sqft' }"
                @click="lotSizeUnit = 'sqft'"
                :disabled="disableSearch"
              >
                sqft
              </button>
              <button
                class="unit-btn"
                :class="{ active: lotSizeUnit === 'acres' }"
                @click="lotSizeUnit = 'acres'"
                :disabled="disableSearch"
              >
                acres
              </button>
            </div>
          </div>
          <div class="range-inputs">
            <el-input
              v-model="lotSizeMin"
              placeholder="Min"
              :disabled="disableSearch"
              class="range-input"
            ></el-input>
            <span class="range-separator">to</span>
            <el-input
              v-model="lotSizeMax"
              placeholder="Max"
              :disabled="disableSearch"
              class="range-input"
            ></el-input>
          </div>
        </div>

        <!-- Built Utilization -->
        <div class="filter-section">
          <h3 class="section-title">Built Utilization</h3>
          <div class="slider-container">
            <el-slider
              v-model="filters.built_utilization_max"
              :format-tooltip="(value) => `${value}%`"
              :disabled="disableSearch"
              :marks="{
                50: '50%',
                75: '75%',
              }"
              class="utilization-slider"
            ></el-slider>
          </div>
        </div>

        <!-- GFA (sqft) -->
        <div class="filter-section">
          <h3 class="section-title">GFA (sqft)</h3>
          <div class="range-inputs">
            <el-input
              v-model="gfaMin"
              placeholder="Min"
              :disabled="disableSearch"
              class="range-input"
            ></el-input>
            <span class="range-separator">to</span>
            <el-input
              v-model="gfaMax"
              placeholder="Max"
              :disabled="disableSearch"
              class="range-input"
            ></el-input>
          </div>
        </div>

        <!-- Historic Building -->
        <div class="filter-section">
          <div class="checkbox-item">
            <el-checkbox
              v-model="filters.notHistoric"
              :disabled="disableSearch"
            >
              Historic Building
            </el-checkbox>
          </div>
        </div>

        <!-- Action Button -->
        <div class="filter-actions">
          <el-button
            type="primary"
            @click="applyFilters"
            class="apply-btn"
            :disabled="disableSearch"
          >
            Apply Filters
          </el-button>
        </div>
      </div>

      <!-- 右侧结果区域 -->
      <div class="results-panel">
        <!-- 结果头部 -->
        <div class="results-header">
          <!-- 面包屑显示已选条件 -->
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="results-breadcrumb"
          >
            <el-breadcrumb-item v-for="tag in selectedTags" :key="tag">
              {{ tag }}
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-if="filters.lot_size_min || filters.lot_size_max"
            >
              Lot Size:
              <span v-if="filters.lot_size_min">
                Min {{ formatterAcre(filters.lot_size_min) }}
              </span>
              <span v-if="filters.lot_size_min && filters.lot_size_max">-</span>
              <span v-if="filters.lot_size_max">
                Max {{ formatterAcre(filters.lot_size_max) }}
              </span>
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-if="filters.frontage_min || filters.frontage_max"
            >
              Frontage:
              <span v-if="filters.frontage_min">
                Min {{ filters.frontage_min }}
              </span>
              <span v-if="filters.frontage_min && filters.frontage_max">-</span>
              <span v-if="filters.frontage_max">
                Max {{ filters.frontage_max }}
              </span>
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-if="filters.buildableSize_min || filters.buildableSize_max"
            >
              Buildable Size:
              <span v-if="filters.buildableSize_min">
                Min {{ filters.buildableSize_min }}
              </span>
              <span
                v-if="filters.buildableSize_min && filters.buildableSize_max"
              >
                -
              </span>
              <span v-if="filters.buildableSize_max">
                Max {{ filters.buildableSize_max }}
              </span>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="filters.gfa_min || filters.gfa_max">
              GFA:
              <span v-if="filters.gfa_min">Min {{ filters.gfa_min }}</span>
              <span v-if="filters.gfa_min && filters.gfa_max">-</span>
              <span v-if="filters.gfa_max">Max {{ filters.gfa_max }}</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-if="filters.footprint_min || filters.footprint_max"
            >
              Footprint:
              <span v-if="filters.footprint_min">
                Min {{ filters.footprint_min }}
              </span>
              <span v-if="filters.footprint_min && filters.footprint_max">
                -
              </span>
              <span v-if="filters.footprint_max">
                Max {{ filters.footprint_max }}
              </span>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="filters.notHistoric">
              Not Historic Building
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="filters.built_utilization_max">
              Built Utilization:{{ filters.built_utilization_max }}%
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="filters.no_envi_setback">
              No Environmental Setback Zone
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="filters.notPartOfHistoric">
              Not Part Of Historic District
            </el-breadcrumb-item>
          </el-breadcrumb>
          <div class="results-info">
            <h2 class="results-count">
              {{ totalResults.toLocaleString() }} Results
            </h2>
            <el-button
              v-if="!disableSearch"
              type="primary"
              size="small"
              class="recharge-btn"
              @click="doBuySearch"
            >
              {{ formatButtonText }}
            </el-button>
          </div>
        </div>

        <!-- 结果表格 -->
        <div class="results-table">
          <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading"
            class="search-table"
            height="720px"
          >
            <!-- 地址列 -->
            <el-table-column prop="address" label="ADDRESS" min-width="200">
              <template slot-scope="scope">
                <div class="address-cell">
                  <i
                    class="el-icon-lock address-icon"
                    v-if="scope.row.locked"
                  ></i>
                  <span class="address-text" v-if="scope.row.show_address">
                    {{ scope.row.show_address }}
                  </span>
                  <img v-else src="@/assets/icons/lock.png" width="16px" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="show_city"
              label="TOWN"
              min-width="90"
            ></el-table-column>

            <!-- 临街面宽列 -->
            <el-table-column
              prop="frontage"
              label="FRONTAGE"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <span>
                  {{
                    formatterPrice((scope.row.frontage_ft || 0).toFixed(0))
                  }}
                  ft
                </span>
              </template>
            </el-table-column>

            <!-- 地块大小列 -->
            <el-table-column
              prop="lotSize"
              label="LOT SIZE"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ formatterAcre(scope.row.lot_size_in_use_sqft) }}</span>
              </template>
            </el-table-column>

            <!-- 可建设面积列 -->
            <el-table-column
              prop="buildableSize"
              label="BUILDABLE SIZE"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <span>
                  {{
                    formatterArea(
                      (scope.row.buildable_zone_sqft || 0).toFixed(0),
                    )
                  }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="footprint_max_sqft"
              label="Foot Print SIZE"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <span>
                  {{
                    formatterArea(
                      (scope.row.footprint_max_sqft || 0).toFixed(0),
                    )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="gfa_sqft"
              label="Maximum Gross Floor Area"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <span>
                  {{ formatterArea((scope.row.gfa_sqft || 0).toFixed(0)) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="historical"
              label="HISTORICAL"
              width="105"
              align="center"
            ></el-table-column>

            <!-- 用户列 -->
            <!-- <el-table-column prop="user" label="USER" width="150" align="center">
                            <template slot-scope="scope">
                                <span>{{ scope.row.user }}</span>
                            </template>
                        </el-table-column> -->

            <!-- 操作列 -->
            <el-table-column
              label="DETAIL REPORT"
              min-width="75"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.show_address"
                  type="text"
                  size="small"
                  @click="purchaseProperty(scope.row)"
                  class="purchase-btn"
                >
                  Purchase
                </el-button>
                <el-button
                  v-if="scope.row.canDownload"
                  type="primary"
                  size="small"
                  @click="downloadProperty(scope.row)"
                  class="download-btn"
                >
                  Download
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalResults"
              class="search-pagination"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { searchComplex, buySearch, searchCity } from "@/apis";
export default {
  name: "SearchPage",
  components: {},
  watch: {
    $route() {
      this.init();
    },
  },
  computed: {
    formatButtonText() {
      console.log("aasdfasdfasdfadsf");
      const length = this.formatterPrice(this.totalResults || 0);
      const halfLength = this.formatterPrice(
        ((this.totalResults || 0) / 2).toFixed(2),
        2,
        2,
      );
      return this.totalResults && this.totalResults > 0
        ? `${length} Result Points or $ ${halfLength} for Recharge and unlock Address`
        : "Recharge and unlock";
    },
  },
  data() {
    return {
      loading: false,
      selectedTags: [],
      totalResults: 0,
      currentPage: 1,
      pageSize: 20,
      inputValue: "",

      disableSearch: false,

      // UI 状态
      lotSizeUnit: "sqft",
      lotSizeMin: "",
      lotSizeMax: "",
      gfaMin: "",
      gfaMax: "",

      // 筛选条件
      filters: {
        lot_size_min: 2,
        lot_size_max: null,
        frontage_min: null,
        frontage_max: null,
        buildableSize_min: null,
        buildableSize_max: null,
        gfa_min: null,
        gfa_max: null,
        footprint_min: null,
        footprint_max: null,
        notHistoric: false,
        notPartOfHistoric: true,
        built_utilization_max: null,
      },
      lotSizeMinOptions: [
        // { label: '1,000 sqft', value: 1000 },
        // { label: '2,000 sqft', value: 2000 },
        // { label: '3,000 sqft', value: 3000 },
        // { label: '4,000 sqft', value: 4000 },
        // { label: '5,000 sqft', value: 5000 },
        // { label: '7,000 sqft', value: 7000 },
        { label: "0.25 acre(10,890 sqft)", value: 10890 },
        { label: "0.5 acre", value: 21780 },
        { label: "1 acre", value: 43560 },
        { label: "1.5 acre", value: 65340 },
        { label: "2 acre", value: 87120 },
        { label: "5 acre", value: 217800 },
        { label: "10 acre", value: 435600 },
        { label: "20 acre", value: 871200 },
        { label: "50 acre", value: 2178000 },
        { label: "100 acre", value: 4356000 },
      ],
      frontageOptions: [
        { label: "50 ft", value: 50 },
        { label: "80 ft", value: 80 },
        { label: "100 ft", value: 100 },
        { label: "150 ft", value: 150 },
        { label: "200 ft", value: 200 },
        { label: "250 ft", value: 250 },
        { label: "300 ft", value: 300 },
        { label: "350 ft", value: 350 },
        { label: "400 ft", value: 400 },
        { label: "500 ft", value: 500 },
        { label: "700 ft", value: 700 },
        { label: "1,000 ft", value: 1000 },
      ],
      buildableSizeOptions: [
        { label: "1,000 sqft", value: 1000 },
        { label: "2,000 sqft", value: 2000 },
        { label: "3,000 sqft", value: 3000 },
        { label: "4,000 sqft", value: 4000 },
        { label: "5,000 sqft", value: 5000 },
        { label: "7,000 sqft", value: 7000 },
        { label: "0.25 acre(10,890 sqft)", value: 10890 },
        { label: "0.5 acre", value: 21780 },
        { label: "1 acre", value: 43560 },
        { label: "1.5 acre", value: 65340 },
        { label: "2 acre", value: 87120 },
        { label: "5 acre", value: 217800 },
        { label: "10 acre", value: 435600 },
        { label: "20 acre", value: 871200 },
        { label: "50 acre", value: 2178000 },
        { label: "100 acre", value: 4356000 },
      ],
      footPrintOptions: [
        { label: "1,000 sqft", value: 1000 },
        { label: "2,000 sqft", value: 2000 },
        { label: "3,000 sqft", value: 3000 },
        { label: "4,000 sqft", value: 4000 },
        { label: "5,000 sqft", value: 5000 },
        { label: "7,000 sqft", value: 7000 },
        { label: "0.25 acre(10,890 sqft)", value: 10890 },
        { label: "0.5 acre", value: 21780 },
        { label: "1 acre", value: 43560 },
        { label: "1.5 acre", value: 65340 },
        { label: "2 acre", value: 87120 },
        { label: "5 acre", value: 217800 },
        { label: "10 acre", value: 435600 },
        { label: "20 acre", value: 871200 },
        { label: "50 acre", value: 2178000 },
        { label: "100 acre", value: 4356000 },
      ],
      grossFloorAreaOptions: [
        { label: "500 sqft", value: 500 },
        { label: "750 sqft", value: 750 },
        { label: "1,000 sqft", value: 1000 },
        { label: "1,250 sqft", value: 1250 },
        { label: "1,500 sqft", value: 1500 },
        { label: "1,750 sqft", value: 1750 },
        { label: "2,000 sqft", value: 2000 },
        { label: "2,500 sqft", value: 2500 },
        { label: "3,000 sqft", value: 3000 },
        { label: "4,000 sqft", value: 4000 },
        { label: "5,000 sqft", value: 5000 },
        { label: "7,500 sqft", value: 7500 },
      ],
      // 表格数据
      tableData: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.query.mode == 1) {
        this.disableSearch = true;
        console.log("route query:", this.$route.query);
        this.filters = this.formatSearchFormParams(this.$route.query);
        console.log("formatted filters:", this.filters);
        this.searchProperties();
      } else {
        this.disableSearch = false;
        this.resetFilters();
      }
    },
    // 确认输入
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && !this.selectedTags.includes(inputValue)) {
        this.selectedTags.push(inputValue);
      }
      this.inputValue = "";
    },
    handleSelect(item) {
      console.log("selected item:", item, this.inputValue);
      let inputValue = this.inputValue;
      if (inputValue && !this.selectedTags.includes(inputValue)) {
        this.selectedTags.push(inputValue);
      }
      this.inputValue = "";
    },
    querySearchAsync(queryString, cb) {
      searchCity(queryString).then((res) => {
        const results = res.data.map((city) => {
          return { value: city + ", MA", origin: city };
        });
        cb(results);
      });
    },
    // 添加标签（保留原方法作为备份）
    addTag() {
      this.$prompt("Please input city/town", "Add Tag", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      })
        .then(({ value }) => {
          if (value && !this.selectedTags.includes(value)) {
            this.selectedTags.push(value);
          }
        })
        .catch(() => {});
    },

    // 移除标签
    removeTag(tag) {
      const index = this.selectedTags.indexOf(tag);
      if (index > -1) {
        this.selectedTags.splice(index, 1);
      }
    },

    // 应用筛选
    applyFilters() {
      // 转换 Lot Size
      if (this.lotSizeMin) {
        const minValue =
          this.lotSizeUnit === "acres"
            ? parseFloat(this.lotSizeMin) * 43560
            : parseFloat(this.lotSizeMin);
        this.filters.lot_size_min = minValue || 2;
      } else {
        this.filters.lot_size_min = 2;
      }

      if (this.lotSizeMax) {
        const maxValue =
          this.lotSizeUnit === "acres"
            ? parseFloat(this.lotSizeMax) * 43560
            : parseFloat(this.lotSizeMax);
        this.filters.lot_size_max = maxValue || null;
      } else {
        this.filters.lot_size_max = null;
      }

      // 转换 GFA
      this.filters.gfa_min = this.gfaMin ? parseFloat(this.gfaMin) : null;
      this.filters.gfa_max = this.gfaMax ? parseFloat(this.gfaMax) : null;

      // 执行搜索
      this.searchProperties(true);
    },

    // 重置筛选
    resetFilters() {
      this.filters = {
        lot_size_min: 2,
        lot_size_max: null,
        frontage_min: null,
        frontage_max: null,
        buildableSize_min: null,
        buildableSize_max: null,
        gfa_min: null,
        gfa_max: null,
        footprint_min: null,
        footprint_max: null,
        notHistoric: false,
        notPartOfHistoric: true,
        built_utilization_max: null,
      };
      this.selectedTags = [];
      this.lotSizeUnit = "sqft";
      this.lotSizeMin = "";
      this.lotSizeMax = "";
      this.gfaMin = "";
      this.gfaMax = "";
    },

    // 搜索房产
    searchProperties(resetPage = false) {
      if (this.loading) return;
      this.loading = true;
      if (resetPage) this.currentPage = 1;
      searchComplex({
        page: this.currentPage - 1,
        size: this.pageSize,
        city:
          this.selectedTags?.length > 0
            ? this.selectedTags
                .map((item) =>
                  item.lastIndexOf(",") > 0
                    ? item.substring(0, item.lastIndexOf(",")).trim()
                    : item,
                )
                .join(",")
            : null,
        lot_size_min: this.filters.lot_size_min || 2,
        lot_size_max: this.filters.lot_size_max || null,
        frontage_min: this.filters.frontage_min || null,
        frontage_max: this.filters.frontage_max || null,
        buildable_min: this.filters.buildableSize_min || null,
        buildable_max: this.filters.buildableSize_max || null,
        gfa_min: this.filters.gfa_min || null,
        gfa_max: this.filters.gfa_max || null,
        footprint_min: this.filters.footprint_min || null,
        footprint_max: this.filters.footprint_max || null,
        has_history: this.filters.notHistoric ? false : null,
        in_history: this.filters.notPartOfHistoric ? false : null,
        built_utilization_max: this.filters.built_utilization_max || null,
        no_envi_setback: this.filters.no_envi_setback || null,
      })
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.resultList;
          this.totalResults = res.data.total || 0;
          this.searchParams = res.data.searchParams;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 购买房产
    purchaseProperty(row) {
      this.$router.push({
        path: "/choose-service",
        query: {
          full_addr: "",
          gid: row.gid,
        },
      });
    },
    doBuySearch() {
      if (this.tableData.length === 0) {
        this.$message.warning(
          "No properties to unlock. Please perform a search first.",
        );
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "Processing...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      buySearch(this.searchParams)
        .then((res) => {
          this.$message.success(
            "Recharge successful! You can now unlock addresses.",
          );
          this.searchProperties();
        })
        .finally(() => {
          loading.close();
        });
    },

    // 下载房产信息
    downloadProperty(row) {
      this.$message.info(`下载房产信息 ${row.id}`);
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchProperties();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchProperties();
    },
  },
};
</script>

<style lang="scss" scoped>
.search-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-content {
  display: flex;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
}

/* 左侧筛选面板 */
.filter-panel {
  width: 300px;
  background: white;
  border-radius: 8px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
  }
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 0 24px 0;
}

.filter-section {
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .section-title {
    margin-bottom: 0;
  }

  .unit-selector {
    margin-bottom: 0;
  }
}

.tag-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 40px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;

  .filter-tag {
    background-color: #c8e6c9;
    color: #2e7d32;
    border: none;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    letter-spacing: 0.3px;

    ::v-deep .el-tag__close {
      color: #2e7d32;

      &:hover {
        background-color: #a5d6a7;
      }
    }
  }

  .input-new-tag {
    flex: 1;
    min-width: 120px;

    ::v-deep .el-input__inner {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      border: none;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      &:focus {
        border: none;
        box-shadow: none;
      }
    }
  }
}

.unit-selector {
  display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
  background: white;

  .unit-btn {
    flex: 1;
    padding: 2px 10px;
    border: none;
    background: #f5f5f5;
    color: #666;
    font-size: 13px;
    line-height: 1.4;
    cursor: pointer;
    transition: all 0.2s;

    &:first-child {
      border-radius: 4px 0 0 4px;
    }

    &:last-child {
      border-radius: 0 4px 4px 0;
    }

    &.active {
      background: #c8e6c9;
      color: #2e7d32;
      font-weight: 600;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;

  ::v-deep .el-radio {
    margin-right: 0;

    .el-radio__input.is-checked .el-radio__inner {
      background-color: #5a8dee;
      border-color: #5a8dee;
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: #5a8dee;
    }
  }
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;

  ::v-deep .el-checkbox {
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #5a8dee;
      border-color: #5a8dee;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #5a8dee;
    }
  }

  .inline-date {
    margin-left: 8px;
    width: 120px;
  }
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 12px;

  .range-input {
    flex: 1;

    ::v-deep .el-input__inner {
      height: 36px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;

      &:focus {
        border-color: #2e7d32;
      }
    }
  }

  .range-separator {
    color: #666;
    font-size: 14px;
    font-weight: 500;
  }
}

.slider-container {
  width: 100%;
  padding: 8px 0;

  .utilization-slider {
    ::v-deep .el-slider__runway {
      background-color: #2e7d32;
      height: 6px;
    }

    ::v-deep .el-slider__bar {
      background-color: #1b5e20;
    }

    ::v-deep .el-slider__button {
      width: 16px;
      height: 16px;
      border: 2px solid #2e7d32;
      background-color: white;
    }

    ::v-deep .el-slider__button-wrapper {
      width: 16px;
      height: 16px;
      box-sizing: border-box;
      margin-top: 6px;
    }
  }
}

.checkbox-item {
  ::v-deep .el-checkbox {
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #2e7d32;
      border-color: #2e7d32;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #2e7d32;
    }
  }
}

.filter-actions {
  margin-top: 24px;

  .apply-btn {
    width: 100%;
    background-color: #1a1a1a;
    border-color: #1a1a1a;
    color: white;
    font-weight: 600;
    font-size: 16px;
    padding: 12px 0;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      background-color: #2a2a2a;
      border-color: #2a2a2a;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      background-color: #ccc;
      border-color: #ccc;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
  }
}

/* 右侧结果面板 */
.results-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.results-header {
  padding: 24px 24px 0;

  .results-info {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
  }

  .results-count {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .recharge-btn {
    background-color: #5a8dee;
    border-color: #5a8dee;
  }
}

.results-table {
  padding: 0 24px 24px;
}

/* 表格样式 */
.search-table {
  ::v-deep .el-table__header {
    background-color: #f8f9fa;

    th {
      background-color: #f8f9fa !important;
      color: #909399;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px 0;
      border-bottom: 1px solid #e4e7ed;
    }
  }

  ::v-deep .el-table__row {
    &:hover {
      background-color: #f8f9fa;
    }
  }

  ::v-deep .el-table td {
    padding: 16px 0;
    border-bottom: 1px solid #f0f2f5;
  }
}

.address-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .address-icon {
    color: #5a8dee;
    font-size: 14px;
  }

  .address-text {
    color: #606266;
  }
}

.purchase-btn {
  color: #5a8dee;

  &:hover {
    color: #4a7bc8;
  }
}

.download-btn {
  background-color: #5a8dee;
  border-color: #5a8dee;
  font-size: 12px;
  padding: 6px 16px;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.search-pagination {
  ::v-deep .el-pagination {
    .el-pager li.active {
      background-color: #5a8dee;
      color: white;
    }

    .el-pagination__jump {
      margin-left: 24px;
    }

    .btn-next,
    .btn-prev {
      background-color: #f4f4f5;
      color: #606266;

      &:hover {
        color: #5a8dee;
      }
    }
  }
}
.results-breadcrumb {
  font-size: 13px;
  margin-bottom: 7px;
}
/* 响应式调整 */
@media (max-width: 1200px) {
  .search-content {
    gap: 15px;
  }

  .filter-panel {
    width: 280px;
  }
}

@media (max-width: 992px) {
  .filter-panel {
    width: 260px;
  }

  .search-table {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .search-content {
    padding: 15px 10px;
  }
  .filter-panel {
    width: 100%;
  }
  .filter-panel,
  .results-panel {
    padding: 20px 16px;
  }

  .results-header {
    padding: 20px 16px 0;
  }

  .results-table {
    padding: 0 16px 20px;
    overflow-x: auto;
  }

  .search-table {
    min-width: 800px;
  }
}
</style>
