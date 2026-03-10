<template>
    <view>
        <!-- 顶部轮播，保持和首页风格一致 -->
        <carousel :res="bannerList" />

        <view v-if="storeList.length != 0" class="wrapper">
            <u-waterfall :value="storeList">
                <template v-slot:left="{ leftList }">
                    <view class="column">
                        <view class="store-item" v-for="(item, index) in leftList" :key="item.id || index"
                            @click="handleClickStore(item)">
                            <image class="store-cover" :src="item.storeLogo" mode="widthFix"></image>
                            <view class="store-msg">
                                <view class="store-name u-line-1">{{ item.storeName }}</view>
                                <view class="goods-num">商品 {{ item.goodsNum }}</view>
                                <view class="store-distance">
                                    <view>
                                        <text class="store-score">{{ item.serviceScore | unitPrice }}</text>
                                        <text class="line">|</text>
                                        <text class="store-collection">收藏 {{ item.collectionNum }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>

                <template v-slot:right="{ rightList }">
                    <view class="column">
                        <!-- 右列同样结构 -->
                        <view class="store-item" v-for="(item, index) in rightList" :key="item.id || index"
                            @click="handleClickStore(item)">
                            <image class="store-cover" :src="item.storeLogo" mode="widthFix"></image>
                            <view class="store-msg">
                                <view class="store-name u-line-1">{{ item.storeName }}</view>
                                <view class="goods-num">商品 {{ item.goodsNum }}</view>
                                <view class="store-distance">
                                    <view>
                                        <text class="store-score">{{ item.serviceScore | unitPrice }}</text>
                                        <text class="line">|</text>
                                        <text class="store-collection">收藏 {{ item.collectionNum }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
            </u-waterfall>
        </view>
        <u-empty v-else style="margin-top: 20%;" text="暂无店铺信息"></u-empty>
    </view>
</template>

<script>
import { getFloorData } from "@/api/home";
import { getStoreList } from "@/api/store";
import tpl_banner from "@/pages/tabbar/home/template/tpl_banner";
export default {
    components: {
        carousel: tpl_banner,
    },

    data() {
        return {
            bannerList: [],
            params: {
                pageNumber: 1,
                pageSize: 10,
                storeName: "",
            },
            storeList: [],
        }
    },
    onReachBottom() {
        this.params.pageNumber++;
        this.getList();
    },
    mounted() {
        this.init()
        this.getList()
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
        async getList() {
            const res = await getStoreList(this.params);
            if (res.data.success) {
                const data = res.data.result;
                // 追加新一页数据，用于上拉加载
                this.storeList.push(...data.records);
            }
        },
        handleClickStore(val) {
            uni.navigateTo({
                url: `/pages/product/shopPage?id=${val.id}`
            });
        },
    }
}
</script>

<style scoped lang="scss">
.wrapper {
    padding: 0 16rpx 16rpx;
}

.column {
    flex: 1;
}

.u-waterfall{
    display: flex;
    gap: 16rpx;
}

.store-item {
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.04);
    margin-top: 16rpx;
}

.store-cover {
    width: 100%;
    display: block;
}

/* 下面保持原来的文字样式 */
.store-msg {
    padding: 18rpx 20rpx 20rpx;
}

.store-name {
    font-weight: bold;
    font-size: 28rpx;
    color: #333;
}

.goods-num {
    margin-top: 8rpx;
    color: #ff8a00;
    font-size: 24rpx;
}

.store-distance {
    margin-top: 10rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.store-score {
    color: #ff4444;
    font-size: 24rpx;
    font-weight: bold;
}

.line {
    margin: 0 6rpx;
    color: #ccc;
}

.store-collection {
    color: #999;
    font-size: 22rpx;
}
</style>