<template>
    <div class="choose-service-page">
        <div class="service-container">
            <!-- Address Header -->
            <div class="address-header">
                <h2 class="address-title">{{ $route.query.full_addr }}</h2>
            </div>
            <el-divider></el-divider>

            <!-- Service Selection Title -->
            <h3 class="section-title">Chose your service</h3>

            <!-- Service Cards -->
            <div class="service-cards">
                <!-- Quick Report Card -->
                <div class="service-card">
                    <div>
                        <div class="card-header">
                            <h4 class="service-name">Quick Report</h4>
                        </div>

                        <div class="pricing-info">
                            <div class="price-section">
                                <span class="price">$ 49.99</span>
                                <span class="price-unit">/per report</span>
                            </div>
                            <div class="or-divider">or</div>
                            <div class="points-section">
                                <span class="points">1 report points</span>
                            </div>
                        </div>

                        <div class="features-list">
                            <div class="feature-item">
                                <div class="check-icon">✓</div>
                                <span>Receive a professionally generated land suitability and measurement report via email
                                    within 3 business days.</span>
                            </div>
                            <div class="feature-item">
                                <div class="check-icon">✓</div>
                                <span>Best for: Users who already have a clear idea of what they want to build.</span>
                            </div>
                            <div class="feature-item">
                                <div class="check-icon">✓</div>
                                <span>Includes: Zoning review, lot constraints, basic design feasibility</span>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex;flex-direction: column;gap:10px">
                        <!-- <el-input placeholder="Coupon Code" v-model="couponCode1"></el-input> -->
                        <button class="get-report-btn" @click="selectService('0')">GET REPORT</button>
                    </div>
                </div>

                <!-- Custom Report Card -->
                <div class="service-card">
                    <div>
                        <div class="card-header">
                            <h4 class="service-name">Custom Report</h4>
                            <p class="service-subtitle">with One - on - One Consultation</p>
                        </div>

                        <div class="pricing-info">
                            <div class="price-section">
                                <span class="price">$ 99.99</span>
                                <span class="price-unit">/per report</span>
                            </div>
                            <div class="or-divider">or</div>
                            <div class="points-section">
                                <span class="points">2 report points</span>
                            </div>
                        </div>

                        <div class="features-list">
                            <div class="feature-item">
                                <div class="check-icon">✓</div>
                                <span>Schedule a one - on - one video or phone consultation.</span>
                            </div>
                            <div class="feature-item">
                                <div class="check-icon">✓</div>
                                <span>We'll learn about your needs and help define your goals.</span>
                            </div>
                            <div class="feature-item">
                                <div class="check-icon">✓</div>
                                <span>Based on the discussion, we will generate a tailored land report within 3 business
                                    days.</span>
                            </div>
                            <div class="feature-item">
                                <div class="check-icon">✓</div>
                                <span>Best for: Users who want guidance on what can be built or want to maximize land
                                    use.</span>
                            </div>
                            <div class="feature-item">
                                <div class="check-icon">✓</div>
                                <span>Includes: All features of Quick Report + personalized design insight.</span>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex;flex-direction: column;gap:10px">
                        <!-- <el-input placeholder="Coupon Code" v-model="couponCode1"></el-input> -->
                        <button class="get-report-btn" @click="selectService('2')">GET REPORT</button>
                    </div>
                </div>
            </div>

            <!-- Bottom Link -->
            <div class="bottom-section">
                <a :href="subscribeUrl" class="package-link">Purchasing a package deal is more cost-effective</a>
            </div>
        </div>
    </div>
</template>

<script>
import { buyReport, subscribeDetail } from '@/apis'
export default {
    name: 'ChooseService',
    data() {
        return {
            couponCode1: '',
            couponCode2: '',
            subscribeUrl: process.env.BASE_URL + 'subscribe'
        }
    },
    methods: {
        selectService(type) {
            // 处理服务选择逻辑
            const loading = this.$loading({
                lock: true,
                text: 'Processing...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            buyReport(this.$route.query.gid, type).then(res => {
                console.log('Service selected:', type);
                if(res.data > 0) {
                    this.$router.push('/point-not-enough?gid=' + this.$route.query.gid+'&type=' + type + '&result=' + res.data + '&full_addr=' + this.$route.query.full_addr)
                }
                else {
                    this.$router.push('/pay-success?type=' + type)
                }
            }).finally(() => {
                loading.close();
            });
        }
    },
    mounted() {
    }
}
</script>

<style lang="scss" scoped>
.choose-service-page {
    padding: 0px 20px;
    max-width: 950px;
    margin: 0 auto;
}

.service-container {
    max-width: 1000px;
    margin: 0 auto;
}

.address-header {
    border-radius: 8px;
    padding: 10px 24px;
    margin-bottom: 12px;
}

.address-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.section-title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    text-align: center;
    margin: 0 0 40px 0;
}

.service-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 40px;
}

.service-card {
    background: white;
    border-radius: 12px;
    padding: 32px 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 2px solid transparent;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &:hover {
        transform: translateY(-2px);
        border-color: #4a90e2;
        box-shadow: 0 8px 24px rgba(74, 144, 226, 0.2);
    }
}

.card-header {
    margin-bottom: 24px;
}

.service-name {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px 0;
}

.service-subtitle {
    font-size: 14px;
    font-weight: bold;
    margin: 0;
}

.pricing-info {
    margin-bottom: 24px;
}

.price-section {
    margin-bottom: 8px;
}

.price {
    font-size: 32px;
    font-weight: 700;
    color: #333;
}

.price-unit {
    font-size: 16px;
    color: #666;
    margin-left: 4px;
}

.or-divider {
    font-size: 18px;
    font-weight: bold;
    margin: 8px 0;
}

.points-section {
    .points {
        font-size: 32px;
        font-weight: 600;
        color: #333;
    }
}

.features-list {
    margin-bottom: 24px;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;

    &:last-child {
        margin-bottom: 0;
    }
}

.check-icon {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    margin-top: 2px;
    flex-shrink: 0;
    font-size: 12px;
    font-weight: bold;
}

.feature-item span {
    font-size: 14px;
    color: #333;
    line-height: 1.5;
}

.coupon-link {
    color: #4a90e2;
    text-decoration: underline;
    font-size: 14px;

    &:hover {
        color: #357abd;
    }
}

.get-report-btn {
    width: 100%;
    background: #326EE6;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 9px 24px;
    font-size: 27px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
         background: #4a90e2;
        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        transform: translateY(-1px);
    }
}

.bottom-section {
    text-align: center;
}

.package-link {
    color: #4a90e2;
    text-decoration: underline;
    font-size: 25px;
    font-weight: 500;

    &:hover {
        color: #357abd;
    }
}

@media (max-width: 768px) {
    .choose-service-page {
        padding: 20px 16px;
    }

    .service-cards {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .service-card {
        padding: 24px 20px;
    }

    .address-header {
        padding: 16px 20px;
        margin-bottom: 24px;
    }

    .address-title {
        font-size: 16px;
    }

    .section-title {
        font-size: 20px;
        margin-bottom: 30px;
    }

    .service-name {
        font-size: 18px;
    }

    .price {
        font-size: 28px;
    }
}

@media (max-width: 480px) {
    .service-card {
        padding: 20px 16px;
    }

    .section-title {
        font-size: 18px;
    }

    .service-name {
        font-size: 16px;
    }

    .price {
        font-size: 24px;
    }

    .feature-item span {
        font-size: 13px;
    }
}
</style>
