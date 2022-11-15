<template>
  <div class="item" v-if="item" @click="goDetail(item.id)">
    <img class="pic" :src="item.listPicUrl" alt />
    <div class="desc">{{item.simpleDesc}}</div>
    <div class="name">{{item.name}}</div>
    <!-- <div class="name">阿斯顿发送到发生的发生地方萨达撒打发斯蒂芬撒大声地分撒地方撒打发斯蒂芬sad撒大声地分撒地方撒大时代发顺丰</div> -->
    <div class="price">￥{{item.retailPrice}}</div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    goDetail (id) {
      this.$router.push(`/detail/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 3.2rem;
  font-size: $fontA;
  padding-bottom: 0.4rem;
  .pic {
    background-color: $colorE;
  }
  .name {
    font-size: $fontB;
    padding: 0.1rem 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .desc {
    height: 0.7rem;
    line-height: 0.7rem;
    padding: 0 0.1rem;
    background-color: #f0ebe2;
    color: #9e8962;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .price {
    color: $colorB;
    font-size: $fontC;
  }
}
</style>
