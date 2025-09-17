<template>
    <div class="subscribe-page">
        <div class="page-header">
            <h1 class="page-title">Package</h1>
        </div>

        <!-- Package Plans -->
        <div class="package-section">
            <div class="package-grid">
                <!-- Report & Search VIP -->
                <div class="package-card">
                    <div class="package-header">
                        <h3 class="package-name">Report & Search VIP</h3>
                        <div class="package-price">$ 4,000/Month</div>
                        <div class="package-subtitle">80 report Exchange Point</div>
                        <div class="package-subtitle">2,500 results</div>
                        <div class="package-subtitle">Valid for one month</div>
                        <div class="package-subtitle">Team sharing</div>
                    </div>
                    <div class="package-details">
                        <p>1 report point = 1 ordinary report</p>
                        <p>2 report points = 1 premium report</p>
                        <p>Paying for one year's fees at once will receive a discount of two months' worth of fees</p>
                    </div>
                    <div class="package-pricing"> 
                        <div class="pricing-option active" @click="toBuy(1, 0)">
                            <span class="pricing-label">MONTH</span>
                            <span class="pricing-value">$ 4,000</span>
                        </div>
                        <div class="pricing-option" @click="toBuy(8, 0)">
                            <span class="pricing-label">YEAR</span>
                            <span class="pricing-value">$ 40,000</span>
                        </div>
                    </div>
                </div>

                <!-- Report & Search SVIP -->
                <div class="package-card">
                    <div class="package-header">
                        <h3 class="package-name">Report & Search SVIP</h3>
                        <div class="package-price">$ 12,000/Month</div>
                        <div class="package-subtitle">300 report Exchange Point</div>
                        <div class="package-subtitle">5,000 results</div>
                        <div class="package-subtitle">Valid for one month</div>
                        <div class="package-subtitle">Team sharing</div>
                    </div>
                    <div class="package-details">
                        <p>1 report point = 1 ordinary report</p>
                        <p>2 report points = 1 premium report</p>
                        <p>Paying for one year's fees at once will receive a discount of two months' worth of fees</p>
                    </div>
                    <div class="package-pricing">
                        <div class="pricing-option active" @click="toBuy(4, 0)">
                            <span class="pricing-label">MONTH</span>
                            <span class="pricing-value">$ 12,000</span>
                        </div>
                        <div class="pricing-option" @click="toBuy(4, 1)">
                            <span class="pricing-label">YEAR</span>
                            <span class="pricing-value">$ 120,000</span>
                        </div>
                    </div>
                </div>

                <!-- Report VIP -->
                <div class="package-card">
                    <div class="package-header">
                        <h3 class="package-name">Report VIP</h3>
                        <div class="package-price">$ 3,000/Month</div>
                        <div class="package-subtitle">50 report Exchange Point</div>
                        <div class="package-subtitle">Valid for one month</div>
                        <div class="package-subtitle">Team sharing</div>
                    </div>
                    <div class="package-details">
                        <p>1 report point = 1 ordinary report</p>
                        <p>2 report points = 1 premium report</p>
                        <p>Paying for one year's fees at once will receive a discount of two months' worth of fees</p>
                    </div>
                    <div class="package-pricing">
                        <div class="pricing-option active" @click="toBuy(5, 0)">
                            <span class="pricing-label">MONTH</span>
                            <span class="pricing-value">$ 3,000</span>
                        </div>
                        <div class="pricing-option" @click="toBuy(5, 1)">
                            <span class="pricing-label">YEAR</span>
                            <span class="pricing-value">$ 30,000</span>
                        </div>
                    </div>
                </div>

                <!-- Report SVIP -->
                <div class="package-card">
                    <div class="package-header">
                        <h3 class="package-name">Report SVIP</h3>
                        <div class="package-price">$ 10,000/Month</div>
                        <div class="package-subtitle">300 report Exchange Point</div>
                        <div class="package-subtitle">Valid for one month</div>
                        <div class="package-subtitle">Team sharing</div>
                    </div>
                    <div class="package-details">
                        <p>1 report point = 1 ordinary report</p>
                        <p>2 report points = 1 premium report</p>
                        <p>Paying for one year's fees at once will receive a discount of two months' worth of fees</p>
                    </div>
                    <div class="package-pricing">
                        <div class="pricing-option active" @click="toBuy(6, 0)">
                            <span class="pricing-label">MONTH</span>
                            <span class="pricing-value">$ 10,000</span>
                        </div>
                        <div class="pricing-option" @click="toBuy(6, 1)">
                            <span class="pricing-label">YEAR</span>
                            <span class="pricing-value">$ 100,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Purchase separately section -->
        <div class="separate-section">
            <h2 class="separate-title">Purchase separately</h2>
            <div class="separate-grid">
                <!-- Report Point -->
                <div class="separate-card">
                    <div class="separate-header">
                        <h3 class="separate-name">Report Point</h3>
                        <div class="separate-price">$ 49.99/Per</div>
                        <div class="separate-subtitle">Valid for one Year</div>
                        <div class="separate-subtitle">Team sharing</div>
                    </div>
                    <div class="separate-details">
                        <p>1 report point = 1 ordinary report</p>
                        <p>2 report points = 1 premium report</p>
                    </div>
                    <div class="quantity-control">
                        <img src="@/assets/icons/minus.png" class="quantity-btn" @click="decreaseReportPoint" />
                        <input type="number" v-model.number="reportPointQuantity" class="quantity-input" min="1"
                            @input="validateReportPoint" @blur="validateReportPoint" />
                        <img src="@/assets/icons/plus.png" class="quantity-btn" @click="increaseReportPoint" />
                    </div>
                    <div class="total-price">Total $ {{ (reportPointQuantity * 49.99).toFixed(2) }}</div>
                    <button class="get-btn" @click="doPayPack(reportPointQuantity, 0)">GET IT</button>
                </div>

                <!-- Result -->
                <div class="separate-card">
                    <div class="separate-header">
                        <h3 class="separate-name">Result</h3>
                        <div class="separate-price">$ 0.5/Per</div>
                        <div class="separate-subtitle">Valid for one Year</div>
                        <div class="separate-subtitle">Team sharing</div>
                    </div>
                    <div class="separate-details">
                        <p>1 report point = 1 ordinary report</p>
                        <p>2 report points = 1 premium report</p>
                    </div>
                    <div class="quantity-control">
                        <img src="@/assets/icons/minus.png" class="quantity-btn"
                            @click="resultQuantity > 1 ? resultQuantity-- : undefined" />
                        <input type="number" v-model.number="resultQuantity" class="quantity-input" min="1"
                            @input="validateResult" @blur="validateResult" />
                        <img src="@/assets/icons/plus.png" class="quantity-btn" @click="resultQuantity++" />
                    </div>
                    <div class="total-price">Total $ {{ (resultQuantity * 0.5).toFixed(2) }}</div>
                    <button class="get-btn" @click="doPayPack(0, resultQuantity)">GET IT</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mockBuyPlan, paySubscribe, payPack, changeSubscribe } from '@/apis';
