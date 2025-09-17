<template>
    <div class="wallet-page">
        <!-- Left column: Subscription and Purchase -->
        <div class="left-column">
            <!-- Current subscription section -->
            <div class="subscription-card">
                <h3 class="card-title">Current subscription</h3>
                <div class="subscription-content">
                    <div class="subscription-info">
                        <div class="plan-name" v-html="subscriptionInfo.template?.name || '-'"></div>
                        <div class="plan-price">{{ getPlanPrice(subscriptionInfo.plan) }}</div>
                        <div class="plan-details">{{subscriptionInfo.template?.report_point || 0}} reports & {{ (subscriptionInfo.template?.search_point || 0)}} results for a month</div>
                        <div class="plan-validity">Valid to {{formatDate2(subscriptionInfo.plan?.end_day)}}</div>
                    </div>
                    <div class="actions">
                        <button class="change-plan-btn" @click="toChangeSubscribe">Change subscription plan</button>
                        <el-button type="text" @click="doUnsubscription">Unsubscription</el-button>
                    </div>
                    <div class="tip" v-if="subscriptionInfo.nextTemplate">
                        The revised package “{{ subscriptionInfo.nextTemplate.name }}” will take effect on and be charged on the next payment date  {{formatDate3(subscriptionInfo.lastPlan?.end_day)}}
                    </div>
                    <div class="tip" v-if="subscriptionInfo.plan && subscriptionInfo.canceled">
                        Unsubscribe will take effect on the next payment date {{formatDate3(subscriptionInfo.lastPlan?.end_day)}}
                    </div>
                </div>
            </div>

            <!-- Purchase supplements section -->
            <div class="supplements-card">
                <h3 class="card-title">Purchase supplements</h3>
                <div class="supplements-content">
                    <div class="supplement-item">
                        <div class="supplement-info">
                            <span class="supplement-type">Report</span>
                            <div class="supplement-controls">
                                <button class="quantity-btn" @click="decreaseReport">
                                    <img src="@/assets/icons/minus.png" alt="minus" />
                                </button>
                                <input type="number" v-model.number="reportQuantity" class="quantity-input" :min="0"
                                    @input="validateReport" @blur="validateReport" />
                                <button class="quantity-btn" @click="increaseReport">
                                    <img src="@/assets/icons/plus.png" alt="plus" />
                                </button>
                            </div>
                            <span class="supplement-price">$49.99/per</span>
                        </div>
                    </div>

                    <div class="supplement-item">
                        <div class="supplement-info">
                            <span class="supplement-type">Search</span>
                            <div class="supplement-controls">
                                <button class="quantity-btn" @click="decreaseSearch">
                                    <img src="@/assets/icons/minus.png" alt="minus" />
                                </button>
                                <input type="number" v-model.number="searchQuantity" class="quantity-input" :min="0"
                                    @input="validateSearch" @blur="validateSearch" />
                                <button class="quantity-btn" @click="increaseSearch">
                                    <img src="@/assets/icons/plus.png" alt="plus" />
                                </button>
                            </div>
                            <span class="supplement-price">$0.5/per</span>
                        </div>
                    </div>
                    <div class="supplement-item">
                        <div class="supplement-info">
                            <span class="supplement-type">Price</span>
                            <div>$ {{ totalPrice.toFixed(2) }}</div>
                        </div>
                    </div>
                    

                    <el-button :loading="paying" class="pay-btn" @click="toPay" :disabled="totalPrice <= 0">PAY</el-button>
                </div>
            </div>
        </div>

        <!-- Right column: Balance section -->
        <div class="balance-section">
            <!-- Report Point balance -->
            <div class="balance-card">
                <h3 class="balance-title">Report Point balance</h3>
                <div class="balance-number">{{ subscriptionInfo.totalReportPointBalance }}</div>
                <div class="balance-breakdown">
                    <div class="breakdown-item">
                        <span class="breakdown-label">Within the package</span>
                        <span class="breakdown-value">{{ subscriptionInfo.plan?.report_balance || 0 }}</span>
                        <el-progress :percentage="reportWithinPackagePercentage || 0" :stroke-width="6" :show-text="false" color="#4a90e2"></el-progress>
                    </div>
                    <div class="breakdown-item">
                        <span class="breakdown-label">Extra purchased</span>
                        <span class="breakdown-value">{{ subscriptionInfo.totalReportPointBalance - (subscriptionInfo.plan?.report_balance || 0) }}</span>
                        <el-progress :percentage="reportExtraPurchasedPercentage || 0" :stroke-width="6" :show-text="false" color="#4a90e2"></el-progress>
                    </div>
                </div>
                <div class="details-section">
                    <span class="details-toggle">details</span>
                    <div class="details-table">
                        <div class="table-header">
                            <span>Quantity</span>
                            <span>Valid to</span>
                        </div>
                        <div class="table-row">
                            <span>{{ subscriptionInfo.plan?.report_balance || '-' }}</span>
                            <span>{{ formatDate(subscriptionInfo.plan?.end_day) }}</span>
                        </div>
                        <div class="table-row">
                            <span>{{ subscriptionInfo.totalReportPointBalance -  (subscriptionInfo.plan?.report_balance || 0) }}</span>
                            <span>-</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Result balance -->
            <div class="balance-card">
                <h3 class="balance-title">Result balance</h3>
                <div class="balance-number">{{ subscriptionInfo.totalSearchPointBalance.toLocaleString() }}</div>
                <div class="balance-breakdown">
                    <div class="breakdown-item">
                        <span class="breakdown-label">Within the package</span>
                        <span class="breakdown-value">{{ (subscriptionInfo.plan?.search_balance || 0).toLocaleString() }}</span>
                        <el-progress :percentage="resultWithinPackagePercentage || 0" :stroke-width="6" :show-text="false" color="#4a90e2"></el-progress>
                    </div>
                    <div class="breakdown-item">
                        <span class="breakdown-label">Extra purchased</span>
                        <span class="breakdown-value">{{ (subscriptionInfo.totalSearchPointBalance - (subscriptionInfo.plan?.search_balance || 0)).toLocaleString() }}</span>
                        <el-progress :percentage="resultExtraPurchasedPercentage || 0" :stroke-width="6" :show-text="false" color="#4a90e2"></el-progress>
                    </div>
                </div>
                <div class="details-section">
                    <span class="details-toggle">details</span>
                    <div class="details-table">
                        <div class="table-header">
                            <span>Quantity</span>
                            <span>Valid to</span>
                        </div>
                        <div class="table-row">
                            <span>{{ subscriptionInfo.plan?.search_balance || '-' }}</span>
                            <span>{{ formatDate(subscriptionInfo.plan?.end_day) }}</span>
                        </div>
                        <div class="table-row">
                            <span>{{ subscriptionInfo.totalSearchPointBalance -  (subscriptionInfo.plan?.search_balance || 0) }}</span>
                            <span>-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { subscribeDetail, mockBuyExtra, payPack, unsubscribe } from '@/apis';
