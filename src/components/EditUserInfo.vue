<template>
    <el-dialog :visible.sync="visible" width="900px" append-to-body>
        <template #title>
            Edit Customer User (<span style="color:red;">English input only</span>)
        </template>
        <el-form :model="form" :inline="false" size="small" label-width="140px">
            <el-row>
                <el-col :sm="11" :xs="24">
                    <el-form-item label="Account" prop="accountEmail">{{ form.accountEmail }}</el-form-item>
                    <el-form-item label="Name" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="Tele" prop="tele">
                        <el-input v-model="form.tele"></el-input>
                    </el-form-item>
                    <el-form-item label="E-mail" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="Address" prop="address">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="{
                    span: 11,
                    offset: 2
                }" :xs="24">
                    <el-form-item label="Job Title" prop="title">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="Company Name" prop="companyName">
                        <el-input v-model="form.companyName"></el-input>
                    </el-form-item>
                    <el-form-item label="Company Website" prop="companyWebsite">
                        <el-input v-model="form.companyWebsite"></el-input>
                    </el-form-item>
                    <el-form-item label="Logo" prop="logo">
                        <el-upload
                           
                            class="logo-uploader"
                            action=""
                            :auto-upload="false"
                            :show-file-list="false"
                            accept="image/jpg,image/jpeg,image/png"
                            :on-change="doUploadImage"
                            >
                            <img v-if="form.logo" :src="form.logo" class="avatar" style="width: 100%;height:100%;">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            
            <el-row>
                <el-col :sm="24" :xs="24">
                    <el-form-item label-width="0px">
                        <el-button type="primary" @click="doSubmit">Submit</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
import { getCurrentGroup, editCurrentGroup, uploadImage } from '@/apis';
export default {
    data() {
        return {
            visible: false,
            form: {
                
            }
        }
    },
    methods: {
        open(){
            this.visible = true
            getCurrentGroup().then(resp => {
                this.form = resp.data;
            })
        },
        doUploadImage(file) {
            console.log(file)
            if((file.size / 1024 / 1024) > 3) {
                this.$message.error('File size should less than 3MB')
                return false
            }
            uploadImage(file.raw).then(resp=>{
                console.log(resp)
                this.form.logo = resp.data
            })
        },
        doSubmit(){
            const loading = this.$loading({
                lock:true,text:'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            if(this.form.accountId == 0) {
                this.form.accountId = this.form.userId;
            }
            editCurrentGroup(this.form).then(resp => {
                this.visible = false;
                this.$route.params.email = null
                this.$parent.loadData();
            }).finally(()=>{
                loading.close()
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>