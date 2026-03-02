<template>
  <div class="account-management">
    <div class="page-header">
      <h2 class="page-title">Account management</h2>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <SearchInput
        v-model="searchKeyword"
        placeholder="Search Account"
        clearable
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" class="search-btn" @click="handleSearch">
        Search
      </el-button>
      <el-button
        type="info"
        class="add-btn"
        @click="handleAddNew"
        v-if="userInfo?.user_role == 0"
      >
        Add new
      </el-button>
    </div>

    <!-- 表格区域 -->
    <DataTable
      :data="tableData"
      :loading="loading"
      :columns="tableColumns"
      :show-pagination="false"
    >
      <!-- Account/Email列 -->
      <template v-slot:userEmail="{ row }">
        <span class="email-text">{{ row.userEmail }}</span>
      </template>

      <!-- Created Time列 -->
      <template v-slot:createdAt="{ row }">
        <span>{{ formatDate(row.create_at) }}</span>
      </template>

      <!-- Last active Time列 -->
      <template v-slot:lastLogin="{ row }">
        <span>{{ formatDate(row.active_time) }}</span>
      </template>

      <!-- OPERATE列 -->
      <template v-slot:operate="{ row }">
        <BasicButton
          type="text"
          size="small"
          class="operate-btn"
          @click="handleEdit(row)"
        >
          Edit
        </BasicButton>
        <BasicButton
          type="text"
          size="small"
          class="operate-btn margin-l10"
          @click="handleDelete(row)"
          v-if="row.user_role == 1"
        >
          Delete
        </BasicButton>
      </template>
    </DataTable>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="accountForm"
        label-width="120px"
        label-position="left"
      >
        <el-form-item
          label="Account/Email"
          prop="username"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="form.username"
            placeholder="请输入邮箱地址"
            :disabled="isEdit"
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
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
import {
  listGroupUser,
  addGroupUser,
  rePassword,
  deleteGroupUser,
} from "@/apis";
import SearchInput from "@/components/newui-202603/SearchInput.vue";
import BasicButton from "@/components/newui-202603/BasicButton.vue";
import DataTable from "@/components/newui-202603/DataTable.vue";
import MapStateMixins from "../mixins/MapStateMixins";
export default {
  name: "AccountManagement",
  mixins: [MapStateMixins],
  components: {
    SearchInput,
    BasicButton,
    DataTable,
  },
  data() {
    return {
      // 搜索关键词
      searchKeyword: "",

      // 表格数据
      tableData: [],
      loading: false,

      // 表格列配置
      tableColumns() {
        const columns = [
          { prop: "userEmail", label: "Account/Email", width: 250, slot: "userEmail" },
          { prop: "createdAt", label: "Created Time", align: "center", slot: "createdAt" },
          { prop: "lastLogin", label: "Last active Time", align: "center", slot: "lastLogin" },
        ];
        if (this.userInfo?.user_role == 0) {
          columns.push({ prop: "operate", label: "OPERATE", width: 200, align: "center", fixed: "right", slot: "operate" });
        }
        return columns;
      },

      // 分页相关
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // 对话框相关
      dialogVisible: false,
      dialogTitle: "Add New Account",
      isEdit: false,

      // 表单数据
      form: {
        id: null,
        username: "",
        password: "",
      },

      // 表单验证规则
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    // 加载数据
    loadData() {
      this.loading = true;
      listGroupUser(this.searchKeyword)
        .then((response) => {
          this.tableData = response.data;
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error("加载数据失败");
          this.loading = false;
        });
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1;
      this.loadData();
    },

    // 添加新账户
    handleAddNew() {
      this.dialogTitle = "Add New Account";
      this.isEdit = false;
      this.dialogVisible = true;
      this.form = {
        id: null,
        username: "",
        password: "",
        role: "GROUP_USER",
      };
    },

    // 编辑账户
    handleEdit(row) {
      this.dialogTitle = "Edit Account";
      this.isEdit = true;
      this.form = {
        id: row.id,
        username: row.userEmail,
        userId: row.userId,
        password: "",
        role: "GROUP_USER",
      };
      this.dialogVisible = true;
    },

    // 删除账户
    handleDelete(row) {
      // this.$confirm(`Confirm delete group user ${row.username}`, 'Warning', {
      this.$confirm(`Confirm delete group user`, "Warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        deleteGroupUser(row.userId)
          .then((response) => {
            this.$message.success("Deleted successfully");
            this.loadData();
          })
          .catch((error) => {
            this.$message.error("Failed to delete");
          });
      });
    },

    // 提交表单
    handleSubmit() {
      this.$refs.accountForm.validate((valid) => {
        if (valid) {
          // 模拟保存操作
          this.form.rePassword = this.form.password;
          if (this.isEdit) {
            rePassword(
              this.form.userId,
              this.form.password,
              this.form.password,
            ).then((response) => {
              this.$message.success("Password updated successfully");
              this.dialogVisible = false;
              this.loadData();
            });
          } else {
            addGroupUser(this.form).then((response) => {
              this.$message.success("Add new account successfully");
              this.dialogVisible = false;
              this.loadData();
            });
          }
        }
      });
    },

    // 重置表单
    resetForm() {
      if (this.$refs.accountForm) {
        this.$refs.accountForm.resetFields();
      }
      this.form = {
        id: null,
        email: "",
        password: "",
        active: true,
      };
    },

    // 每页数量改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.loadData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadData();
    },

    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return "";
      return this.$dayjs(dateStr).format("DD/MM/YYYY HH:mm:ss");
    },
  },
};
</script>

<style lang="scss" scoped>
// 引入通用样式变量
@import '@/assets/css/common.scss';

// 页面颜色配置（基于 $--color-primary 绿色系）
$account-primary: $--color-primary;
$account-primary-hover: darken($--color-primary, 10%);
$account-primary-disabled: lighten($--color-primary, 35%);

.account-management {
  padding: 0px 20px 20px 20px;
  background: #fff;
  min-height: 80vh;

  .page-header {
    margin-bottom: 20px;

    .page-title {
      color: $account-primary;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      padding:20px 0 0 ;

    }
  }

  .search-section {
    display: flex;
    align-items: center;
    // gap: 12px;
    margin-bottom: 20px;
    // padding: 20px;
    background: white;
    // border-radius: 8px;
    // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .search-input {
      width: 300px;
      margin-right: 12px;
    }

    .search-btn {
      min-width: 80px;
    }

    .add-btn {
      min-width: 80px;
    }
  }

  // 特有的 email-text 样式
  ::v-deep .email-text {
    color: $account-primary;
    font-weight: 500;
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
      color: $account-primary;
      border-color: $account-primary;
    }

    .btn-prev,
    .btn-next {
      &:hover {
        color: $account-primary;
      }
    }

    .el-pagination__jump {
      .el-input__inner {
        border-color: $account-primary;

        &:focus {
          border-color: $account-primary;
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
    background-color: rgba($account-primary, 0.1);
    border-color: $account-primary;
    color: $account-primary;
  }
}
</style>
