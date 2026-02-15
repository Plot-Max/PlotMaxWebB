<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo and Brand -->
      <div class="logo-section">
        <div class="logo" @click="$router.push('/')">
          <img
            src="@/assets/logo/plotmax-tob-logo.jpg"
            alt="PLOT MAX Logo"
            class="logo-image"
          />
          <!-- <img
            src="/plotmax-tob-logo.jpg"
            alt="PLOT MAX Logo"
            class="logo-image"
          /> -->
        </div>
        <span v-if="pageTitle" class="page-title">{{ pageTitle }}</span>
      </div>


      <!-- Right Side Icons and User：/search 下不显示左侧 icons -->
      <div class="right-section">
        <div class="user-info" @click="$router.push('/')">
          <svg
            class="dashboard-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
          </svg>
          <span class="dashboard-text">Dashboard</span>
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
import EditUserInfo from "./EditUserInfo.vue";
import MapStateMixins from "@/views/mixins/MapStateMixins";
export default {
  name: "Header",
  mixins: [MapStateMixins],
  components: {
    EditUserInfo,
  },
  computed: {
    isSearchPage() {
      return this.$route.path === "/search";
    },
    pageTitle() {
      return this.$route.meta?.title || "";
    },
  },
  methods: {
    logout() {
      this.changeLogin();
      this.$router.push("/login");
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
  position: sticky;
  top: 0;
  z-index: 3000;
  .header-content {
    max-width: 1360px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    height: 86px;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 16px;

    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #0B2E24;
      gap: 12px;
      cursor: pointer;

      .logo-image {
        height: 75px;
        width: auto;
        object-fit: contain;
      }
    }

    .page-title {
      font-size: 36px;
      font-weight: 600;
      color: #333;
      line-height: 1.4;
    }
  }

  .action-section {
    display: flex;
    gap: 12px;

    .header-btn {
      border-radius: 6px;
      font-weight: 500;
      transition: background-color 0.2s, border-color 0.2s, color 0.2s;
    }

    .header-btn-primary {
      background-color: #2e7d32;
      border-color: #2e7d32;
      color: #fff;

      &:hover,
      &:focus {
        background-color: #1b5e20;
        border-color: #1b5e20;
        color: #fff;
      }
    }

    .header-btn-secondary {
      background: #fff;
      border: 1px solid #67c23a;
      color: #67c23a;

      &:hover,
      &:focus {
        background: #f0f9eb;
        border-color: #67c23a;
        color: #67c23a;
      }
    }
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
      gap: 8px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      color: #333;
      transition: background-color 0.3s, color 0.3s;

      &:hover {
        background-color: #e0e0e0;
        color: #333;
      }

      .dashboard-icon {
        flex-shrink: 0;
        color: currentColor;
      }

      .dashboard-text {
        font-size: 14px;
        font-weight: 500;
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