import { subscribes } from '@/utils/enums'
import MapStateMixins from '../mixins/MapStateMixins';
export default {
    name: 'Wallet',
    mixins: [MapStateMixins],
    data() {
        return {
            subscribes,
            paying: false,
            subscriptionInfo: {
                plan:{},
                template: {},
                totalReportPointBalance: 0,
                totalSearchPointBalance: 0
            },
            showReportDetails: false,
            showResultDetails: false,
            reportQuantity: 1,
            searchQuantity: 1,
            reportBalance: {
                total: 67,
                withinPackage: 44,
                extraPurchased: 23
            },
            resultBalance: {
                total: 1823,
                withinPackage: 1000,
                extraPurchased: 823
            }
        }
    },
    computed: {
        totalPrice() {
            return (this.reportQuantity * 49.99) + (this.searchQuantity * 0.5)
        },
        reportWithinPackagePercentage() {
            return Math.round(((this.subscriptionInfo.plan?.report_balance || 0) / this.subscriptionInfo.totalReportPointBalance) * 100)
        },
        reportExtraPurchasedPercentage() {
            const reportBalance = this.subscriptionInfo.totalReportPointBalance - (this.subscriptionInfo.plan?.report_balance || 0)
            return reportBalance == 0 ? 0 : (100 - this.reportWithinPackagePercentage)
        },
        resultWithinPackagePercentage() {
            return Math.round(((this.subscriptionInfo.plan?.search_balance || 0) / this.subscriptionInfo.totalSearchPointBalance) * 100)
        },
        resultExtraPurchasedPercentage() {
            const searchBalance = this.subscriptionInfo.totalSearchPointBalance - (this.subscriptionInfo.plan?.search_balance || 0)
            return searchBalance == 0 ? 0 : (100 - this.resultWithinPackagePercentage)
        }
    },
    mounted() {
        subscribeDetail().then(response => {
            if (response.data) {
                this.subscriptionInfo = response.data;
            }
        });
    },
    methods: {
        increaseReport() {
            this.reportQuantity++
        },
        decreaseReport() {
            if (this.reportQuantity > 0) {
                this.reportQuantity--
            }
        },
        increaseSearch() {
            this.searchQuantity++
        },
        decreaseSearch() {
            if (this.searchQuantity > 0) {
                this.searchQuantity--
            }
        },
        validateReport() {
            if (!this.reportQuantity || this.reportQuantity < 0) {
                this.reportQuantity = 0
            }
            this.reportQuantity = Math.floor(this.reportQuantity)
        },
        validateSearch() {
            if (!this.searchQuantity || this.searchQuantity < 0) {
                this.searchQuantity = 0
            }
            this.searchQuantity = Math.floor(this.searchQuantity)
        },
        formatDate(date) {
            if(!date) return '-';
            return this.$dayjs(date).format('MM/DD/YYYY HH:mm:ss');  
        },
        formatDate2(date) {
            if(!date) return '-';
            return this.$dayjs(date).format('MMM, DD, YYYY');
        },
        formatDate3(date) {
            if(!date) return '-';
            return this.$dayjs(date).format('MMM/DD/YYYY');
        },
        doUnsubscription() {
            if(this.userInfo.user_role != 0) {
                this.$alert('Only brokers can edit packages and payments', {
                    type: 'warning'
                })
                return ;
            }
            this.$confirm('After cancellation, the service and payment will be suspended from the next payment day', 'Are you sure you want to unsubscribe', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
            }).then(() => {
                const loading = this.$loading({
                    lock: true,
                    text: 'Unsubscribing...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                unsubscribe().then(response => {
                    this.$message.success('Unsubscription successful!');
                }).finally(() => {
                    loading.close();
                })
            })
            
        },
        toPay() {
            if(this.userInfo.user_role != 0) {
                this.$alert('Only brokers can edit packages and payments', {
                    type: 'warning'
                })
                return;
            }
            this.paying = true;
            payPack({
                reportPoint: this.reportQuantity,
                searchPoint: this.searchQuantity,
                successUrl: window.location.origin + process.env.BASE_URL + 'pay-pack-success?backtype=1',
                cancelUrl: window.location.origin + process.env.BASE_URL +  'wallet'
            }).then(response => {
                if (response.data && response.data.payUrl) {
                    window.location.href = response.data.payUrl;
                }
            }).finally(() => {
                this.paying = false;
            })
            // mockBuyExtra({
            //     reportPoint: this.reportQuantity,
            //     searchPoint: this.searchQuantity
            // }).then(response => {
            //     this.$message.success('Purchase successful!');
            // })
        },
        getPlanName(plan) {
            if(!plan) return null;
            const subscription = this.subscribes.find(item => item.id === plan.plan_template_id);
            if(subscription) {
                return `${subscription?.name || '-'}<span class="plan-pay">${plan.plan_type==0?'M':'Y'}.Pay</span>`;
            } else {
                return null;
            }
            
        },
        getPlanPrice(plan) {
            if(!plan) return '-';
            const subscription = this.subscribes.find(item => item.id === plan.plan_template_id);
            console.log('subscription', subscription);
            if(subscription) {
                return `$ ${this.formatterPrice(plan.plan_type==0 ? subscription.monthPrice : subscription.yearPrice) || '-'} / ${plan.plan_type==0?'month':'year'}`;
            } else {
                return '-';
            }
        },
        toChangeSubscribe() {
            if(this.subscriptionInfo.plan) {
                this.$router.push({path: '/subscribe', query: { changeModel: true, planType: this.subscriptionInfo.plan.plan_type }});
            }
            else {
                this.$router.push('/subscribe');
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
.wallet-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #f5f7fa;
    // min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 24px;
}

.left-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.subscription-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
}

.balance-section {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 20px;
}

.supplements-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: #4a90e2;
    margin: 0 0 20px 0;
}

