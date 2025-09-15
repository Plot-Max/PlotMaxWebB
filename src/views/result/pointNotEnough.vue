<template>
    <div class="point-not-enough">
        <!-- 内容区域 -->
        <div class="main-content">
            <div class="content-wrapper">
                <!-- 图标 -->
                <div class="icon-section">
                    <img src="@/assets/icons/point_not_enough.png" alt="Point Not Enough" class="point-icon" />
                </div>

                <!-- 文字信息 -->
                <div class="message-section">
                    <h2 class="title">Insufficient report points</h2>
                    <p v-if="$route.query.result==1" class="title">Your may purchase a package, buy additional points, or pay directly</p>
                    <p v-else class="title">Your may purchase additional points or pay directly.</p>
                </div>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <el-button v-if="$route.query.result==1" type="primary" class="direct-payment-btn" @click="handleGoToSubscribe">
                        Purchase a package or points
                    </el-button>
                    <el-button v-else type="primary" class="direct-payment-btn" @click="handlehandleGoToSubscribeDirectPayment">
                        Purchase additional points
                    </el-button>

                    <el-button type="info" class="subscribe-btn" @click="handleDirectPayment">
                        Pay Directly
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { payPack } from '@/apis';
export default {
    name: 'PointNotEnough',
    data() {
        return {
            // 组件状态数据
        }
    },

    methods: {
        // 直接支付
        handleDirectPayment() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            payPack({
                reportPoint: this.$route.query.type == '0' ? 1: 2,
                searchPoint: 0,
                successUrl: window.location.origin + process.env.BASE_URL + 'choose-service?gid=' + this.$route.query.gid+'&full_addr=' + this.$route.query.full_addr,
                cancelUrl: window.location.origin + process.env.BASE_URL +  'point-not-enough?gid=' + this.$route.query.gid+'&type=' + this.$route.query.type + '&result=' + this.$route.query.result,
            }).then(response => {
                if (response.data && response.data.payUrl) {
                    window.location.href = response.data.payUrl;
                }
            }).finally(() => {
                loading.close();
            })
        },

        // 去订阅
        handleGoToSubscribe() {
            this.$message.info('跳转到订阅页面')
            // 这里可以跳转到订阅页面
            this.$router.push('/subscribe')
        }
    }
}
</script>

<style lang="scss" scoped>
.point-not-enough {

    .main-content {
        padding: 40px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        min-height: calc(100vh - 280px); // 减去Header高度
    }

    .content-wrapper {
        max-width: 500px;
        width: 100%;
    }

    // 图标区域
    .icon-section {
        margin-bottom: 30px;

        .point-icon {
            width: 120px;
            height: 120px;
            object-fit: contain;
        }
    }

    // 文字信息区域
    .message-section {
        margin-bottom: 40px;

        .title {
            font-size: 24px;
            font-weight: 600;
            color: #2c3e50;
            margin: 0 0 10px 0;
            line-height: 1.4;
        }
    }

    // 操作按钮区域
    .action-buttons {
        display: flex;
        gap: 16px;
        justify-content: flex-start;

        @media (max-width: 480px) {
            flex-direction: column;
            gap: 12px;
        }

        .el-button {
            padding: 12px 24px;
            font-size: 14px;
            min-width: 120px;
            margin: 0px;

            @media (max-width: 480px) {
                width: 100%;
            }
        }

        .direct-payment-btn {
            background: #5A8DEE;
            border-color: #5A8DEE;

            &:hover {
                background: #4A7CE8;
                border-color: #4A7CE8;
            }
        }

        .subscribe-btn {
            background: #E2ECFF;
            color: #5A8DEE;
            border: 1px solid #E2ECFF;

            &:hover {
                background: #D1E0FF;
                color: #5A8DEE;
                border-color: #D1E0FF;
            }
        }
    }

    // 响应式设计
    @media (max-width: 768px) {
        .main-content {
            padding: 20px 15px;
        }

        .icon-section .point-icon {
            width: 100px;
            height: 100px;
        }

        .message-section {
            .title {
                font-size: 20px;
            }
        }
    }
}
</style>