import MapStateMixins from '../mixins/MapStateMixins';
export default {
    name: 'Subscribe',
    mixins: [MapStateMixins],
    data() {
        return {
            reportPointQuantity: 1,
            resultQuantity: 1,
            changeModel: false,
            oldPlanType: null,
        }
    },
    mounted() {
        if(this.$route.query.changeModel && this.$route.query.planType) {
            this.changeModel = true;
            this.oldPlanType = this.$route.query.planType;
        }
    },
    methods: {
        increaseReportPoint() {
            this.reportPointQuantity++
        },
        decreaseReportPoint() {
            if (this.reportPointQuantity > 1) {
                this.reportPointQuantity--
            }
        },
        increaseResult() {
            this.resultQuantity++
        },
        decreaseResult() {
            if (this.resultQuantity > 1) {
                this.resultQuantity--
            }
        },
        validateReportPoint() {
            if (!this.reportPointQuantity || this.reportPointQuantity < 1) {
                this.reportPointQuantity = 1
            }
            // 确保是整数
            this.reportPointQuantity = Math.floor(this.reportPointQuantity)
        },
        validateResult() {
            if (!this.resultQuantity || this.resultQuantity < 1) {
                this.resultQuantity = 1
            }
            // 确保是整数
            this.resultQuantity = Math.floor(this.resultQuantity)
        },
        toBuy(templateId, planType) {
            if(this.userInfo.user_role != 0) {
                this.$alert('Only brokers can edit packages and payments', {
                    type: 'warning'
                })
                return;
            }
            if(this.changeModel) {
                this.toChangeSubscribe(templateId, planType);
                return;
            }
            const looding = this.$loading({
                lock: true,
                text: 'Processing...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            paySubscribe({
                templateId,
                planType,
                successUrl: window.location.origin + process.env.BASE_URL + 'subscribe-success',
                cancelUrl: window.location.href,
            }).then(response => {
                if (response.data && response.data.payUrl) {
                    window.location.href = response.data.payUrl;
                }
            }).finally(_ => {
                looding.close();
            })
            // mockBuyPlan(templateId, planType).then(res => {
            //     this.$message.success('Purchase successful!');
            // }).finally(_ => {
            //     looding.close();
            // })
        },
        toChangeSubscribe(templateId, planType) {
            if(planType != this.oldPlanType) {
                this.$alert('You can only change the package within the same billing cycle (monthly to monthly or yearly to yearly)', {
                    type: 'warning'
                })
                return;
            }
            this.$confirm('Are you sure you want to change your subscription plan?', 'Confirm Change', {
                type: 'warning'
            }).then(() => {
                const looding = this.$loading({
                    lock: true,
                    text: 'Processing...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                changeSubscribe({
                    templateId: templateId,
                    planType: planType,
                }).then(response => {
                    this.$router.replace('/wallet')
                }).finally(_ => {
                    looding.close();
                })
            })
        },
        doPayPack(reportPoint, searchPoint) {
            if(this.userInfo.user_role != 0) {
                this.$alert('Only brokers can edit packages and payments', {
                    type: 'warning'
                })
                return;
            }
            const looding = this.$loading({
                lock: true,
                text: 'Processing...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            payPack({
                reportPoint: reportPoint,
                searchPoint: searchPoint,
                successUrl: window.location.origin + process.env.BASE_URL + 'pay-pack-success?backtype=2',
                cancelUrl: window.location.origin + process.env.BASE_URL +  'subscribe'
            }).then(response => {
                if (response.data && response.data.payUrl) {
                    window.location.href = response.data.payUrl;
                }
            }).finally(() => {
                looding.close();
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.subscribe-page {
    padding: 20px;
    max-width: 720px;
    margin: 0 auto;
    min-height: 100vh;
}

.page-header {
    text-align: center;
    margin-bottom: 40px;
}

.page-title {
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.package-section {
    margin-bottom: 60px;
}

.package-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.package-card {
    background: white;
    border-radius: 12px;
    padding-top: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.package-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.package-header {
    text-align: center;
}

.package-name {
    font-size: 20px;
    font-weight: 600;
    color: #4a90e2;
    margin: 0 0 12px 0;
}

.package-price {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 16px;
}

.package-subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
    line-height: 1.4;
}

.package-details {
    margin-bottom: 50px;
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
    text-align: center;

    p {
        font-size: 13px;
        color: #666;
        margin: 6px 0;
        line-height: 1.4;
    }
}

.package-pricing {
    display: flex;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pricing-option {
    flex: 1;
    padding: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &.active {
        background: linear-gradient(135deg, #4a90e2, #357abd);
        color: white;

        .pricing-label {
            color: white;
        }

        .pricing-value {
            color: white;
        }
    }

    &:not(.active) {
        background: #2ecc71;
        color: white;

        .pricing-label {
            color: white;
        }

        .pricing-value {
            color: white;
        }
    }
}

.pricing-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
}

.pricing-value {
    font-size: 14px;
    font-weight: 700;
}

.separate-section {
    text-align: center;
}

.separate-title {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 40px;
}

.separate-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 32px;
    max-width: 800px;
    margin: 0 auto;
}

.separate-card {
    background: white;
    border-radius: 12px;
    padding: 32px 0px 0px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e1e8ed;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.separate-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.separate-header {
    margin-bottom: 20px;
}

.separate-name {
    font-size: 22px;
    font-weight: 600;
    color: #4a90e2;
    margin: 0 0 12px 0;
}

.separate-price {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin-bottom: 16px;
}

.separate-subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
    line-height: 1.4;
}

.separate-details {
    margin-bottom: 24px;

    p {
        font-size: 13px;
        color: #666;
        margin: 6px 0;
        line-height: 1.4;
    }
}

.quantity-control {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    position: relative;
    width: 120px;
    margin-left: auto;
    margin-right: auto;
}

.quantity-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    background: #f0f0f0;
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
        width: 12px;
        height: 12px;
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

.quantity {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    min-width: 60px;
    text-align: center;
}

.total-price {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
}

.get-btn {
    width: 100%;
    padding: 12px 24px;
    background: linear-gradient(135deg, #4a90e2, #357abd);
    color: white;
    border: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: linear-gradient(135deg, #357abd, #2d6aa0);
        transform: translateY(-1px);
    }
}

@media (max-width: 768px) {
    .subscribe-page {
        padding: 16px;
    }

    .package-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .separate-grid {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .package-card,
    .separate-card {
        padding: 20px;
    }

    .page-title {
        font-size: 28px;
    }

    .separate-title {
        font-size: 24px;
    }
}
</style>
