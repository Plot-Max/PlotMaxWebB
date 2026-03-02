<template>
    <div class="page-container">
        <el-row :gutter="50" class="page" style="width: 100%; margin: 0px;">
            <el-col :sm="11" :xs="24" class="left">
            <div class="bold title">What to Expect</div>
            <div>
                <p>1. You'll receive a confirmation email shortly.</p>
                <p>2. For quick reports: Your land report will be delivered via email within 3 business days.</p>
                <p>3. For custom consultations: We'll also confirm your appointment time shortly.</p>
                <p class="bold title">4. Don't forget to check your spam folder just in case!</p>
            </div>
            <div style="line-height: 50px;">Have questions or updates?</div>
            <div>Just reply to your confirmation email or <a href="mailto:george@plotmax.com">contact us here</a></div>
        </el-col>
        <el-col :sm="13" :xs="24" class="right">
            <div style="display: flex;align-items: center;gap: 10px;">
                <img src="@/assets/icons/newicon-2026/Successful.png" class="pay-success"/>
                <span v-if="$route.query.type == 0" class="bold">This consumption：1 report points/ $49.99</span>
                <span v-else class="bold">This consumption：2 report points/ $99.99</span>
            </div>
            <div class="right-content">
                <div class="bold title">Thank your for your purchase!</div>
                <div class="right-desc">We're excited to get started on your land report. Your request has been successfully received.</div>
                <div class="bold title">If you have purchased the premium version of the report</div>
                <div class="right-desc">please contact us via email to schedule a communication method and time.</div>
                <a href="mailto:info@plot-max.com">info@plot-max.com</a>
                <el-link :underline="true" type="primary" @click="$router.push('/report')">Go to the report page</el-link>
            </div>
        </el-col>
    </el-row>
    </div>
</template>

<script>
export default {
    components: {

    },
    data() {
        return {
            time: 3
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            this.time--
            if(this.time == 0) {
                clearInterval(this.timer)
                // if(!this.userInfo.skipped) {
                //     this.$router.push('/register/step1?from=p')
                // }
                // else {
                //     this.$router.push('/reports')
                // }

                // this.$router.push('/reports')
            }
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }

}
</script>

<style lang="scss" scoped>
.page-container {
    width: 100%;
    display: flex;
    justify-content: center;
}
.page {
    font-size: 20px;
    margin-top: 40px;
    line-height: 32px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    margin: 0px;
    max-width: 1200px;
    a {
        color: #007855;
    }
}
.bold {
    font-size: 20px;
    font-weight: bold;
}
.title {
    line-height: 34px;
    padding: 20px 0px;
}
.right-desc {
    width: 400px;
    max-width: 100%;
    font-size: 20px;
}

.right {
    border-top: 1px solid #999999;
    margin-top: 20px;
    padding-top: 20px;
    .right-content {
        width: 100%;max-width: 300px;
    }
    @media (min-width: 768px) {
        border-top: none;;
        border-left: 1px solid #999999;
        padding-top: 0px;
        margin-top: 0px;
    }
}
::v-deep .el-link {
    color: #007855 !important;
    font-size: 20px !important;
}
.pay-success {
    width: 90px;
}
</style>