.subscription-content {
    .subscription-info {
        margin-bottom: 10px;
    }

    .plan-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
    }

    .plan-price {
        font-size: 20px;
        font-weight: 700;
        color: #333;
        margin-bottom: 8px;
    }

    .plan-details {
        font-size: 14px;
        color: #666;
        margin-bottom: 4px;
        line-height: 25px;
    }

    .plan-validity {
        font-size: 14px;
        color: #666;
        line-height: 25px;
    }
    .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-button {
            font-size: 15px;
            font-weight: 600;
        }
    }
    .tip {
        margin-top: 10px;
        font-size: 13px;
        color: red;
    }
}

.change-plan-btn {
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #357abd;
    }
}

.balance-card {
    flex: 1;
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
}

.balance-title {
    font-size: 16px;
    font-weight: 600;
    color: #4a90e2;
    margin: 0 0 16px 0;
}

.balance-number {
    font-size: 36px;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
}

.balance-breakdown {
    margin-bottom: 20px;
}

.breakdown-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;

    .breakdown-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
        display: flex;
        align-items: center;

        &::before {
            content: '';
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }
    }

    .breakdown-label::before {
        background: #4a90e2;
    }


    .breakdown-value {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
        text-align: right;
    }

    .el-progress {
        margin-bottom: 4px;
    }
}

