<template>
  <view class="circle-page">
    <view class="publish-card">
      <view class="card-title">商家发帖</view>
      <u-input v-model="publishForm.content" type="textarea" :border="false" :height="170"
        placeholder="请输入帖子内容，分享商品动态..." />
      <view class="upload-wrap">
        <u-upload ref="uploadRef" :header="{ accessToken: storage.getAccessToken() }" :action="uploadAction" width="145"
          :max-count="9" :show-progress="false" @on-uploaded="onUploadDone" />
      </view>
      <view class="publish-footer">
        <text class="tips">支持上传多张图片，提升帖子曝光</text>
        <u-button type="error" shape="circle" size="mini" @click="publishPost">发布</u-button>
      </view>
    </view>

    <view v-if="list.length" class="post-list">
      <PostCard v-for="post in list" :key="post.id" :post="post" />
    </view>
    <u-empty v-else text="暂无帖子" mode="data"></u-empty>
  </view>
</template>

<script>
import { upload } from "@/api/common.js";
import storage from "@/utils/storage.js";
import config from "@/config/config";
import { getCircleList, circleCreate } from "@/api/article";
import PostCard from "./components/PostCard.vue";

export default {
  components: {
    PostCard
  },
  data() {
    return {
      storage,
      uploadAction: upload,
      publishForm: {
        content: "",
        images: []
      },
      params: {
        pageNumber: 1,
        pageSize: 10,
        storeName: "",
      },
      list: []
    };
  },
  onLoad() {
    this.getList();
  },
  onShow() { },
  onReachBottom() {
    this.params.pageNumber++;
    this.getList();
  },
  methods: {
    getList() {
      getCircleList(this.params).then((res) => {
        if (res.data.success) {
          const data = res.data.result;
          if (this.params.pageNumber === 1) {
            this.list = [];
          }
          this.list.push(...data.records);
        }
      });
    },
    onUploadDone(files) {
      this.publishForm.images = files.map((item) => item.response.result);
    },
    publishPost() {
      const content = (this.publishForm.content || "").trim();
      const hasImages = this.publishForm.images.length > 0;
      if (!content && !hasImages) {
        uni.showToast({ title: "请先填写内容或上传图片", icon: "none" });
        return;
      }

      const post = {
        content,
        images: this.publishForm.images,
      };
      circleCreate(post).then((res) => {
        if (res.data.success) {
          this.publishForm.content = "";
          this.publishForm.images = [];
          uni.showToast({ title: "发布成功", icon: "none" });
          if (this.$refs.uploadRef && this.$refs.uploadRef.clear) {
            this.$refs.uploadRef.clear();
          }
          this.params.pageNumber = 1;
          this.getList();
        }
      });
    },
  }
};
</script>

<style scoped lang="scss">
.circle-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 24rpx;
  box-sizing: border-box;
}

.publish-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.publish-card {
  padding: 24rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 18rpx;
}

.upload-wrap {
  margin-top: 8rpx;
}

.publish-footer {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tips {
  font-size: 22rpx;
  color: #999;
}
</style>