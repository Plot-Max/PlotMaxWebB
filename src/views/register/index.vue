<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Register</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="off"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <i :class="passwordType === 'password' ? 'eye' : 'eye-open'"></i>
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item prop="rePassword">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.rePassword"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <i :class="passwordType === 'password' ? 'eye' : 'eye-open'"></i>
          </span>
        </el-form-item>
        <el-form-item prop="code">
          <div>
            <el-input
              style="width:65%;text-indent: 0px;"
              v-model="loginForm.code"
              placeholder="Verification Code"
              name="code"
              tabindex="3"></el-input>
                <el-button
                  style="width:30%;margin-left:5px;"
                  type="text"
                  :disabled="countdown > 0"
                  @click="sendCode(loginForm.username)">
                  <span v-if="countdown === 0">Send Code</span>
                  <span v-else>{{ countdown }}s</span>
                </el-button>
          </div>
        </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="submit">Sign Up</el-button>
    </el-form>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
    </el-dialog>
  </div>
</template>

<script>
import { register, sendCode } from '@/apis'
import MapStateMixins from '../mixins/MapStateMixins'

export default {
  name: 'Login',
  components: {  },
  mixins: [MapStateMixins],
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        role: 'GROUP_USER',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', max: 50, min: 5 }],
        password: [{ required: true, trigger: 'blur', max: 50, min: 6 }],
        rePassword: [
          { required: true, trigger: 'blur', max: 50, min: 6 },
          { validator: (rule, value, callback) => {
              if (value !== this.loginForm.password) {
                callback(new Error('The two passwords do not match'))
              } else {
                callback()
              }
            }, trigger: 'blur' }
        ],
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
    countdown: 0,
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          register(this.loginForm).then(resp => {
            this.loading = false
            this.$message.success('Register success, please login')
            this.$router.push('/login')
          }).catch(err => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
   sendCode(email) {
      if(!email) {
        this.$message.error('Please input email first')
        return
      }
      if (this.countdown > 0) return;
      sendCode(email).then(_=>{
        this.$message.success('Verification code sent, please check your email')
        this.startCountdown();
      }).catch(err=>{
        this.$message.error(err.response?.data?.message || 'Send code failed, please try again later')
      })
    },
    startCountdown() {
      this.countdown = 60;
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
