import request from '@/utils/request'

export function userInfo() {
    return request({
        url: `/group/security/user/info`,
        method: 'get'
    })
}
export function register(data) {
    return request({
        url: `/auth/registration`,
        method: 'post',
        data
    })
}
export function login(data) {
    return request({
        url: `/auth/login`,
        method: 'post',
        data
    })
}
export function sendCode(email) {
    return request({
        url: `/auth/email/sendcode?email=${email}`,
        method: 'get'
    })
}
/**
 * 更新组成员活跃时间
 * @returns 
 */
export function loginActive(userId, password, rePassword) {
    return request({
        url: `/group/security/user/update/time`,  
        method: 'get'
    })
}
/**
 * 删除组用户
 * @returns 
 */
export function deleteGroupUser(removeUserld) {
    return request({
        url: `/group/security/remove/user?removeUserId=${removeUserld}`,  
        method: 'get'
    })
}

/**
 *  添加组用户
 * @param {*} data {"username": "testgroup@gmail.com","password":"123123","rePassword":"123123", "role":"GROUP USER"}
 * @returns 
 */
export function addGroupUser(data) {
    return request({
        url: `/group/security/add/user`,
        method: 'post',
        data
    })
}

export function rePassword(userId, password, rePassword) {
    return request({
        url: `/group/security/edit/user/pass?targetUserId=${userId}&password=${password}&rePassword=${rePassword}`,  
        method: 'get'
    })
}


/**
 *  查询组组成员列表
 * @param {*} data 
 * @returns 
 */
export function listGroupUser(keyword) {
    return request({
        url: `/group/security/list/group/user?keyword=${keyword || ''}`,
        method: 'get'
    })
}

/**
 *  编辑或创建当前用户的组信息
 * @param {*} data {"name" :"c", "email":"xxxegmail.com","tele": "2345552233","address":"2 main st." "title":"dev", "companyName": "xxx""companyWebsite":"xx.com","logo":"dd", "isCompany":true?
 * @returns 
 */
export function editCurrentGroup(data) {
    return request({
        url: `/group/security/account/info`,
        method: 'post',
        data
    })
}
/**
 * 获取当前用户的组信息
 * @returns 
 */
export function getCurrentGroup() {
    return request({
        url: `/group/security/group/info`,
        method: 'get'
    })
}
/**
 * 简单搜索地址
 * 
 */
export function searchAddress(address) {
    return request({
        url: `/group/security/search/address?address=${address}`,
        method: 'get'
    })
}
/**
 * 获取当前组的订阅信息
 * @returns 
 */
export function subscribeDetail() {
    return request({
        url: `/group/security/subscribe/detail`,
        method: 'get'
    })
}
/**
 * 获取组报告列表
 * @returns 
 */
export function getGroupReportList() {
    return request({
        url: `/group/security/my/report/order/list`,
        method: 'get'
    })
}
/**
 * chooseService购买报告
 * @returns 
 */
export function buyReport(gid, buyType) {
    return request({
        url: `/group/security/buy/report?gid=${gid}&buyType=${buyType}`,
        method: 'get'
    })
}

export function mockBuyPlan(templateId, planTyype) {
    return request({
        url: `/group/security/mock/buy/plan?templateId=${templateId}&planTyype=${planTyype}`,
        method: 'get'
    })

}
export function mockBuyExtra(params) {
    return request({
        url: `/group/security/mock/buy/extra`,
        method: 'get',
        params
    })

}
/**
 * 获取组的Report列表
 */
export function groupReportList(params) {
    return request({
        url: `/group/security/group/report/list`,
        method: 'get',
        params
    })
}
/**
 * 获取我的Report列表
 */
export function myReportList(params) {
    return request({
        url: `/group/security/my/report/list`,
        method: 'get',
        params
    })
}
/**
 * 获取我的Report列表
 */
export function topReport(reportId, top) {
    return request({
        url: `/group/security/top/report?reportId=${reportId}&top=${top}`,
        method: 'get',
    })
}
/**
 * 组的高级搜索订单列表
 */
export function searchOrderList(params) {
    return request({
        url: `/group/security/group/search/order/list`,
        method: 'get',
        params
    })
}
/**
 * 高级搜索
 */
export function searchComplex(params) {
    return request({
        url: `/group/security/search/complex`,
        method: 'get',
        params
    })
}
/**
 * 购买搜索结果
 */
export function buySearch(data) {
    return request({
        url: `/group/security/buy/search`,
        method: 'post',
        data
    })
}
/**
 * 购买计划
 * {"templateId":1,"planType":0,"cancelUrl":"http://xxxxx", "successUrl": "http://xxxx"}
 * @param {} data 
 * @returns 
 */
export function paySubscribe(data) {
    return request({
        url: `/pay/Stripe/pay/subscribe`,
        method: 'post',
        data
    })
}
/**
 * 取消订阅
 * @returns 
 */
export function unsubscribe() {
    return request({
        url: `/pay/Stripe/cancel/subscription`,
        method: 'get',
    })
}
/**
 * 购买额外点数
 * {"reportPoint":1,"searchPoint":1, "successUrl":"http://xxxx", "cancelUrl":"http://xxxx"}
 * @param {} data 
 * @returns 
 */
export function payPack(data) {
    return request({
        url: `/pay/Stripe/pay/pack`,
        method: 'post',
        data
    })
}

export function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file); // 'file' 是后端接收文件的字段名
    return request({
        url: `/group/security/upload/image`,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    })
}