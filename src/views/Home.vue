<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="logo"></div>
      <div class="search" @click="$router.push('/search')">
        <i class="iconfont icon-icon-test"></i>
        <span class="placeholoder">搜索商品，共{{total}}款好物</span>
      </div>
      <!-- 登录按钮判断 没登陆就显示登录 登陆后显示购物车按钮 -->
      <div v-if="userinfo" class="cart" @click="goCart">
        <i class="iconfont icon-gouwuchekong"></i>
        <span class="cart-num" v-if="cartNum > 0">{{cartNum}}</span>
      </div>
      <div v-else class="login" @click="login">登录</div>
    </div>
    <!-- 触底加载滚动的区域 -->
    <div class="scroll-container" ref="scroll-container">
      <div class="scroll-inner" ref="scroll-inner">
        <!-- 轮播图 -->
        <swiper height="3.7rem" :list="bannerList" class="swiper" @onClick="swiperClick" />
        <!-- 首页信息 -->
        <!-- 服务信息 -->
        <div
          class="service-policy"
          v-if="info && info.commonConfigModule && info.commonConfigModule.brandDescPicUrl"
        >
          <img :src="info.commonConfigModule.brandDescPicUrl" alt />
        </div>
        <!-- 分类 -->
        <ul class="kingkong" v-if="info && info.kingKongAreaV4">
          <li
            class="kingkong-item"
            v-for="(item, index) in info.kingKongAreaV4.slice(0, 10)"
            :key="index"
          >
            <img :src="item.picUrls[0]" alt />
            <div class="title">{{item.title}}</div>
          </li>
        </ul>
        <!-- banner -->
        <div class="operation-cfg" v-if="info && info.operationCfg && info.operationCfg[0]">
          <img :src="info.operationCfg[0].picUrls[0]" alt />
        </div>
        <!-- 推荐商品 -->
        <div class="rcmd" v-if="rcmdItemList.length > 0">
          <div class="rcmd-title">推荐商品</div>
          <div class="rcmd-list">
            <product v-for="(item, index) in rcmdItemList" :key="index" :item="item.categoryItem" />
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航菜单 -->
    <nav-footer />

    <loading v-show="isLoading"/>

    <!-- 回到顶部 -->
    <div class="to-top" @click="backToTop"></div>
  </div>
</template>

