<template>
  <div class="nav">
    <router-link to="/" class="nav-item">
      <i class="iconfont icon-shouye"></i>
      <div>首页</div>
    </router-link>

    <router-link to="/category" class="nav-item">
      <i class="iconfont icon-sort"></i>
      <div>分类</div>
    </router-link>
    <router-link to="/cart" class="nav-item">
      <i class="iconfont icon-gouwuchekong"></i>
      <div>购物车</div>
    </router-link>
    <router-link to="/profile/login" class="nav-item">
      <i class="iconfont icon-gerenyonghutouxiang"></i>
      <div>个人</div>
    </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.97rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $colorA;
  border: 1px solid #d9d9d9;
  line-height: 1.4;
  &-item {
    flex: 1;
    text-align: center;
    outline: none;    //去掉外面蓝色边框

    div {
      color: $colorF;
    }

    .iconfont {
      font-size: $fontD;
      color: $colorF;
    }
  }

  .router-link-exact-active {
    div {
      color: $colorB;
    }

    &:active {
      -webkit-tap-highlight-color: transparent; // 去掉a标签点击默认的蓝色背景
    }

    .iconfont {
      color: $colorB;
    }
  }
}
</style>
