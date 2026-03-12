<template>
  <div class="wrapper">
    <!-- uni 中不能使用 vue component 所以用if判断每个组件 -->
    <div class="match-arena" @click="navigateToMeet">

      <!-- 我的卡片 -->
      <div class="user-card">
        <div class="avatar-wrap">
          <div class="avatar-ring"></div>
          <div class="avatar">🧑</div>
          <div class="avatar-status"></div>
        </div>
        <div class="user-name">我</div>
        <div class="user-tags">
          <span class="user-tag">美食</span>
          <span class="user-tag">旅行</span>
        </div>
      </div>

      <!-- 中间按钮区 -->
      <div class="match-center">
        <div class="connect-line">
          <div class="connect-dots">
            <div class="connect-dot"></div>
            <div class="connect-dot"></div>
            <div class="connect-dot"></div>
          </div>
        </div>

        <div class="match-btn" id="matchBtn">
          <div class="ripple-ring"></div>
          <div class="ripple-ring"></div>
          <div class="ripple-ring"></div>
          <div class="matching-spinner"></div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" id="matchIcon">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span class="match-btn-label">开始匹配</span>
        </div>

        <div class="match-status-text" id="matchStatusText">点击匹配好友</div>
      </div>

      <!-- 对方卡片（随机展示） -->
      <div class="user-card" id="targetCard">
        <div class="avatar-wrap">
          <div class="avatar-ring" style="animation-direction: reverse;"></div>
          <div class="avatar" id="targetAvatar">❓</div>
          <div class="avatar-status" id="targetStatus" style="background:#888;"></div>
        </div>
        <div class="user-name" id="targetName">等待中</div>
        <div class="user-tags" id="targetTags">
          <span class="user-tag">?</span>
        </div>
      </div>

    </div>
    <div v-for="(item, index) in pageData.list" :key="index">
      <!-- 搜索栏，如果在楼层装修顶部则会自动浮动，否则不浮动 -->
      <!-- <u-navbar class="navbar" v-if="item.type == 'search'" :is-back="false" :is-fixed="index === 1 ? false : true">
        <search style="width: 100%" :res="item.options" />
        <div slot="right" class="navbar-right">
          <u-icon name="scan" @click="scan()" color="#666" size="50"></u-icon>
        </div>
      </u-navbar> -->
      <!-- <carousel v-if="item.type == 'carousel'" :res="item.options" /> -->
      <titleLayout v-if="item.type == 'title'" :res="item.options" />
      <!-- <leftOneRightTwo v-if="item.type == 'leftOneRightTwo'" :res="item.options" /> -->
      <leftTwoRightOne v-if="item.type == 'leftTwoRightOne'" :res="item.options" />
      <topOneBottomTwo v-if="item.type == 'topOneBottomTwo'" :res="item.options" />
      <topTwoBottomOne v-if="item.type == 'topTwoBottomOne'" :res="item.options" />
      <flexThree v-if="item.type == 'flexThree'" :res="item.options" />
      <flexFive v-if="item.type == 'flexFive'" :res="item.options" />
      <flexFour v-if="item.type == 'flexFour'" :res="item.options" />
      <!-- <flexTwo v-if="item.type == 'flexTwo'" :res="item.options" /> -->
      <textPicture v-if="item.type == 'textPicture'" :res="item.options" />
      <!-- <menuLayout v-if="item.type == 'menu'" :res="item.options" /> -->
      <!-- <flexOne v-if="item.type == 'flexOne'" :res="item.options" /> -->
      <goods :enableBottomLoad="enableLoad" v-if="item.type == 'goods'" :res="item.options" />
      <group v-if="item.type == 'group'" :res="item.options" />
      <notice v-if="item.type == 'notice'" :res="item.options" />
      <promotions v-if="item.type == 'promotionDetail'" :res="item.options" />
      <!-- <joinGroup v-if="item.type == 'joinGroup'" :res="item.options" /> -->
      <!-- <integral v-if="item.type == 'integral'" :res="item.options" /> -->
      <!-- <spike v-if="item.type == 'spike'" :res="item.options" /> -->

    </div>
    <fetchCoupon ref='coupon' />
    <u-no-network @retry="init" @isConnected="isConnected"></u-no-network>
  </div>
