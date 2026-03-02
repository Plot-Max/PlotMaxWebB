<template>
  <div class="search-page">
    <!-- 统一宽度容器：保证 ZONE OVERLAYS 与下方表格区域右侧对齐 -->
    <div class="search-main-wrap">
      <!-- 投资策略 + 区域叠加 栏（在 search-container 上方，与下方主容器样式统一） -->
      <div class="strategy-overlay-bar-wrap">
        <div class="strategy-overlay-bar">
          <div class="strategy-section">
            <h3 class="bar-section-title">INVESTMENT STRATEGY</h3>
            <div class="strategy-tabs">
              <button
                v-for="item in visibleStrategyOptions"
                :key="item.value"
                type="button"
                class="strategy-tab"
                :class="{ active: investmentStrategy === item.value }"
                @click="handleStrategyChange(item.value)"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
          <div class="overlays-section">
            <h3 class="bar-section-title">ZONE OVERLAYS</h3>
            <div class="overlay-toggles">
              <button
                type="button"
                class="overlay-btn"
                :class="{ active: zoneOverlays.oppZones }"
                @click="handleOppZonesChange"
              >
                <span class="overlay-checkbox">
                  <i v-if="zoneOverlays.oppZones" class="el-icon-check"></i>
                </span>
                <span class="overlay-icon" aria-hidden="true">
                  <!-- 闪电图标 -->
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </span>
                <span class="overlay-label">Opp Zones</span>
              </button>
              <button
                type="button"
                class="overlay-btn"
                :class="{ active: zoneOverlays.transitZones }"
                @click="zoneOverlays.transitZones = !zoneOverlays.transitZones"
              >
                <span class="overlay-checkbox">
                  <i v-if="zoneOverlays.transitZones" class="el-icon-check"></i>
                </span>
                <span class="overlay-icon" aria-hidden="true">
                  <!-- 公交车图标 -->
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path
                      d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"
                    />
                  </svg>
                </span>
                <span class="overlay-label">Transit Zones</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="search-container">
        <div class="search-content">
          <!-- 左侧筛选面板 -->
          <div class="filter-panel">
            <h2 class="panel-title">Search Criteria</h2>

            <!-- City/Zip -->
            <div class="filter-section">
              <h3 class="section-title">City/Zip</h3>
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
                  placeholder="City/Zip"
                  :disabled="disableSearch"
                ></el-autocomplete>
              </div>
            </div>

            <!-- Lot Size（用户自填，支持 sqft / acres 单位切换，后端仍收 sqft） -->
            <div class="filter-section lot-size-section">
              <div class="section-header-row">
                <h3 class="section-title">Lot Size</h3>
                <div class="lot-size-unit-switcher">
                  <button
                    type="button"
                    class="lot-size-unit-item"
                    :class="{ active: lotSizeUnit === 'sqft' }"
                    :disabled="disableSearch"
                    @click="lotSizeUnit = 'sqft'"
                  >
                    sqft
                  </button>
                  <button
                    type="button"
                    class="lot-size-unit-item"
                    :class="{ active: lotSizeUnit === 'acre' }"
                    :disabled="disableSearch"
                    @click="lotSizeUnit = 'acre'"
                  >
                    acres
                  </button>
                </div>
              </div>
              <div class="range-inputs">
                <el-input
                  v-model.number="lotSizeMinDisplay"
                  type="number"
                  :placeholder="lotSizeUnit === 'acre' ? 'No Min' : 'No Min'"
                  clearable
                  :min="0"
                  :disabled="disableSearch"
                  class="range-input"
                />
                <span class="range-separator">to</span>
                <el-input
                  v-model.number="lotSizeMaxDisplay"
                  type="number"
                  :placeholder="lotSizeUnit === 'acre' ? 'No Max' : 'No Max'"
                  clearable
                  :min="0"
                  :disabled="disableSearch"
                  class="range-input"
                />
              </div>
            </div>

            <!-- Built Utilization -->
            <div class="filter-section">
              <!-- <h3 class="section-title">Built Utilization</h3> -->
              <h3 class="section-title">Utilization (%)</h3>
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

            <!-- Gross Floor Area (sqft) -->
            <div class="filter-section">
              <!-- <h3 class="section-title">Gross Floor Area（sqft）</h3> -->
              <h3 class="section-title">GFA (sqft)</h3>
              <div class="range-inputs">
                <el-select
                  v-model="filters.gfa_min"
                  filterable
                  clearable
                  placeholder="No Min"
                  :disabled="disableSearch"
                  class="range-input"
                >
                  <el-option label="No Min" :value="null"></el-option>
                  <el-option
                    v-for="item in grossFloorAreaOptions.filter(
                      (item) => !filters.gfa_max || item.value < filters.gfa_max
                    )"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span class="range-separator">to</span>
                <el-select
                  v-model="filters.gfa_max"
                  filterable
                  clearable
                  placeholder="No Max"
                  :disabled="disableSearch"
                  class="range-input"
                >
                  <el-option label="No Max" :value="null"></el-option>
                  <el-option
                    v-for="item in grossFloorAreaOptions.filter(
                      (item) => !filters.gfa_min || item.value > filters.gfa_min
                    )"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <!-- History commission：Historic building（勾选传 has_history: true，不勾选传 null） -->
            <div class="filter-section">
              <div class="checkbox-item">
                <el-checkbox
                  v-model="filters.notHistoric"
                  :disabled="disableSearch"
                >
                  Historic building
                </el-checkbox>
              </div>
            </div>

            <!-- Action Button -->
            <div class="filter-actions">
              <el-button
                class="btn-base reset-btn"
                @click="resetFilters"
                :disabled="disableSearch"
              >
                Reset
              </el-button>
              <el-button
                type="primary"
                class="btn-base apply-btn"
                @click="applyFilters"
                :disabled="disableSearch"
              >
                Apply Filters
              </el-button>
            </div>
          </div>

          <div class="right-result-area">
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
                    <span v-if="filters.lot_size_min && filters.lot_size_max">
                      -
                    </span>
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
                    <span v-if="filters.frontage_min && filters.frontage_max">
                      -
                    </span>
                    <span v-if="filters.frontage_max">
                      Max {{ filters.frontage_max }}
                    </span>
                  </el-breadcrumb-item>
                  <el-breadcrumb-item
                    v-if="
                      filters.buildableSize_min || filters.buildableSize_max
                    "
                  >
                    Buildable Size:
                    <span v-if="filters.buildableSize_min">
                      Min {{ filters.buildableSize_min }}
                    </span>
                    <span
                      v-if="
                        filters.buildableSize_min && filters.buildableSize_max
                      "
                    >
                      -
                    </span>
                    <span v-if="filters.buildableSize_max">
                      Max {{ filters.buildableSize_max }}
                    </span>
                  </el-breadcrumb-item>
                  <el-breadcrumb-item v-if="filters.gfa_min || filters.gfa_max">
                    GFA:
                    <span v-if="filters.gfa_min">
                      Min {{ filters.gfa_min }}
                    </span>
                    <span v-if="filters.gfa_min && filters.gfa_max">-</span>
                    <span v-if="filters.gfa_max">
                      Max {{ filters.gfa_max }}
                    </span>
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
                    Historic building
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
                  :header-cell-style="{ color: '#3b3b3b' }"
                >
                  <!-- 地址列 -->
                  <!-- <el-table-column
                    prop="address"
                    label="ADDRESS"
                    min-width="200"
                  >
                    <template slot-scope="scope">
                      <div class="address-cell">
                        <i
                          class="el-icon-lock address-icon"
                          v-if="scope.row.locked"
                        ></i>
                        <span
                          class="address-text"
                          v-if="scope.row.show_address"
                        >
                          {{ scope.row.show_address }}
                        </span>
                        <img
                          v-else
                          src="@/assets/icons/lock.png"
                          width="16px"
                        />
                      </div>
                    </template>
                  </el-table-column> -->
                  <!-- Property：Address + 家庭类型 -->
                  <el-table-column
                    prop="property"
                    label="Property"
                    min-width="220"
                  >
                    <template slot-scope="scope">
                      <div>{{ scope.row.show_address }}</div>
                      <div style="color: #999;">{{ scope.row.use_desc }}</div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column
                    prop="show_city"
                    label="TOWN"
                    min-width="90"
                  ></el-table-column> -->

                  <!-- 临街面宽列 -->
                  <!-- <el-table-column
                    prop="frontage"
                    label="FRONTAGE"
                    width="100"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{
                          formatterPrice(
                            (scope.row.frontage_ft || 0).toFixed(0)
                          )
                        }}
                        ft
                      </span>
                    </template>
                  </el-table-column> -->

                  <!-- 地块大小列 -->
                  <el-table-column
                    prop="lotSize"
                    label="LOT SIZE"
                    width="120"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{ formatterAcre(scope.row.lot_size_in_use_sqft) }}
                      </span>
                    </template>
                  </el-table-column>

                  <!-- GFA (SQFT) 列（紧接 Lot Size 后） -->
                  <el-table-column
                    prop="gfa_sqft"
                    label="GFA (SQFT)"
                    width="120"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{
                          formatterArea((scope.row.gfa_sqft || 0).toFixed(0))
                        }}
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 可建设面积列 -->
                  <!-- <el-table-column
                    prop="buildableSize"
                    label="BUILDABLE SIZE"
                    width="150"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{
                          formatterArea(
                            (scope.row.buildable_zone_sqft || 0).toFixed(0)
                          )
                        }}
                      </span>
                    </template>
                  </el-table-column> -->

                  <!-- <el-table-column
                    prop="footprint_max_sqft"
                    label="Foot Print SIZE"
                    width="150"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{
                          formatterArea(
                            (scope.row.footprint_max_sqft || 0).toFixed(0)
                          )
                        }}
                      </span>
                    </template>
                  </el-table-column> -->
                  <!-- <el-table-column
                    prop="gfa_sqft"
                    label="Maximum Gross Floor Area"
                    width="140"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{
                          formatterArea((scope.row.gfa_sqft || 0).toFixed(0))
                        }}
                      </span>
                    </template>
                  </el-table-column> -->
                  <!-- Flags：土地性质图标（湿地、洪水、古建筑等） -->
                  <el-table-column
                    prop="flags"
                    label="Flags"
                    width="120"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div class="flags-cell">
                        <el-tooltip
                          v-if="scope.row.has_wetland"
                          content="Wetland"
                          placement="top"
                        >
                          <img
                            :src="flagIcons.wetland"
                            class="flag-img"
                            alt="Wetland"
                          />
                        </el-tooltip>
                        <el-tooltip
                          v-if="scope.row.flood"
                          content="Flood"
                          placement="top"
                        >
                          <img
                            :src="flagIcons.flood"
                            class="flag-img"
                            alt="Flood"
                          />
                        </el-tooltip>
                        <el-tooltip
                          v-if="scope.row.has_history"
                          content="Historic building"
                          placement="top"
                        >
                          <img
                            :src="flagIcons.historic"
                            class="flag-img"
                            alt="Historic building"
                          />
                        </el-tooltip>
                        <el-tooltip
                          v-if="scope.row.has_openspace"
                          content="Open space"
                          placement="top"
                        >
                          <img
                            :src="flagIcons.openspace"
                            class="flag-img"
                            alt="Open space"
                          />
                        </el-tooltip>
                        <span v-if="!hasAnyFlag(scope.row)" class="flags-empty">
                          —
                        </span>
                      </div>
                    </template>
                  </el-table-column>

                  <!-- Utilization：built_utilization 进度条（紧接 Flags 后） -->
                  <el-table-column
                    prop="built_utilization"
                    label="Utilization"
                    width="140"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div class="utilization-cell">
                        <div
                          class="utilization-bar-wrap"
                          :class="
                            utilizationBarClass(scope.row.built_utilization)
                          "
                        >
                          <div
                            class="utilization-bar"
                            :style="{
                              width:
                                Math.min(
                                  Math.max(
                                    Number(scope.row.built_utilization) || 0,
                                    0
                                  ),
                                  100
                                ) + '%',
                            }"
                          ></div>
                        </div>
                        <span class="utilization-text">
                          {{
                            (scope.row.built_utilization != null
                              ? Number(scope.row.built_utilization)
                              : 0
                            ).toFixed(0)
                          }}%
                        </span>
                      </div>
                    </template>
                  </el-table-column>

                  <!-- <el-table-column
                    prop="historical"
                    label="HISTORICAL"
                    width="105"
                    align="center"
                  ></el-table-column> -->

                  <!-- Zoning 列：key 含选项长度+选中数，确保表头（含气泡）在选中变化时重新渲染 -->
                  <el-table-column
                    :key="
                      'zoning-' +
                      (cityZoningSelectionList || []).length +
                      '-' +
                      (selectedZoningTypes || []).length
                    "
                    prop="zoning"
                    label="Zoning Name"
                    width="180"
                    align="center"
                  >
                    <template slot="header">
                      <span>Zoning Name</span>
                      <span
                        v-if="hasZoningSelectionList"
                        class="column-filter-funnel-wrap"
                        @click.stop="openZoningDialog"
                      >
                        <span class="column-filter-funnel">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path
                              d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"
                            />
                          </svg>
                        </span>
                        <span
                          v-if="(selectedZoningTypes || []).length > 0"
                          class="column-filter-funnel-badge"
                        >
                          {{ (selectedZoningTypes || []).length }}
                        </span>
                      </span>
                    </template>
                    <template slot-scope="scope">
                      <span>{{ formatZoning(scope.row) }}</span>
                    </template>
                  </el-table-column>

                  <!-- 用户列 -->
                  <!-- <el-table-column prop="user" label="USER" width="150" align="center">
                            <template slot-scope="scope">
                                <span>{{ scope.row.user }}</span>
                            </template>
                        </el-table-column> -->

                  <!-- 操作列 -->
                  <el-table-column
                    label="Action"
                    min-width="120"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.row.show_address"
                        size="small"
                        @click="purchaseProperty(scope.row)"
                        class="action-col-btn"
                      >
                        Purchase
                      </el-button>
                      <el-button
                        v-if="scope.row.canDownload"
                        size="small"
                        @click="downloadProperty(scope.row)"
                        class="action-col-btn"
                      >
                        Download
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- 分页（独立于 results-panel 下方） -->
            <div class="pagination-container">
              <SearchPagination
                :total="totalResults"
                :current-page="currentPage"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zoning Type 筛选弹窗：按地点分组，按钮式选择 -->
    <el-dialog
      :visible.sync="zoningDialogVisible"
      width="680px"
      class="zoning-dialog"
      append-to-body
      :show-close="true"
    >
      <div slot="title" class="zoning-dialog-title-wrap">
        <div class="zoning-dialog-title">Filter by Zoning Type</div>
        <div class="zoning-dialog-subtitle">
          Select zoning types to filter properties
        </div>
      </div>
      <div class="zoning-dialog-body">
        <div
          :key="group.locationLabel"
          v-for="(group, gIndex) in zoningGroupsByLocation"
          class="zoning-group"
        >
          <div v-if="gIndex > 0" class="zoning-group-divider"></div>
          <div class="zoning-group-header">
            <span class="zoning-group-pin" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span class="zoning-group-location">
              {{ group.locationLabel || "—" }}
            </span>
            <span class="zoning-group-selected">
              {{ group.selectedCount }} selected
            </span>
          </div>
          <div class="zoning-group-buttons">
            <button
              v-for="item in group.items"
              :key="item.value"
              type="button"
              class="zoning-btn"
              :class="{ 'zoning-btn--active': item.selected }"
              @click="toggleZoning(item.value)"
            >
              {{ item.zoning }}
            </button>
          </div>
        </div>
      </div>
      <span slot="footer" class="zoning-dialog-footer">
        <button
          type="button"
          class="zoning-footer-clear"
          @click="clearAllZoning"
        >
          Clear All ({{ (dialogSelectedZoningTypes || []).length }})
        </button>
        <div class="zoning-footer-actions">
          <el-button
            class="zoning-footer-reset"
            @click="zoningDialogVisible = false"
          >
            Cancel
          </el-button>
          <el-button
            type="primary"
            class="zoning-footer-apply"
            @click="confirmZoningFilter"
          >
            Apply Filters
          </el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchComplex, buySearch, searchCity } from "@/apis";
