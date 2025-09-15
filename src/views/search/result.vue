<template>
    <div class="group-report">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2 class="page-title">Search Results</h2>
        </div>

        <!-- 表格区域 -->
        <div class="table-section">
            <el-table :data="tableData" 
                v-loading="loading" style="width: 100%" row-key="id" class="report-table" size="small">
                <el-table-column prop="create_at" label="Date/Time" width="140">
                    <template slot-scope="{row}">
                        <span class="address-text">{{ $dayjs(row.create_at).format('MM/DD/YYYY HH:mm:ss') }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="search_params" label="Condition" align="center">
                    <template slot-scope="{row}">
                        <span>{{ formatSearchParams(row.search_params) }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="search_count" label="QTY" width="70" align="center"></el-table-column>

                
                <el-table-column label="Operate" width="120" align="center" fixed="right">
                    <template slot-scope="{ row }">
                        <el-button type="text" size="mini" @click="$router.push({path: '/search', query:{mode: 1, ...row.search_params}})">View</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <div class="pagination-section">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" />
            </div>
        </div>
    </div>
</template>

<script>
import { searchOrderList } from '@/apis';
export default {
    name: 'GroupReport',
    data() {
        return {
            // 表格数据
            tableData: [],
            loading: false,

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
                    // 如果没有数据，清空表格
                    this.tableData = []
                    this.total = 0
                }
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
            
        },
        purchaseProperty(row) {
            this.$router.push({path: '/choose-service', query: {
                full_addr: '',
                gid: row.gid
            }})
        },
        // 每页数量改变
        handleSizeChange(val) {
            this.page = val
            this.currentPage = 1
            this.loadData()
        },
        // 当前页改变
        handleCurrentChange(val) {
            this.currentPage = val
            this.loadData()
        },
    }
}
</script>

<style lang="scss" scoped>
.group-report {
    padding: 20px;
    background: #f5f7fa;
    min-height: calc(100vh - 80px);

    .page-header {
        margin-bottom: 20px;

        .page-title {
            color: #2c3e50;
            font-size: 24px;
            font-weight: 600;
            margin: 0;
        }
    }

    .table-section {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;

        .mark-icons {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            cursor: pointer;

            .mark-icon {
                width: 16px;
                height: 16px;
                object-fit: contain;

                &.star-icon {
                    width: 14px;
                    height: 14px;
                }

                &.upload-icon {
                    width: 14px;
                    height: 14px;
                }
            }
        }

        .address-text {
            color: #2c3e50;
            font-weight: 500;
        }

        .report-btn {
            min-width: 80px;

            &.processing {
                background: #909399;
                border-color: #909399;
                cursor: not-allowed;
            }

            &.download {
                background: #5A8DEE;
                border-color: #5A8DEE;

                &:hover {
                    background: #4A7CE8;
                    border-color: #4A7CE8;
                }
            }
        }

        .pagination-section {
            padding: 20px;
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid #ebeef5;
        }
    }
}

// ElementUI 表格样式覆盖
::v-deep .report-table {
    .el-table__header {
        background-color: #f8f9fa;

        th {
            background-color: #f8f9fa !important;
            color: #5A8DEE;
            font-weight: 600;
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

    // 固定列样式
    .el-table__fixed-right {
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    }
}

// 分页样式
::v-deep .el-pagination {
    .el-pager li.active {
        color: #5A8DEE;
        border-color: #5A8DEE;
    }

    .btn-prev,
    .btn-next {
        &:hover {
            color: #5A8DEE;
        }
    }

    .el-pagination__jump {
        .el-input__inner {
            border-color: #5A8DEE;

            &:focus {
                border-color: #5A8DEE;
            }
        }
    }
}

// 响应式设计
@media (max-width: 1200px) {
    .group-report {
        padding: 15px;

        .table-section {
            overflow-x: auto;
        }
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

        .pagination-section {
            padding: 15px 10px;
            justify-content: center;
        }
    }
}
</style>