<script>
import NavFooter from '../components/NavFooter'
import Swiper from '../components/Swiper'
import Product from '../components/Product'
import Loading from '../components/Loading'
import { API_HOME, API_HOME_TOTAL_NUM, API_HOME_RCMD, API_CART_NUM } from '@/api.config.js'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      total: 0, // 当前商品总数
      bannerList: [
        // 'https://yanxuan.nosdn.127.net/e48cc1f908b359c891bb0152feb9e50e.jpg?type=webp&imageView&quality=75&thumbnail=750x0',
        // 'https://yanxuan.nosdn.127.net/9f40ca5a83a06ded9587124432471b67.jpg?type=webp&imageView&quality=75&thumbnail=750x0',
        // 'https://yanxuan.nosdn.127.net/7f762f223c3e320df8260c4b54879124.jpg?type=webp&imageView&quality=75&thumbnail=750x0',
        // 'https://yanxuan.nosdn.127.net/ef739c5f6ba97afbf201ee9d9b3eb16d.jpg?type=webp&imageView&quality=75&thumbnail=750x0',
        // 'https://yanxuan.nosdn.127.net/7d38ac617e6175f468140d326b7ebcda.jpg?type=webp&imageView&quality=75&thumbnail=750x0',
        // 'https://yanxuan.nosdn.127.net/e52ad10cfd0f24691c987006ef82a814.jpg?type=webp&imageView&quality=75&thumbnail=750x0'
      ],
      info: {}, // 首页信息
      rcmdItemList: [], // 推荐商品列表
      isLoading: false
    }
  },
  computed: {
    ...mapState(['cartNum', 'userinfo'])
  },
  components: { NavFooter, Swiper, Product, Loading },
  methods: {
    ...mapMutations(['initCartNum', 'setUserinfo']),
    swiperClick (item) {
      console.log(item)
    },
    async getTotalNums () {
      const total = await this.$axios.get(API_HOME_TOTAL_NUM)
      this.total = total
    },
    async getHomeinfo () {
      const res = await this.$axios.get(API_HOME)
      // console.log(res)
      this.info = res
      this.bannerList = res.focus.map(item => item.img)
    },
    async getRcmdInfo (lastItemId = 0, size = 20) {
      this.isLoading = true
      const { rcmdItemList } = await this.$axios.post(API_HOME_RCMD, {
        lastItemId,
        size
      })
      // console.log(res)
      this.rcmdItemList = this.rcmdItemList.concat(rcmdItemList)
      // this.rcmdItemList.forEach(item => {
      //   console.log(item.categoryItem)
      // })
      this.isLoading = false
    },
    initScroll () {
      const scrollTop = this.scrollContainer.scrollTop
      this.scrollInnerH = this.scrollInner.scrollHeight
      // console.log(scrollTop + this.scrollContainerH, this.scrollInnerH)
      if (scrollTop + this.scrollContainerH + 1 >= this.scrollInnerH) {
        // console.log('触底')
        this.getRcmdInfo(this.rcmdItemList[this.rcmdItemList.length - 1].id)
      }
    },
    // 防抖
    debounce (fn, delay) {
      let timer = null
      return () => {
        if (timer !== null) {
          clearTimeout(timer)
        }
        timer = setTimeout(fn, delay)
      }
    },
    // 节流
    throttle (fn, delay) {
      let startTime = 0
      return () => {
        const nowTime = Date.now()
        if (nowTime - startTime >= delay) {
          startTime = nowTime
          fn()
        }
      }
    },
    // 回到顶部
    backToTop () {
      const timer = setInterval(() => {
        this.scrollContainer.scrollTop = this.scrollContainer.scrollTop - 100
        if (this.scrollContainer.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 17)
    },
    async getCartNum () {
      const res = await this.$axios.get(API_CART_NUM)
      if (res) {
        this.initCartNum(res.num)
        this.setUserinfo(res.user)
      }
    },
    login () {
      this.$router.push('/profile/login')
    },
    goCart () {
      this.$router.push('/cart')
    }
  },
  created () {
    this.getTotalNums()
    this.getHomeinfo()
    this.getRcmdInfo()
    this.getCartNum()
  },
  mounted () {
    this.$nextTick(() => {
      this.scrollContainer = this.$refs['scroll-container']
      this.scrollInner = this.$refs['scroll-inner']
      this.scrollContainerH = this.scrollContainer.clientHeight
      this.scrollContainer.addEventListener('scroll', this.debounce(this.initScroll, 300))
    })
  },
  destroyed () {
    this.scrollContainer.removeEventListener('scroll', this.initScroll)
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 0.88rem;
  padding: 0 0.3rem;
  display: flex;
  align-items: center;
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  width: 100%;
  background-color: $colorA;
  box-sizing: border-box;
  .logo {
    width: 1.38rem;
    height: 0.4rem;
    background-image: url('../assets/img/logo.png');
    background-size: cover;
  }
  .search {
    flex: 1;
    background-color: #ededed;
    margin: 0 0.2rem;
    border-radius: 0.08rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon-icon-test {
      font-size: $fontB;
      color: $colorC;
      margin-right: 0.1rem;
    }
    .placeholoder {
      color: $colorF;
      font-size: $fontB;
    }
  }
  .login {
    width: 0.72rem;
    height: 0.38rem;
    line-height: 0.38rem;
    text-align: center;
    color: $colorB;
    border: 1px solid $colorB;
    border-radius: 0.08rem;
    font-size: $fontB;
  }
}

.kingkong {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  &-item {
    width: 1.1rem;
    height: 1.56rem;
    margin: 0.1rem 0.2rem;
    text-align: center;
    img {
      width: 100%;
    }
    .title {
      color: $colorC;
      font-size: $fontA;
      white-space: nowrap;  //文字不换行
    }
  }
}
.rcmd {
  background-color: $colorA;
  &-title {
    text-align: center;
    padding: 0.2rem 0;
    font-weight: 700;
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 0.2rem;
  }
}
.scroll{
  &-container{
    position: absolute;
    top: 0.88rem;
    bottom: 0.97rem;
    left: 0;
    right: 0;
    overflow-y: scroll;
  }
}
.to-top{
  width: 0.8rem;
  height: 0.8rem;
  background-image: url('../assets/img/to-top.png');
  background-size: 0.8rem 0.8rem;
  position: fixed;
  right: 0.2rem;
  bottom: 1.4rem;
  z-index: 99;
}

.cart{
  position: relative;
  .iconfont{
    font-size: 0.56rem;
  }
  &-num{
    width: 0.36rem;
    height: 0.36rem;
    background-color: $colorB;
    text-align: center;
    line-height: 0.36rem;
    border-radius: 50%;
    color: $colorA;
    position: absolute;
    top: 0.1rem;
    right: -0.1rem;
    font-size: $fontB;
  }
}
</style>