.details-section {
    border-top: 1px solid #e1e8ed;
    padding: 16px 0px 50px;
}

.details-toggle {
    font-size: 14px;
    color: #4a90e2;
    cursor: pointer;

    &:hover {
        color: #357abd;
    }
}

.details-table {
    margin-top: 16px;

    .table-header {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 14px;
        font-weight: 600;
        color: #666;
        background: #f8f9fa;
        padding: 8px 12px;
        border-radius: 4px;
    }

    .table-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
            border-bottom: none;
        }
    }
}

.supplements-content {
    .supplement-item {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 24px;
        }
    }

    .supplement-info {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .supplement-type {
        min-width: 60px;
    }

    .supplement-controls {
        display: flex;
        align-items: center;
        position: relative;
        width: 120px;
    }

    .supplement-price {
        font-size: 14px;
        color: #666;
        margin-left: auto;
    }
}

.quantity-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;

    &:hover {
        background: #e0e0e0;
    }

    &:first-child {
        left: 8px;
    }

    &:last-child {
        right: 8px;
    }

    img {
        width: 17px;
        height: 17px;
    }
}

.quantity-input {
    width: 120px;
    height: 36px;
    border: 2px solid #e1e8ed;
    border-radius: 6px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    background: white;
    transition: all 0.2s ease;
    padding: 0 32px;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }

    &:hover {
        border-color: #c1c9d2;
    }

    // 隐藏数字输入框的箭头
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    // Firefox
    &[type=number] {
        -moz-appearance: textfield;
        appearance: textfield;
    }
}

.pay-btn {
    width: 100%;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #357abd;
        transform: translateY(-1px);
    }
    &:disabled {
        background: #a0c4f7;
        cursor: not-allowed;
        transform: none;
        color: white;
    }
}
::v-deep .plan-pay {
  background: #5A8DEE;
  box-shadow: 0px 2px 4px 0px rgba(90,141,238,0.4);
  border-radius: 4px;
  color: #FFFFFF;
  padding: 1px 6px;
  margin-left: 5px;
}
@media (max-width: 1024px) {
    .wallet-page {
        grid-template-columns: 1fr;
    }

    .balance-section {
        flex-direction: row;
    }
}

@media (max-width: 768px) {
    .wallet-page {
        padding: 16px;
        gap: 16px;
    }

    .left-column {
        gap: 16px;
    }

    .balance-section {
        flex-direction: column;
        gap: 16px;
    }

    .subscription-card,
    .balance-card,
    .supplements-card {
        padding: 16px;
        width: 100%;
    }

    .supplement-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .supplement-controls {
        margin: 0 auto;
    }
}
</style>