</template>

<script>
// 引用组件
import tpl_banner from "@/pages/tabbar/home/template/tpl_banner"; //导航栏模块
import tpl_title from "@/pages/tabbar/home/template/tpl_title"; //标题栏模块
import tpl_left_one_right_two from "@/pages/tabbar/home/template/tpl_left_one_right_two"; //左一右二模块
import tpl_left_two_right_one from "@/pages/tabbar/home/template/tpl_left_two_right_one"; //左二右一模块
import tpl_top_one_bottom_two from "@/pages/tabbar/home/template/tpl_top_one_bottom_two"; //上一下二模块
import tpl_top_two_bottom_one from "@/pages/tabbar/home/template/tpl_top_two_bottom_one"; //上二下一模块
import tpl_flex_one from "@/pages/tabbar/home/template/tpl_flex_one"; //单行图片模块
import tpl_flex_two from "@/pages/tabbar/home/template/tpl_flex_two"; //两张横图模块
import tpl_flex_three from "@/pages/tabbar/home/template/tpl_flex_three"; //三列单行图片模块
import tpl_flex_five from "@/pages/tabbar/home/template/tpl_flex_five"; //五列单行图片模块
import tpl_flex_four from "@/pages/tabbar/home/template/tpl_flex_four"; //四列单行图片模块
import tpl_text_picture from "@/pages/tabbar/home/template/tpl_text_picture"; //文字图片模板
import tpl_menu from "@/pages/tabbar/home/template/tpl_menu"; //五列菜单模块
import tpl_search from "@/pages/tabbar/home/template/tpl_search"; //搜索栏
import tpl_group from "@/pages/tabbar/home/template/tpl_group"; //
import tpl_goods from "@/pages/tabbar/home/template/tpl_goods"; //商品分类以及分类中的商品
// 结束引用组件
import { getFloorData } from "@/api/home"; //获取楼层装修接口
import permission from "@/js_sdk/wa-permission/permission.js"; //权限工具类
import config from "@/config/config";

import tpl_notice from "@/pages/tabbar/home/template/tpl_notice"; //标题栏模块
import tpl_promotions from "@/pages/tabbar/home/template/tpl_promotions_detail"; //标题栏模块
import storage from "@/utils/storage.js";
import fetchCoupon from '@/pages/tabbar/home/template/fetch_coupon'
// import {receiveCoupons} from "@/api/members"

