<template>
    <div class="group-report">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2 class="page-title">Group Report</h2>
        </div>

        <!-- 表格区域 -->
        <div class="table-section">
            <el-table :data="tableData" v-loading="loading" style="width: 100%" row-key="id" class="report-table" size="small">
                <!-- MARK列 - 星标和上传图标 -->
                <el-table-column prop="mark" label="MARK" width="80" align="center">
                    <template slot-scope="scope">
                        <div class="mark-icons"  @click="changeTop(scope.row.report_id, scope.row.top)">
                            <img v-if="scope.row.top" src="@/assets/icons/uploaded.png" alt="Star"
                                class="mark-icon star-icon" />
                            <img v-else src="@/assets/icons/uploaded_grey.png" alt="Upload"
                                class="mark-icon upload-icon" />
                        </div>
                    </template>
                </el-table-column>

                <!-- ADDRESS列 -->
                <el-table-column prop="address" label="ADDRESS" min-width="170">
                    <template slot-scope="scope">
                        <span class="address-text">{{ scope.row.address }}</span>
                    </template>
                </el-table-column>

                <!-- FRONTAGE列 -->
                <el-table-column prop="frontage" label="FRONTAGE" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state == 4">{{ (scope.row.frontage_ft || 0).toFixed(2) }} ft</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>

                <!-- LOT SIZE列 -->
                <el-table-column prop="lot_size_sgft" label="LOT SIZE" width="120" align="center">
                    <template slot-scope="scope">
                        <span>{{ ((scope.row.lot_size_sqft || 0)/43560).toFixed(2) }} acer</span>
                    </template>
                </el-table-column>

                <!-- BUILDABLE SIZE列 -->
                <el-table-column prop="buildable_sgft" label="BUILDABLE SIZE" width="150" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state == 4">{{ (scope.row.buildable_sqft || 0).toFixed(2) }} sqft</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>

                <!-- USER列 -->
                <el-table-column prop="user_email" label="USER" width="150" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.user_email }}</span>
                    </template>
                </el-table-column>
                <!-- pay_type -->
                <el-table-column prop="pay_type" label="TYPE" width="120" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.pay_type === 0 ? 'Normal' : 'Advanced' }}</span>
                    </template>
                </el-table-column>

                <!-- Report列 -->
                <el-table-column label="Report" min-width="170">
                    <template slot-scope="scope">
                        <div style="display: flex; align-items: center; gap: 5px;flex-wrap: wrap;">
                            <el-button v-if="scope.row.status === 'processing'" type="info" size="small" disabled
                                class="report-btn processing">
                                Processing
                            </el-button>
                            <el-button v-if="scope.row.pay_type === 0 && scope.row.state == 4" size="mini" type="primary" @click="downloadReport(scope.row.pdf_url)">Download</el-button>
                            <el-button v-if="scope.row.pay_type === 2 && scope.row.state == 4" size="mini" type="primary" @click="downloadReport(scope.row.pdf_url)">Ordinary</el-button>
                            <el-button v-if="scope.row.pay_type === 2 && scope.row.state == 4 && scope.row.advance_pdf_url" size="mini" type="primary" @click="downloadReport(scope.row.advance_pdf_url)">Premium</el-button>
                            <div v-if="scope.row.state != 4">Processing</div>
                        </div>
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
import { groupReportList, myReportList, topReport } from '@/apis';
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
            if(!this.$route.query.reportType || this.$route.query.reportType === '1') {
                groupReportList({page: this.page - 1, size: this.size}).then(response => {
                    if (response.data && response.data.items) {
                        this.tableData = response.data.items
                        this.total = response.data.total;
                    }
                    this.loading = false;
                }).finally(() => {
                    this.loading = false;
                });
            } else {
                myReportList({page: this.page - 1, size: this.size}).then(response => {
                    if (response.data && response.data.items) {
                        this.tableData = response.data.items
                        this.total = response.data.total;
                    }
                    this.loading = false;
                }).finally(() => {
                    this.loading = false;
                });
            }
            
            
        },

        // 生成模拟数据
        generateMockData() {
            const mockList = []
            const totalCount = 47 // 模拟总数据量

            for (let i = 0; i < this.page; i++) {
                const index = (this.currentPage - 1) * this.page + i + 1
                if (index > totalCount) break

                // 根据索引决定状态和图标
                const isProcessing = index <= 3
                const hasUpload = index >= 4 && index <= 7
                const isStarred = index <= 3 || (index >= 4 && index <= 6)

                mockList.push({
                    id: index,
                    address: '10 STILLMEADOW RD, WESTON, MA',
                    frontage: '2372.49 ft',
                    lotSize: '88.00 acre',
                    buildableSize: '8321 sqft',
                    user: 'Ola Boluwatife',
                    status: isProcessing ? 'processing' : 'completed',
                    starred: isStarred,
                    uploaded: hasUpload
                })
            }

            return {
                list: mockList,
                total: totalCount
            }
        },

        // 下载报告
        handleDownload(row) {
            this.$message.success(`下载 ${row.address} 的报告`)
            // 这里可以实现实际的下载逻辑
        },

        // 每页数量改变
        handleSizeChange(val) {
            this.page = val
            this.currentPage = 1
            this.loadData()
        },
        changeTop(id, top) {
            const loading = this.$loading({
                lock: true,
                text: 'loading...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            topReport(id, !top).then(() => {
                this.$message.success('Change successfully')
                this.loadData()
                loading.close()
            }).catch(() => {
                loading.close()
            })
        },
        // 当前页改变
        handleCurrentChange(val) {
            this.currentPage = val
            this.loadData()
        },
        downloadReport(url) {
            window.open(url, '_blank')
        }
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
