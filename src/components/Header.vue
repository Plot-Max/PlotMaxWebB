<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo and Brand -->
      <div class="logo-section">
        <div class="logo" @click="$router.push('/')">
          <img src="@/assets/logo/logo.png" alt="PLOT MAX Logo" class="logo-image" />
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
            @select="handleSelect"></el-autocomplete>
      </div>

      <!-- Action Buttons -->
      <div class="action-section">
        <el-button type="primary" size="medium" @click="$router.push({path: '/choose-service', query: selectedAddress})" :disabled="!selectedAddress">Purchase Report</el-button>
        <el-button type="info" size="medium" @click="toSearchPage">Advanced Search</el-button>
      </div>

      <!-- Right Side Icons and User -->
      <div class="right-section">
        <div class="icons">
          <el-button type="text" class="icon-btn" size="medium" @click="toSubsribePage">
            <img src="@/assets/header/alert.png" alt="Alert" class="icon-image" />
          </el-button>
          <el-button type="text" class="icon-btn" size="medium" @click="toWalletPage">
            <img src="@/assets/header/info.png" alt="Info" class="icon-image" />
          </el-button>
        </div>
        <el-divider direction="vertical" class="verticel-divider"></el-divider>
        <div class="user-info">
          <el-dropdown trigger="hover" placement="bottom-start">
            <div class="user-dropdown-trigger">
              <el-avatar :size="40" background-color="#4a90e2" color="#fff" :src="userInfo?.logo">
                {{ userInfo?.userEmail?.substring(0, 1).toUpperCase() || 'U' }}
              </el-avatar>
              <div class="user-details">
                <div class="user-name">{{ userInfo?.userEmail }}</div>
                <div class="user-role">{{ userInfo?.user_role == 0 ? 'Broker' : 'Agent' }}</div>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown-menu">
              <div class="user-info-header">
                <div class="user-info-details">
                  <div class="user-name-large">
                    <span>{{ userInfo?.userEmail }}</span>
                    <el-button type="info" size="mini" @click="logout">Log out</el-button>
                  </div>
                  <div class="user-role-large">{{ userInfo?.user_role == 0 ? 'Broker' : 'Agent' }}</div>
                  <!-- <div class="user-email">Ola.Boluwatife@gmail.com</div> -->
                  <div class="margin-t10">
                    <el-button type="info" size="mini" v-if="userInfo?.user_role == 0" @click="$refs.editUserInfoDialog.open()">Edit Info</el-button>
                    <el-button type="info" size="mini" @click="toAccountPage">Agent</el-button>
                  </div>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <edit-user-info v-if="userInfo?.user_role == 0" ref="editUserInfoDialog"></edit-user-info>
  </header>
</template>

<script>
import { searchAddress } from '@/apis';
import EditUserInfo from './EditUserInfo.vue';
import MapStateMixins from '@/views/mixins/MapStateMixins';
export default {
  name: 'Header',
  mixins: [MapStateMixins],
  components: {
    EditUserInfo,
  },
  data() {
    return {
      searchQuery: '',
      selectedAddress: null,
    }
  },
  watch: {
    $route() {
      // Reset search query when route changes
      this.searchQuery = '';
      this.selectedAddress = null
    }
  },
  methods: {
    logout() {
      this.changeLogin();
      this.$router.push('/login');
    },
    querySearchAsync(queryString, cb) {
      if(!queryString) {
        cb([]);
        return;
      }
      searchAddress(queryString).then(response => {
        const results = response.data.items.map(item => {
          return {
            value: item.full_addr,
            gid: item.gid
          };
        });
        cb(results);
      }).catch(error => {
        console.error('Search error:', error);
        cb([]);
      });
    },
    handleSelect(item) {
      console.log('Selected item:', item);
      this.selectedAddress = {
        full_addr: item.value,
        gid: item.gid
      }
    },
    toAccountPage() {
      if(this.$route.path === '/account') return;
      this.$router.push('/account');
    },
    toWalletPage() {
      if(this.$route.path === '/wallet') return;
      this.$router.push('/wallet');
    },
    toReportsPage() {
      if(this.$route.path === '/report') return;
      this.$router.push('/report');
    },
    toSearchPage() {
      if(this.$route.path === '/search') {
        if(this.$route.query.mode != 1) {
          return;
        }
      };
      this.$router.push('/search');
    },
    toSubsribePage() {
      if(this.$route.path === '/subscribe') return;
      this.$router.push('/subscribe');
    }
  }
}
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

        &:first-child {
          margin-left: 20px;
        }

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
      gap: 12px;

      .user-dropdown-trigger {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        transition: background-color 0.3s;

        &:hover {
          background-color: #f5f5f5;
        }

        .user-details {
          text-align: left;

          .user-name {
            font-weight: 600;
            font-size: 14px;
            color: #333;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-role {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
// 下拉菜单的全局样式
.user-dropdown-menu {
  min-width: 280px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .user-info-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    width: 230px;
    max-width: 100%;

    .user-info-details {
      flex: 1;

      .user-name-large {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 2px;
        display: flex;
        justify-content: space-between;
      }

      .user-role-large {
        font-size: 14px;
        color: #4a90e2;
        margin-bottom: 4px;
      }

      .user-email {
        font-size: 13px;
        color: #666;
      }
    }
  }

  .el-dropdown-menu__item {
    padding: 10px 16px;
    font-size: 14px;
    border-radius: 4px;
    margin: 2px 0;

    i {
      margin-right: 8px;
      color: #666;
    }

    &:hover {
      background-color: #f5f5f5;
      color: #333;

      i {
        color: #4a90e2;
      }
    }

    &.logout-item {
      color: #f56c6c;

      i {
        color: #f56c6c;
      }

      &:hover {
        background-color: #fef0f0;
        color: #f56c6c;

        i {
          color: #f56c6c;
        }
      }
    }
  }
}
</style>