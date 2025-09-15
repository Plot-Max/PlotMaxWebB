<template>
    <div class="subscribe-success-page">
        <div class="success-container">
            <div class="success-content">
                <!-- Success Icon -->
                <div class="success-icon">
                    <img src="@/assets/icons/subscribe_success.png" alt="Subscription Success" />
                </div>
                
                <!-- Success Message -->
                <h1 class="success-title">Subscription successful !</h1>
                
                <!-- Current Package Info -->
                <div class="package-info">
                    <h3 class="package-subtitle">Your current package is</h3>
                    
                    <div class="package-card">
                        <h2 class="package-name">Rerpot & Search VIP</h2>
                        <div class="package-price">$ 4,000/Month</div>
                    </div>
                </div>
                
                <!-- Back Link -->
                <a href="#" @click="$router.push('/subscribe')" class="back-link">Go to the previous page</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SubscribeSuccess',
    methods: {
        goToPreviousPage() {
            // 返回上一页或者跳转到指定页面
            this.$router.go(-1)
        }
    },
    mounted() {
        // 可以在这里添加页面加载后的逻辑
        // 比如发送订阅成功统计等
    }
}
</script>

<style lang="scss" scoped>
.subscribe-success-page {
    min-height: 100vh;
    background-color: #f5f7fa;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 20px;
}

.success-container {
    max-width: 600px;
    width: 100%;
    border-radius: 16px;
    padding: 60px 40px;
    text-align: left;
}

.success-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.success-icon {
    margin-bottom: 30px;
    
    img {
        width: 80px;
        object-fit: contain;
    }
}

.success-title {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin: 0 0 20px 0;
    line-height: 1.3;
}

.package-info {
    margin-bottom: 40px;
    width: 100%;
}

.package-subtitle {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 24px 0;
}

.package-card {
    background: #FFFFFF;
    box-shadow: 0px 9px 19px 0px rgba(72,103,196,0.31);
    border-radius: 8px;
    border: 1px solid #4867C4;
    padding: 32px 24px;
    max-width: 400px;
    text-align: center;
}

.package-name {
    font-size: 24px;
    font-weight: 700;
    color: #5A8DEE;
    margin: 0 0 16px 0;
    line-height: 1.2;
}

.package-price {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0;
}

.back-link {
    color: #4a90e2;
    text-decoration: underline;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
        color: #357abd;
        text-decoration: none;
    }
}

@media (max-width: 768px) {
    .subscribe-success-page {
        padding: 16px;
    }
    
    .success-container {
        padding: 40px 24px;
    }
    
    .success-icon {
        margin-bottom: 24px;
        
        img {
            width: 100px;
            height: 100px;
        }
    }
    
    .success-title {
        font-size: 24px;
        margin-bottom: 30px;
    }
    
    .package-subtitle {
        font-size: 18px;
        margin-bottom: 20px;
    }
    
    .package-card {
        padding: 24px 16px;
    }
    
    .package-name {
        font-size: 20px;
        margin-bottom: 12px;
    }
    
    .package-price {
        font-size: 24px;
    }
    
    .package-info {
        margin-bottom: 30px;
    }
}

@media (max-width: 480px) {
    .success-container {
        padding: 30px 20px;
    }
    
    .success-title {
        font-size: 20px;
    }
    
    .package-subtitle {
        font-size: 16px;
    }
    
    .package-name {
        font-size: 18px;
    }
    
    .package-price {
        font-size: 20px;
    }
}
</style>
