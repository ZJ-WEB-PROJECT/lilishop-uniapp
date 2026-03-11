<template>
  <view class="post-card">
    <view class="post-head">
      <u-image width="72" height="72" shape="circle" :src="post.storeLogo" />
      <view class="head-info">
        <view class="name">{{ post.storeName }}</view>
        <view class="time">{{ post.createTime }}</view>
      </view>
    </view>

    <view class="post-content">{{ post.content }}</view>

    <view class="image-grid" v-if="post.images && post.images.length">
      <u-image v-for="(img, imgIndex) in post.images" :key="img + imgIndex" width="210" height="210" border-radius="12"
        :src="img" @click="previewImages(post.images, imgIndex)" />
    </view>

    <view class="comment-title">评论（{{ post.commentCount }}）</view>
    <view v-if="post.commentList && post.commentList.length" class="comment-list">
      <view class="comment-item" v-for="comment in post.commentList" :key="comment.id">
        <text class="comment-user">{{ comment.nickName }}：</text>
        <text class="comment-text">{{ comment.content }}</text>
      </view>
    </view>
    <view v-else class="empty-comment">暂无评论，快来抢沙发</view>

    <view class="comment-input">
      <u-input v-model="commentText" :border="false" height="66" placeholder="写下你的评论..." />
      <u-button type="primary" shape="circle" size="mini" @click="onSubmitComment">发送</u-button>
    </view>
  </view>
</template>

<script>
import { commentCreate } from "@/api/article";
export default {
  name: "PostCard",
  props: {
    post: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      commentText: "",
      userInfo: this.$options.filters.isLogin() || {}
    }
  },
  mounted() {},
  methods: {
    onSubmitComment() {
      commentCreate({
        postId: this.post.contentId,
        content: this.commentText
      }).then(res => {
        if (res.data.success) {
          this.post.commentList.push({
            nickName: this.userInfo.nickName,
            content: this.commentText
          });
          uni.showToast({ title: "评论成功", icon: "none" });
          this.commentText = "";
        }
      })
    },
    previewImages(images, current) {
      uni.previewImage({
        urls: images,
        current: images[current]
      });
    }
  }
};
</script>

<style scoped lang="scss">
.post-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.post-head {
  display: flex;
  align-items: center;
}

.head-info {
  margin-left: 16rpx;
}

.name {
  color: #333;
  font-size: 28rpx;
  font-weight: 600;
}

.time {
  color: #999;
  font-size: 22rpx;
  margin-top: 4rpx;
}

.post-content {
  font-size: 27rpx;
  color: #333;
  line-height: 1.6;
  margin: 18rpx 0;
  white-space: pre-wrap;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.comment-title {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.comment-item {
  margin-bottom: 8rpx;
  font-size: 24rpx;
  line-height: 1.5;
}

.comment-user {
  color: #333;
  font-weight: 600;
}

.comment-text {
  color: #666;
}

.empty-comment {
  color: #aaa;
  font-size: 23rpx;
  margin-bottom: 12rpx;
}

.comment-input {
  margin-top: 14rpx;
  background: #f5f6f8;
  border-radius: 10rpx;
  padding: 6rpx 10rpx 6rpx 18rpx;
  display: flex;
  align-items: center;
  u-input{
    flex: 1;
  }
}
</style>
