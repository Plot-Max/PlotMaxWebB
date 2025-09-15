<template>
    <div class="account-management">
        <div class="page-header">
            <h2 class="page-title">Account management</h2>
        </div>

        <!-- 搜索区域 -->
        <div class="search-section">
            <el-input v-model="searchKeyword" placeholder="Search Account" prefix-icon="el-icon-search"
                class="search-input" @keyup.enter="handleSearch" clearable/>
            <el-button type="primary" class="search-btn" @click="handleSearch">
                Search
            </el-button>
            <el-button type="info" class="add-btn" @click="handleAddNew" v-if="userInfo?.user_role == 0">
                Add new
            </el-button>
        </div>

        <!-- 表格区域 -->
        <div class="table-section">
            <el-table :data="tableData" v-loading="loading" style="width: 100%" row-key="id">
                <el-table-column prop="userEmail" label="Account/Email" width="250">
                    <template slot-scope="scope">
                        <span class="email-text">{{ scope.row.userEmail }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="createdAt" label="Created Time" align="center">
                    <template slot-scope="scope">
                        <span>{{ formatDate(scope.row.create_at) }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="status" label="State"></el-table-column> -->

                <el-table-column prop="lastLogin" label="Last active Time" align="center">
                    <template slot-scope="scope">
                        <span>{{ formatDate(scope.row.active_time) }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="OPERATE" width="150" align="center" fixed="right" v-if="userInfo?.user_role == 0">
                    <template slot-scope="scope">
                        <el-link type="primary" size="mini" @click="handleEdit(scope.row)">
                            Edit
                        </el-link>
                        <el-link type="primary" size="mini" class="margin-l10" @click="handleDelete(scope.row)" v-if="scope.row.user_role == 1">
                            Delete
                        </el-link>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <!-- <div class="pagination-section">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" />
            </div> -->
        </div>

        <!-- 添加/编辑对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" @close="resetForm">
            <el-form :model="form" :rules="rules" ref="accountForm" label-width="120px" label-position="left">
                <el-form-item label="Account/Email" prop="username" :rules="
                    [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                    ]
                ">
                    <el-input v-model="form.username" placeholder="请输入邮箱地址" :disabled="isEdit"/>
                </el-form-item>

                <el-form-item label="Password" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleSubmit">OK</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listGroupUser, addGroupUser, rePassword, deleteGroupUser } from '@/apis'
import MapStateMixins from '../mixins/MapStateMixins'
export default {
    name: 'AccountManagement',
    mixins: [MapStateMixins],
    data() {
        return {
            // 搜索关键词
            searchKeyword: '',

            // 表格数据
            tableData: [],
            loading: false,

            // 分页相关
            currentPage: 1,
            pageSize: 10,
            total: 0,

            // 对话框相关
            dialogVisible: false,
            dialogTitle: 'Add New Account',
            isEdit: false,

            // 表单数据
            form: {
                id: null,
                username: '',
                password: '',
            },

            // 表单验证规则
            rules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
                ]
            }
        }
    },

    mounted() {
        this.loadData()
    },

    methods: {
        // 加载数据
        loadData() {
            this.loading = true
            listGroupUser(this.searchKeyword).then(response => {
                this.tableData = response.data
                this.loading = false
            }).catch(error => {
                this.$message.error('加载数据失败')
                this.loading = false
            })
        },

        // 搜索
        handleSearch() {
            this.currentPage = 1
            this.loadData()
        },

        // 添加新账户
        handleAddNew() {
            this.dialogTitle = 'Add New Account'
            this.isEdit = false
            this.dialogVisible = true
            this.form = {
                id: null,
                username: '',
                password: '',
                role: 'GROUP_USER'
            }
        },

        // 编辑账户
        handleEdit(row) {
            this.dialogTitle = 'Edit Account'
            this.isEdit = true
            this.form = {
                id: row.id,
                username: row.userEmail,
                userId: row.userId,
                password: '',
                role: 'GROUP_USER'
            }
            this.dialogVisible = true
        },

        // 删除账户
        handleDelete(row) {
            this.$confirm(`Confirm delete group user ${row.username}`, 'Warning', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                deleteGroupUser(row.userId).then(response => {
                    this.$message.success('Deleted successfully')
                    this.loadData()
                }).catch(error => {
                    this.$message.error('Failed to delete')
                })
            })
        },

        // 提交表单
        handleSubmit() {
            this.$refs.accountForm.validate((valid) => {
                if (valid) {
                    // 模拟保存操作
                    this.form.rePassword = this.form.password
                    if(this.isEdit) {
                        rePassword(this.form.userId, this.form.password, this.form.password).then(response => {
                            this.$message.success('Password updated successfully')
                            this.dialogVisible = false
                            this.loadData()
                        })
                    }
                    else {
                        addGroupUser(this.form).then(response => {
                            this.$message.success('Add new account successfully')
                            this.dialogVisible = false
                            this.loadData()
                        })
                    }
                    
                }
            })
        },

        // 重置表单
        resetForm() {
            if (this.$refs.accountForm) {
                this.$refs.accountForm.resetFields()
            }
            this.form = {
                id: null,
                email: '',
                password: '',
                active: true
            }
        },

        // 每页数量改变
        handleSizeChange(val) {
            this.pageSize = val
            this.currentPage = 1
            this.loadData()
        },

        // 当前页改变
        handleCurrentChange(val) {
            this.currentPage = val
            this.loadData()
        },

        // 格式化日期
        formatDate(dateStr) {
            if (!dateStr) return ''
            return this.$dayjs(dateStr).format('DD/MM/YYYY HH:mm:ss')
        },
    }
}
</script>

<style lang="scss" scoped>
.account-management {
    padding: 0px 20px 20px 20px;
    background: #fff;
    min-height: 80vh;

    .page-header {
        margin-bottom: 20px;

        .page-title {
            color: #2c3e50;
            font-size: 24px;
            font-weight: 600;
            margin: 0;
        }
    }

    .search-section {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        .search-input {
            width: 300px;
        }

        .search-btn {
            min-width: 80px;
        }

        .add-btn {
            min-width: 80px;
        }
    }

    .table-section {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;

        .email-text {
            color: #5A8DEE;
            font-weight: 500;
        }

        .pagination-section {
            padding: 20px;
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid #ebeef5;
        }
    }

    // ElementUI 表格样式覆盖
    ::v-deep .el-table {
        .el-table__header {
            background-color: #f8f9fa;

            th {
                background-color: #f8f9fa !important;
                color: #5A8DEE;
                font-weight: 600;
                border-bottom: 2px solid #e9ecef;
            }
        }

        .el-table__row {
            &:hover {
                background-color: #f8f9ff;
            }
        }
    }

    // 对话框样式
    ::v-deep .el-dialog {
        .el-dialog__header {
            padding: 15px 20px;

            .el-dialog__title {
                font-weight: 600;
            }
        }

        .el-dialog__body {
            padding: 30px 20px;
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

    // 按钮样式
    .el-button--mini {
        padding: 5px 10px;
        font-size: 12px;
    }

    // 标签样式
    .el-tag--success {
        background-color: #f0f9ff;
        border-color: #5A8DEE;
        color: #5A8DEE;
    }
}
</style>