import SearchPagination from "@/components/newui-202603/SearchPagination.vue";

function getInitialFilters() {
  return {
    lot_size_min: null,
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
    built_utilization_max: 0,
  };
}

export default {
  name: "SearchPage",
  components: { SearchPagination },
  watch: {
    $route() {
      this.init();
    },
    // 当当前筛选与初始值一致时，策略切回 All Listings（只显示一个 tab 时）
    isSameAsInitialFilters(val) {
      if (val && this.investmentStrategy !== "all_listings") {
        this.investmentStrategy = "all_listings";
      }
    },
  },
  computed: {
    // 当前左侧筛选是否与「进入页面第一次」记录的快照完全一致（逐项对比）
    isSameAsInitialFilters() {
      const snap = this.initialFilterSnapshot;
      if (!snap) return true;
      const f = this.filters;
      const keys = [
        "lot_size_min",
        "lot_size_max",
        "frontage_min",
        "frontage_max",
        "buildableSize_min",
        "buildableSize_max",
        "gfa_min",
        "gfa_max",
        "footprint_min",
        "footprint_max",
        "notHistoric",
        "notPartOfHistoric",
        "built_utilization_max",
        "no_envi_setback",
      ];
      for (const k of keys) {
        if (f[k] !== snap.filters[k]) return false;
      }
      const tagsEq =
        (this.selectedTags || []).length === (snap.selectedTags || []).length &&
        (this.selectedTags || []).every(
          (t, i) => (snap.selectedTags || [])[i] === t
        );
      if (!tagsEq) return false;
      const zoningEq =
        (this.selectedZoningTypes || []).length ===
          (snap.selectedZoningTypes || []).length &&
        (this.selectedZoningTypes || []).every(
          (z, i) => (snap.selectedZoningTypes || [])[i] === z
        );
      return zoningEq;
    },
    // 根据当前筛选是否为初始值决定 tab：与初始值一致只显示 All Listings，否则展示 All / Lot Splits / Expansion Plays
    visibleStrategyOptions() {
      const all = this.investmentStrategyOptions;
      const allListings = all.find((o) => o.value === "all_listings");
      if (this.isSameAsInitialFilters) {
        return allListings ? [allListings] : all.slice(0, 1);
      }
      return all.filter(
        (o) =>
          o.value === "all_listings" ||
          o.value === "lot_splits" ||
          o.value === "expansion_plays"
      );
    },
    // 列表接口返回的 Zoning 选项，用于弹窗渲染（扁平列表，兼容旧逻辑）
    zoningTypeOptions() {
      const list = this.cityZoningSelectionList || [];
      const seen = new Set();
      return list
        .filter((item) => {
          const key = `${item.city}|${item.zoning}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((item) => ({
          label: item.city ? `${item.city} - ${item.zoning}` : item.zoning,
          value: `${item.city}|${item.zoning}`,
        }));
    },
    // 按地点（city）分组的 Zoning 选项，用于弹窗按地点展示（选中状态用弹窗临时选中）
    zoningGroupsByLocation() {
      const list = this.cityZoningSelectionList || [];
      const selected = new Set(this.dialogSelectedZoningTypes || []);
      const byCity = new Map(); // city -> Set of value, 用于去重
      list.forEach((item) => {
        const city = item.city != null ? String(item.city).trim() : "";
        const value = `${item.city}|${item.zoning}`;
        if (!byCity.has(city)) byCity.set(city, new Map()); // city -> { value -> zoning } 去重
        const slot = byCity.get(city);
        if (!slot.has(value)) slot.set(value, item.zoning);
      });
      return Array.from(byCity.entries()).map(([locationLabel, slot]) => {
        const items = Array.from(slot.entries()).map(([value, zoning]) => ({
          value,
          zoning,
          selected: selected.has(value),
        }));
        const selectedCount = items.filter((i) => i.selected).length;
        return { locationLabel, items, selectedCount };
      });
    },
    // 有 Zoning 选项数据时才显示列头漏斗
    hasZoningSelectionList() {
      return (this.cityZoningSelectionList || []).length > 0;
    },
    formatButtonText() {
      console.log("aasdfasdfasdfadsf");
      const length = this.formatterPrice(this.totalResults || 0);
      const halfLength = this.formatterPrice(
        ((this.totalResults || 0) / 2).toFixed(2),
        2,
        2
      );
      return this.totalResults && this.totalResults > 0
        ? `${length} Result Points or $ ${halfLength} for Recharge and unlock Address`
        : "Recharge and unlock";
    },
    // Lot Size 输入框显示值：按当前单位在 sqft / acre 间转换，内部与接口仍为 sqft
    lotSizeMinDisplay: {
      get() {
        const v = this.filters.lot_size_min;
        if (v == null || v === "") return null;
        return this.lotSizeUnit === "acre" ? Number(v) / 43560 : Number(v);
      },
      set(val) {
        if (val == null || val === "") {
          this.filters.lot_size_min = null;
          return;
        }
        const num = Number(val);
        this.filters.lot_size_min = this.lotSizeUnit === "acre" ? num * 43560 : num;
      },
    },
    lotSizeMaxDisplay: {
      get() {
        const v = this.filters.lot_size_max;
        if (v == null || v === "") return null;
        return this.lotSizeUnit === "acre" ? Number(v) / 43560 : Number(v);
      },
      set(val) {
        if (val == null || val === "") {
          this.filters.lot_size_max = null;
          return;
        }
        const num = Number(val);
        this.filters.lot_size_max = this.lotSizeUnit === "acre" ? num * 43560 : num;
      },
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

      // Flags 列图标（土地性质）
      flagIcons: {
        wetland: require("@/assets/icons/wetland.png"),
        flood: require("@/assets/icons/flood.png"),
        historic: require("@/assets/icons/Historybuilding.png"),
        openspace: require("@/assets/icons/openspace.png"),
      },

      // 筛选条件
      filters: getInitialFilters(),
      lotSizeUnit: "acre", // sqft, acre
      lotSizeMinOptions: [
        {
          label: "0.25", // 是 acre 的值
          label2: "10,890", // 是 sqft 的单位值
          value: 10890,
        },
        {
          label: "0.5",
          label2: "21,780",
          value: 21780,
        },
        {
          label: "1",
          label2: "43,560",
          value: 43560,
        },
        {
          label: "1.5",
          label2: "65,340",
          value: 65340,
        },
        {
          label: "2",
          label2: "87,120",
          value: 87120,
        },
        {
          label: "5",
          label2: "217,800",
          value: 217800,
        },
        {
          label: "10",
          label2: "435,600",
          value: 435600,
        },
        {
          label: "20",
          label2: "871,200",
          value: 871200,
        },
        {
          label: "50",
          label2: "2,178,000",
          value: 2178000,
        },
        {
          label: "100",
          label2: "4,356,000",
          value: 4356000,
        },
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

      // 投资策略 + 区域叠加
      investmentStrategy: "all_listings",
      investmentStrategyOptions: [
        { label: "All Listings", value: "all_listings" },
        { label: "Lot Splits", value: "lot_splits" },
        { label: "Density Plays", value: "density_plays" },
        { label: "Expansion Plays", value: "expansion_plays" },
        { label: "ADU Eligible", value: "adu_eligible" },
      ],
      zoneOverlays: {
        oppZones: false,
        transitZones: false,
      },

      // Zoning 列筛选（数据来自列表接口 cityZoningSelectionList）
      zoningDialogVisible: false,
      selectedZoningTypes: [], // 已生效的选中（表头气泡、接口），仅点击 Apply Filters 后更新
      dialogSelectedZoningTypes: [], // 弹窗内临时选中，用于弹窗内展示与操作
      cityZoningSelectionList: [], // { city, zoning, selection }[]

      // 进入页面第一次时左侧表单筛选的快照，用于与当前筛选逐项对比
      initialFilterSnapshot: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // Property 列：Address + 家庭类型（use_desc）
    // formatProperty(row) {
    //   const addr = row.show_address || "";
    //   const useDesc = row.use_desc || "";
    //   if (!addr && !useDesc) return "—";
    //   return [addr, useDesc].filter(Boolean).join(" ");
    // },
    // Utilization 进度条颜色：<40% 绿，40–60% 黄，>60% 红
    utilizationBarClass(val) {
      const n = Number(val);
      if (n < 40) return "utilization-green";
      if (n <= 60) return "utilization-yellow";
      return "utilization-red";
    },
    hasAnyFlag(row) {
      return !!(
        row.has_wetland ||
        row.flood ||
        row.has_history ||
        row.historical ||
        row.openspace ||
        row.has_openspace
      );
    },
    // Zoning 列：优先 policy_zoning，其次 gis_zoning
    formatZoning(row) {
      const v = row.policy_zoning || row.gis_zoning;
      return v && String(v).trim() ? v : "—";
    },
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
      // 在首屏渲染后再记录快照，避免 el-slider 等组件挂载时把 null 写成默认值导致“当前≠初始”
      this.$nextTick(() => {
        this.initialFilterSnapshot = this.getCurrentFilterSnapshot();
      });
    },
    // 深拷贝当前左侧筛选状态，用于初始快照与后续对比
    getCurrentFilterSnapshot() {
      const f = this.filters;
      return {
        filters: {
          lot_size_min: f.lot_size_min,
          lot_size_max: f.lot_size_max,
          frontage_min: f.frontage_min,
          frontage_max: f.frontage_max,
          buildableSize_min: f.buildableSize_min,
          buildableSize_max: f.buildableSize_max,
          gfa_min: f.gfa_min,
          gfa_max: f.gfa_max,
          footprint_min: f.footprint_min,
          footprint_max: f.footprint_max,
          notHistoric: f.notHistoric,
          notPartOfHistoric: f.notPartOfHistoric,
          built_utilization_max: f.built_utilization_max,
          no_envi_setback: f.no_envi_setback,
        },
        selectedTags: (this.selectedTags || []).slice(),
        selectedZoningTypes: (this.selectedZoningTypes || []).slice(),
      };
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
      this.$prompt("Please input City/Zip", "Add Tag", {
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

    openZoningDialog() {
      this.dialogSelectedZoningTypes = [...(this.selectedZoningTypes || [])];
      this.zoningDialogVisible = true;
    },
    toggleZoning(value) {
      const arr = this.dialogSelectedZoningTypes || [];
      const idx = arr.indexOf(value);
      if (idx >= 0) {
        this.dialogSelectedZoningTypes = arr.filter((_, i) => i !== idx);
      } else {
        this.dialogSelectedZoningTypes = [...arr, value];
      }
    },
    clearAllZoning() {
      this.dialogSelectedZoningTypes = [];
    },
    confirmZoningFilter() {
      this.selectedZoningTypes = [...(this.dialogSelectedZoningTypes || [])];
      this.zoningDialogVisible = false;
      this.searchProperties(false);
    },

    // 应用筛选（Lot Size 已通过 v-model 绑定 filters，无需转换）
    applyFilters() {
      this.searchProperties(true);
    },

    // 重置筛选
    resetFilters() {
      this.filters = getInitialFilters();
      this.selectedTags = [];
    },

    // Opp Zones 勾选：切换状态并触发搜索，勾选时传 in_opp = true
    handleOppZonesChange() {
      this.zoneOverlays.oppZones = !this.zoneOverlays.oppZones;
      this.searchProperties(true);
    },

    // 投资策略 tab 切换：更新选中项并重新请求列表（重置到第一页）
    handleStrategyChange(value) {
      if (this.investmentStrategy === value) return;
      this.investmentStrategy = value;
      this.searchProperties(true);
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
                    : item
                )
                .join(",")
            : null,
        // Zoning 筛选：格式 city:zoning 多个用逗号分隔，如 AMESBURY:R8,AMESBURY:RC
        city_zoning:
          this.selectedZoningTypes?.length > 0
            ? this.selectedZoningTypes.map((v) => v.replace("|", ":")).join(",")
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
        has_history: this.filters.notHistoric ? true : null,
        // in_history: this.filters.notPartOfHistoric ? false : null,
        built_utilization_max: this.filters.built_utilization_max || null,
        no_envi_setback: this.filters.no_envi_setback || null,
        lot_split: this.investmentStrategy === "lot_splits",
        expansion_plays: this.investmentStrategy === "expansion_plays",
        ...(this.zoneOverlays.oppZones ? { in_opp: true } : {}),
      })
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.resultList || [];
          this.totalResults = res.data.total || 0;
          this.searchParams = res.data.searchParams;
          const list = res.data.cityZoningSelectionList || [];
          this.cityZoningSelectionList = list;
          // 同步弹窗勾选状态：接口里 selection 为 true 的项
          this.selectedZoningTypes = list
            .filter((item) => item.selection === true)
            .map((item) => `${item.city}|${item.zoning}`);
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
          "No properties to unlock. Please perform a search first."
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
            "Recharge successful! You can now unlock addresses."
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
  flex: 1;
}

/* 宽度由 search-main-wrap 约束，左右不再单独设 padding，与上方栏对齐 */
.search-content {
  display: flex;
  gap: var(--search-gap);
  padding: var(--search-gap) 0 20px 0;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 8px 0 10px 0;
    gap: var(--search-gap);
  }
}

/* 左侧筛选面板 */
.filter-panel {
  width: 280px;
  min-width: 280px;
  flex-shrink: 0;
  background: white;
  border-radius: 8px;
  padding: 20px;
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
    // background-color: #c8e6c9;
    background-color: #cefef6;
    // color: #2e7d32;
    color: #1A1A1A;
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

/* Lot Size 数字输入框隐藏 +1/-1 步进控件 */
.lot-size-section .range-input ::v-deep input[type="number"] {
  -moz-appearance: textfield;

  padding-right: 15px;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

/* Lot Size 单位切换：参考图样式，选中项白底圆角框+深色字，未选中灰色字 */
.lot-size-unit-switcher {
  display: inline-flex;
  align-items: center;
  padding: 2px;
  background: #f6f6f4;
  border: 1px solid #e2e6e8;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;

  .lot-size-unit-item {
    padding: 3px 7px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #7f8c8d;
    cursor: pointer;
    transition: color 0.2s, background 0.2s, box-shadow 0.2s;
    font-weight: 600;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &.active {
      background: #fff;
      color: #2c3e50;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    &:not(:disabled):not(.active):hover {
      color: #5d6d7e;
    }
  }
}

.slider-container {
  width: calc(100% - 16px);
  padding: 8px 0;
  margin: 0 auto;

  .utilization-slider {
    ::v-deep .el-slider__runway {
      background-color: #2e7d32;
      background-color: #0B2124;
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
  display: flex;
  gap: 10px;
  align-items: center;

  .btn-base {
    padding: 12px 16px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .reset-btn {
    flex-shrink: 0;
    // background-color: ;
    background-color: #e7ecea;
    // border-color: #e0e0e0;
    border: none;
    color: #0b2e24;
    font-weight: 500;
    font-size: 14px;

    &:hover {
      background-color: transparent;
      border-color: #d0d0d0;
      color: #333;
    }

    &:disabled {
      background-color: transparent;
      border-color: #eee;
      color: #bbb;
    }
  }

  .apply-btn {
    flex: 1;
    margin-left: 0;
    background-color: #0B2124;
    border-color: #0B2124;
    color: white;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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

.right-result-area {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  flex: 1;
  min-width: 0; /* 防止表格 min-width 把整块撑宽，保证与上方 ZONE OVERLAYS 对齐 */
}

/* 右侧结果面板 */
.results-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.results-header {
  display: none; /* 隐藏结果头部（面包屑、结果数等） */
  padding: 24px 24px 0;

  .results-info {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: var(--search-gap);

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

/* 表格样式 */
.search-table {
  ::v-deep .el-table__header {
    background-color: #F7F7F5;

    th {
      background-color: #F7F7F5 !important;
      color: #717182;
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
      background-color: #F7F7F5;
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
}

/* Utilization 进度条：进度条与百分比同一行不换行 */
.utilization-cell {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.utilization-bar-wrap {
  flex: 1;
  min-width: 0;
  max-width: 80px;
  height: 8px;
  background: #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}
.utilization-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.2s ease;
}
.utilization-bar-wrap.utilization-green .utilization-bar {
  background: #67c23a;
}
.utilization-bar-wrap.utilization-yellow .utilization-bar {
  background: #e6a23c;
}
.utilization-bar-wrap.utilization-red .utilization-bar {
  background: #f56c6c;
}
.utilization-text {
  font-size: 12px;
  color: #717182;
}

/* Flags 土地性质图标（使用 assets 图标） */
.flags-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}
.flag-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  display: block;
  cursor: default;
}
.flags-empty {
  color: #c0c4cc;
  font-size: 12px;
}

/* 表头漏斗图标（Zoning & ADU 列） */
.search-table ::v-deep .column-filter-funnel-wrap {
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  vertical-align: middle;
}
.search-table ::v-deep .column-filter-funnel {
  display: inline-flex;
  align-items: center;
  color: #717182;
}
.search-table ::v-deep .column-filter-funnel-wrap:hover .column-filter-funnel {
  color: #5a8dee;
}
.search-table ::v-deep .column-filter-funnel-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #67c23a;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

/* Zoning Type 弹窗：按地点分组 + 按钮式选择 */
.zoning-dialog .el-dialog__header {
  padding-bottom: 8px;
}
.zoning-dialog-title-wrap {
  padding-right: 32px;
}
.zoning-dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
}
.zoning-dialog-subtitle {
  font-size: 13px;
  color: #717182;
  margin-top: 4px;
}
.zoning-dialog-body {
  padding: 8px 0;
  max-height: 60vh;
  overflow-y: auto;
}
.zoning-group {
  margin-bottom: 16px;
}
.zoning-group:last-child {
  margin-bottom: 0;
}
.zoning-group-divider {
  height: 1px;
  background: #e8e8e8;
  margin: 12px 0 14px;
}
.zoning-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.zoning-group-pin {
  color: #c53030;
  display: inline-flex;
  align-items: center;
}
.zoning-group-location {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}
.zoning-group-selected {
  margin-left: auto;
  font-size: 12px;
  color: #717182;
}
.zoning-group-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.zoning-btn {
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 6px;
  /* border: 1px solid #67c23a; */
  color: #717182;
  background: #fff;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-color: #333;
  outline: none;
  border: none;
  border: 2px solid #efefef;
  color: #1a1a1a;
  padding: 12px 25px;
}
.zoning-btn:hover {
  border-color: #10b981;
  color: #10b981;
}
.zoning-btn--active {
  background: #f0fdf4;
  border-color: #10b981;
  color: #10b981;
}
.zoning-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.zoning-footer-clear {
  font-size: 13px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.zoning-footer-clear:hover {
  text-decoration: underline;
}
.zoning-footer-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
/* 右下角按钮样式与左侧 Reset / Apply Filters 一致 */
.zoning-dialog ::v-deep .zoning-footer-reset {
  padding: 12px 16px;
  border-radius: 4px;
  background-color: transparent !important;
  border-color: #e0e0e0 !important;
  color: #555 !important;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}
.zoning-dialog ::v-deep .zoning-footer-reset:hover {
  background-color: transparent !important;
  border-color: #d0d0d0 !important;
  color: #333 !important;
}
.zoning-dialog ::v-deep .zoning-footer-apply {
  padding: 12px 16px;
  border-radius: 4px;
  background-color: #1a1a1a !important;
  border-color: #1a1a1a !important;
  color: #fff !important;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
.zoning-dialog ::v-deep .zoning-footer-apply:hover {
  background-color: #2a2a2a !important;
  border-color: #2a2a2a !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}
.zoning-dialog ::v-deep .zoning-footer-apply:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.search-table .address-text {
  color: #717182;
}

/* 操作列按钮：参考 apply filter，更小尺寸 + 默认透明，悬停显示背景 */
.action-col-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid #1a1a1a;
  color: #1a1a1a;
  background-color: transparent;
  transition: all 0.3s ease;
  box-shadow: none;

  &:hover {
    background-color: #1a1a1a;
    border-color: #1a1a1a;
    color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: #2a2a2a;
    border-color: #2a2a2a;
  }
}

/* 分页容器：包裹 SearchPagination 组件 */
.pagination-container {
  padding: 16px 0;
  margin-top: 16px;
  border-radius: 6px;
}
.results-breadcrumb {
  font-size: 13px;
  margin-bottom: var(--search-gap);
}

/* 统一间距变量，与 layout .content 的 padding-top 一致 */
.search-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  --search-gap: 24px;
}

/* 统一宽度容器：ZONE OVERLAYS 与下方表格区域共用此宽度，保证右侧对齐 */
.search-main-wrap {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 顶部不留白，由 layout .content padding-top 提供；宽度由 search-main-wrap 约束 */
.strategy-overlay-bar-wrap {
  width: 100%;
  box-sizing: border-box;
}

.strategy-overlay-bar {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  box-sizing: border-box;
}

.bar-section-title {
  font-size: 11px;
  font-weight: 600;
  color: #717182;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 10px 0;
}

.strategy-section {
  flex: 1;
  min-width: 0;
}

.strategy-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.strategy-tab {
  padding: 8px 4px;
  margin: 0 4px 0 0;
  font-size: 14px;
  color: #717182;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.strategy-tab:hover {
  color: #717182;
}

.strategy-tab.active {
  color: #2c3e50;
  font-weight: 700;
  // border-bottom: 4px solid #67c23a;
  border-bottom: 4px solid #007855;
}

.overlays-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.overlay-toggles {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.overlay-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 14px;
  color: #717182;
  background: #fff;
  border: 1px solid #dcdfe6;
  // border-radius: 6px;
  border-radius: 100px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.overlay-btn:hover {
  border-color: #c0c4cc;
}

.overlay-btn.active {
  // border-color: #67c23a;
  border-color: #10B981;
  background: #f0f9eb;
}

.overlay-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  font-size: 12px;
  // color: #67c23a;
  color: #10B981;
  // background-color: #10B981;
}

.overlay-btn.active .overlay-checkbox {
  border-color: #10B981;
  background: #fff;
}

.overlay-icon {
  display: inline-flex;
  color: #717182;
}

.overlay-label {
  color: #1A1A1A;
  white-space: nowrap;
}
/* 响应式调整 */
@media (max-width: 1200px) {
  .search-content {
    gap: var(--search-gap);
  }

  .filter-panel {
    width: 240px;
    min-width: 200px;
  }
}

@media (max-width: 992px) {
  .filter-panel {
    width: 220px;
    min-width: 200px;
  }

  .search-table {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .search-main-wrap {
    padding: 0 10px 0;
  }
  .search-content {
    padding: var(--search-gap) 0 10px 0;
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
