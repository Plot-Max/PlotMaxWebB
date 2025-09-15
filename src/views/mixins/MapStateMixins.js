import { mapState, mapMutations } from "vuex";

export default {
    computed: {
        ...mapState({
            userInfo: (state) => {
                return state.userInfo
            },
            isLogin: (state) => {
                return state.userInfo ? true : false
            },
            rememberMe: (state) => {
                return state.rememberMe
            },
            username: (state) => {
                return state.username
            },
        }),
    },
    methods: {
        ...mapMutations([
            "changeLogin",
            'setUserInfo',
            'setRememberMe',
            'setUsername',
            'checkSkipped',
            'refreshUserInfo',
        ]),
    },
}