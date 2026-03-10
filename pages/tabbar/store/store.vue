<template>
    <view>
        <!-- <u-navbar class="navbar" :is-back="false" :is-fixed="false"></u-navbar> -->
        <carousel :res="bannerList" />
    </view>
</template>

<script>
import { getFloorData } from "@/api/home";
import tpl_banner from "@/pages/tabbar/home/template/tpl_banner";
export default {
    components: {
        carousel: tpl_banner,
    },

    data() {
        return {
            bannerList: []
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.pageData = "";
            getFloorData().then((res) => {
                if (res.data.success) {
                    const result = JSON.parse(res.data.result.pageData)
                    this.bannerList = result.list.find(item => item.type == 'carousel').options;
                }
            });
        },
    }
}
</script>