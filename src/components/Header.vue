<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo and Brand -->
      <div class="logo-section">
        <div class="logo" @click="$router.push('/')">
          <img
            src="/plotmax-tob-logo.jpg"
            alt="PLOT MAX Logo"
            class="logo-image"
          />
        </div>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <!-- <el-input v-model="searchQuery" placeholder="Search Address" class="search-input"
          prefix-icon="el-icon-search" /> -->
        <el-autocomplete
          v-model="searchQuery"
          :fetch-suggestions="querySearchAsync"
          :debounce="500"
          placeholder="Search Address"
          class="search-input"
          prefix-icon="el-icon-search"
          @input="selectedAddress = null"
          @select="handleSelect"
        ></el-autocomplete>
      </div>

      <!-- Action Buttons：/search 下 Advanced Search 为主按钮，Purchase Report 为次要 -->
      <div class="action-section">
        <el-button
          :type="isSearchPage ? 'default' : 'primary'"
          size="medium"
          @click="
            $router.push({ path: '/choose-service', query: selectedAddress })
          "
          :disabled="!selectedAddress"
        >
          Purchase Report
        </el-button>
        <el-button
          :type="isSearchPage ? 'primary' : 'info'"
          size="medium"
          @click="toSearchPage"
        >
          Advanced Search
        </el-button>
      </div>

      <!-- Right Side Icons and User：/search 下不显示左侧 icons -->
      <div class="right-section">
        <template v-if="!isSearchPage">
          <div class="icons">
            <el-button
              type="text"
              class="icon-btn"
              size="medium"
              @click="toSubsribePage"
            >
              <img
                src="@/assets/header/alert.png"
                alt="Alert"
                class="icon-image"
              />
            </el-button>
          </div>
          <el-divider direction="vertical" class="verticel-divider"></el-divider>
        </template>
        <div class="user-info">
          <el-dropdown placement="bottom-start">
            <div class="user-dropdown-trigger">
              <div class="user-details">
                <div class="welcome-text">Welcome back,</div>
                <div class="user-email">{{ userInfo?.userEmail }}</div>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown-menu">
              <el-dropdown-item v-if="userInfo?.user_role == 0">
                <el-button
                  type="info"
                  size="medium"
                  @click="$refs.editUserInfoDialog.open()"
                >
                  Edit Info
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="info" size="medium" @click="toWalletPage">
                  Balance
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="info" size="medium" @click="toAccountPage">
                  Agent
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="logout-section">
          <el-button type="text" class="logout-btn" @click="logout">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
              "
            >
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
                class="logout-icon"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" x2="9" y1="12" y2="12"></line>
              </svg>
              <span class="logout-text">Logout</span>
            </div>
          </el-button>
        </div>
      </div>
    </div>
    <edit-user-info
      v-if="userInfo?.user_role == 0"
      ref="editUserInfoDialog"
    ></edit-user-info>
  </header>
</template>

<script>
import { searchAddress } from "@/apis";
import EditUserInfo from "./EditUserInfo.vue";
import MapStateMixins from "@/views/mixins/MapStateMixins";
export default {
  name: "Header",
  mixins: [MapStateMixins],
  components: {
    EditUserInfo,
  },
  data() {
    return {
      searchQuery: "",
      selectedAddress: null,
    };
  },
  computed: {
    isSearchPage() {
      return this.$route.path === "/search";
    },
  },
  watch: {
    $route() {
      // Reset search query when route changes
      this.searchQuery = "";
      this.selectedAddress = null;
    },
  },
  methods: {
    logout() {
      this.changeLogin();
      this.$router.push("/login");
    },
    querySearchAsync(queryString, cb) {
      if (!queryString) {
        cb([]);
        return;
      }
      searchAddress(queryString)
        .then((response) => {
          const results = response.data.items.map((item) => {
            return {
              value: item.full_addr,
              gid: item.gid,
            };
          });
          cb(results);
        })
        .catch((error) => {
          console.error("Search error:", error);
          cb([]);
        });
    },
    handleSelect(item) {
      console.log("Selected item:", item);
      this.selectedAddress = {
        full_addr: item.value,
        gid: item.gid,
      };
    },
    toAccountPage() {
      if (this.$route.path === "/account") return;
      this.$router.push("/account");
    },
    toWalletPage() {
      if (this.$route.path === "/wallet") return;
      this.$router.push("/wallet");
    },
    toReportsPage() {
      if (this.$route.path === "/report") return;
      this.$router.push("/report");
    },
    toSearchPage() {
      if (this.$route.path === "/search") {
        if (this.$route.query.mode != 1) {
          return;
        }
      }
      this.$router.push("/search");
    },
    toSubsribePage() {
      if (this.$route.path === "/subscribe") return;
      this.$router.push("/subscribe");
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }

  .logo-section {
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #4a90e2;
      gap: 12px;
      cursor: pointer;

      .logo-image {
        height: 40px;
        width: auto;
        object-fit: contain;
      }
    }
  }

  .search-section {
    flex: 1;
    max-width: 300px;
    margin: 0 20px;

    .search-input {
      width: 100%;
    }
  }

  .action-section {
    display: flex;
    gap: 12px;
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 16px;

    .icons {
      display: flex;
      gap: 8px;

      .icon-btn {
        color: #666;
        font-size: 18px;
        margin: 0;

        .icon-image {
          width: 25px;
          height: 25px;
          object-fit: contain;
          display: block;
        }

        &:hover .icon-image {
          opacity: 0.7;
        }
      }
    }

    .verticel-divider {
      height: 35px;
      margin: 0px;
    }

    .user-info {
      display: flex;
      align-items: center;

      .user-dropdown-trigger {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0;

        .user-details {
          display: flex;
          flex-direction: column;
          text-align: left;

          .welcome-text {
            font-size: 14px;
            color: #999;
            line-height: 1.4;
          }

          .user-email {
            font-size: 14px;
            color: #333;
            line-height: 1.4;
            font-weight: 400;
          }
        }
      }
    }

    .logout-section {
      display: flex;
      align-items: center;

      .logout-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #333;
        font-size: 14px;
        padding: 8px 12px;
        margin: 0;
        border-radius: 6px;
        transition: background-color 0.3s, color 0.3s;

        &:hover {
          background-color: #e0e0e0;
          color: #333;
        }

        .logout-icon {
          width: 16px;
          height: 16px;
          color: currentColor;
        }

        .logout-text {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.user-dropdown-menu {
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
  .el-dropdown-menu__item {
    width: 100%;
  }
  .el-button {
    width: 100%;
  }
}
</style>
