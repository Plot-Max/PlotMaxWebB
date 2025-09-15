<template>
    <div class="paypack-success-page">
        <div class="success-container">
            <div class="success-content">
                <div class="success-icon">
                    <img src="@/assets/icons/subscribe_success.png" alt="Success" />
                </div>
                <h1 class="success-title">Purchase Points successful !</h1>
                <h3 class="success-subtitle">Your may</h3>
                <div class="success-links">
                    <el-link :underline="false" type="primary" @click="$router.push('/wallet')">Return to the page for confirming the purchase plan</el-link>
                    <el-link :underline="false" type="primary" @click="goToPreviousPage">Go to the previous page</el-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PayPackSuccess',
    methods: {
        goToPreviousPage() {
            if(this.$route.query.backtype == 1) {
                this.$router.push('/wallet')
            } else {
                this.$router.push('/subscribe')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.paypack-success-page {
    min-height: 100vh;
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

.success-subtitle {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 24px 0;
}

.success-links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-top: 12px;
    line-height: 40px;
}

.el-link {
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
    .paypack-success-page {
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
    .success-subtitle {
        font-size: 18px;
        margin-bottom: 20px;
    }
}

@media (max-width: 480px) {
    .success-container {
        padding: 30px 20px;
    }
    .success-title {
        font-size: 20px;
    }
    .success-subtitle {
        font-size: 16px;
    }
}
</style>