export default {
  data() {
    return {
      config,
      storage,
      showCp: true,
      pageData: "", //楼层页面数据
      isIos: "",
      enableLoad: false, //触底加载 针对于商品模块
    };
  },
  components: {
    carousel: tpl_banner,
    titleLayout: tpl_title,
    leftOneRightTwo: tpl_left_one_right_two,
    leftTwoRightOne: tpl_left_two_right_one,
    topOneBottomTwo: tpl_top_one_bottom_two,
    topTwoBottomOne: tpl_top_two_bottom_one,
    flexThree: tpl_flex_three,
    flexFive: tpl_flex_five,
    flexFour: tpl_flex_four,
    flexTwo: tpl_flex_two,
    textPicture: tpl_text_picture,
    menuLayout: tpl_menu,
    search: tpl_search,
    flexOne: tpl_flex_one,
    goods: tpl_goods,
    group: tpl_group,
    notice: tpl_notice,
    promotions: tpl_promotions,
    fetchCoupon
  },

  mounted() {
    this.init();
    // #ifdef MP-WEIXIN
    // 小程序默认分享
    uni.showShareMenu({ withShareTicket: true });
    // #endif

  },
  methods: {
    navigateToMeet() {
      uni.navigateTo({
        url: "/pages/mine/im/list"
      });
    },
    fetchCoupon() {
      this.$refs.coupon.firstGetAuto();
    },
    /**
     * 实例化首页数据楼层
     */
    init() {
      this.pageData = "";
      getFloorData().then((res) => {
        if (res.data.success) {
          const result = JSON.parse(res.data.result.pageData)
          this.pageData = result;
          if (result.list.length) {
            // 如果最后一个装修模块是商品模块的话 默认启用自动加载
            result.list[result.list.length - 1] ? result.list[result.list.length - 1].model == 'goods' ? this.enableLoad = true : '' : ''
          }
        }
      });
    },
    // 是否有网络链接
    isConnected(val) {
      val ? this.init() : ''
    },

    /**
     * TODO 扫码功能后续还会后续增加
     * 应该实现的功能目前计划有：
     * 扫描商品跳转商品页面
     * 扫描活动跳转活动页面
     * 扫描二维码登录
     * 扫描其他站信息 弹出提示，返回首页。
     */
    scanCode() {
      uni.scanCode({
        success: function (res) {
          let path = encodeURIComponent(res.result);



          if (path != undefined && path.indexOf("QR_CODE_LOGIN_SESSION") == 0) {
            console.log(path)
            //app扫码登录
            uni.navigateTo({
              url: "/pages/passport/scannerCodeLoginConfirm?token=" + path
            });
            return;
          }


          // WX_CODE 为小程序码
          if (res.scanType == "WX_CODE") {
            console.log(res);
            uni.navigateTo({
              url: `/${res.path}`,
            });
          } else {
            config.scanAuthNavigation.forEach((src) => {
              if (res.result.indexOf(src) != -1) {
                uni.navigateTo({
                  url: `/${res.result.substring(src.length)}`,
                });
              } else {
                setTimeout(() => {
                  uni.navigateTo({
                    url: "/pages/tabbar/home/web-view?src=" + path,
                  });
                }, 100);
              }
            });
          }
        },
      });
    },

    /**
     * 提示获取权限
     */
    tipsGetSettings() {
      uni.showModal({
        title: "提示",
        content: "您已经关闭相机权限,去设置",
        success: function (res) {
          if (res.confirm) {
            if (this.isIos) {
              plus.runtime.openURL("app-settings:");
            } else {
              permission.gotoAppPermissionSetting();
            }
          }
        },
      });
    },

    /**
     * 唤醒客户端扫码
     * 没权限去申请权限，有权限获取扫码功能
     */
    async scan() {
      // #ifdef APP-PLUS
      this.isIos = plus.os.name == "iOS";
      // 判断是否是Ios
      if (this.isIos) {
        const iosFirstCamera = uni.getStorageSync("iosFirstCamera"); //是不是第一次开启相机
        if (iosFirstCamera !== "false") {
          uni.setStorageSync("iosFirstCamera", "false"); //设为false就代表不是第一次开启相机
          this.scanCode();
        } else {
          if (permission.judgeIosPermission("camera")) {
            this.scanCode();
          } else {
            // 没有权限提醒是否去申请权限
            this.tipsGetSettings();
          }
        }
      } else {
        /**
         * TODO 安卓 权限已经授权了，调用api总是显示用户已永久拒绝申请。人傻了
         * TODO 如果xdm有更好的办法请在 https://gitee.com/beijing_hongye_huicheng/lilishop/issues 提下谢谢
         */
        this.scanCode();
      }

      // #endif

      // #ifdef MP-WEIXIN
      this.scanCode();
      // #endif
    },
  },
};
</script>

<style scoped lang="scss">
.meet {
  text-align: center;
  line-height: 100rpx;
  background: #fff;
  font-size: 28rpx;
  font-weight: bold;
}

.navbar-right {
  padding: 0 16rpx 0 0;
}

.match-arena {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  background: linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  padding: calc(var(--status-bar-height) + 40px) 20px 28px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
      radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
      radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
    background-size: 80px 80px, 120px 120px, 60px 60px;
    background-position: 10px 10px, 40px 30px, 70px 60px;
    pointer-events: none;
  }

  .user-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 90px;
  }



  .avatar-wrap {
    position: relative;
    width: 72px;
    height: 72px;
  }

  .avatar-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2.5px solid transparent;
    background: linear-gradient(135deg, #ff6b9d, #a855f7, #3b82f6) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    animation: spin-ring 4s linear infinite;
  }

  @keyframes spin-ring {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }


  .avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    overflow: hidden;
    background: #2a2a4a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 14px;
    height: 14px;
    background: #2ed573;
    border-radius: 50%;
    border: 2px solid #16213e;
  }

  .user-name {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
  }

  .user-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
  }

  .user-tag {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 2px 6px;
  }

  /* 中间匹配按钮区 */
  .match-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  /* 连接线动画 */
  .connect-line {
    width: 100%;
    height: 2px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .connect-line::before,
  .connect-line::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5));
  }

  .connect-line::after {
    background: linear-gradient(90deg, rgba(168, 85, 247, 0.5), transparent);
  }

  .connect-dots {
    display: flex;
    gap: 4px;
    padding: 0 6px;
  }

  .connect-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(168, 85, 247, 0.6);
    animation: blink-dot 1.4s infinite;
  }

  .connect-dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .connect-dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  /* 主匹配按钮 */
  .match-btn {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2px;
    background: linear-gradient(135deg, #ff6b9d 0%, #a855f7 50%, #3b82f6 100%);
    box-shadow:
      0 0 0 4px rgba(168, 85, 247, 0.2),
      0 0 20px rgba(168, 85, 247, 0.4),
      0 4px 15px rgba(0, 0, 0, 0.3);
    transition: transform 0.15s, box-shadow 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .match-btn:active {
    transform: scale(0.93);
    box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .match-btn.matching {
    animation: btn-pulse 1.2s ease-in-out infinite;
  }

  .match-btn svg {
    display: block;
  }

  .match-btn-label {
    font-size: 9px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* 波纹动画圆圈 */
  .ripple-ring {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 1.5px solid rgba(168, 85, 247, 0.5);
    animation: ripple 2s ease-out infinite;
    pointer-events: none;
    z-index: 99;
  }

  .ripple-ring:nth-child(2) {
    inset: -20px;
    animation-delay: 0.6s;
    border-color: rgba(255, 107, 157, 0.3);
  }

  .ripple-ring:nth-child(3) {
    inset: -30px;
    animation-delay: 1.2s;
    border-color: rgba(59, 130, 246, 0.2);
  }

  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }

    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  /* 匹配状态文字 */
  .match-status-text {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    letter-spacing: 0.3px;
  }

  /* 匹配成功弹层 */
  .match-success-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    backdrop-filter: blur(4px);
  }

  .match-success-overlay.show {
    opacity: 1;
    pointer-events: all;
  }

  .match-success-card {
    background: linear-gradient(160deg, #1a1a2e, #16213e);
    border: 1px solid rgba(168, 85, 247, 0.3);
    border-radius: 24px;
    padding: 32px 28px;
    text-align: center;
    width: 300px;
    position: relative;
    overflow: hidden;
    transform: scale(0.8);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .match-success-overlay.show .match-success-card {
    transform: scale(1);
  }

  .match-success-card::before {
    content: '';
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.2), transparent 70%);
    pointer-events: none;
  }

  .success-title {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 6px;
  }

  .success-subtitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.55);
    margin-bottom: 24px;
  }

  .success-avatars {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-bottom: 20px;
  }

  .success-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 3px solid #16213e;
    background: #2a2a4a;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .success-avatar:first-child {
    margin-right: -12px;
    z-index: 1;
  }

  .success-avatar:last-child {
    margin-left: -12px;
  }

  .success-heart {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #ff6b9d, #ff4757);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    box-shadow: 0 0 12px rgba(255, 107, 157, 0.6);
    animation: heartbeat 1s ease-in-out infinite;
  }

  .success-names {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 24px;
  }

  .success-names strong {
    color: #fff;
  }

  .success-btn-group {
    display: flex;
    gap: 10px;
  }

  .btn-say-hi {
    flex: 1;
    padding: 13px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #ff6b9d, #a855f7);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
  }

  .btn-skip {
    flex: 1;
    padding: 13px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
}
</style>
