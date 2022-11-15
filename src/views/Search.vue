<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <div class="search-ipt">
        <i class="iconfont icon-icon-test"></i>
        <input
          type="text"
          placeholder="请输入商品名称"
          v-model.trim="keyword"
          @input="onInput"
          @keyup.enter="onEnter"
        />
        <i class="iconfont icon-shanchu" @click="close"></i>
      </div>
      <span class="cancel" @click="cancel">取消</span>
    </div>

    <!-- 搜索联想 -->
    <ul class="suggest" v-show="isShowSuggest">
      <li @click="select(item)" class="suggest-item" v-for="(item, index) in suggestList" :key="index">{{item}}</li>
    </ul>

    <!-- 历史记录 -->
    <div class="search-history" v-show="!isShowSuggest && !isShowResult">
      <div class="history-title">
        <span>历史记录</span>
        <i class="iconfont icon-shanchu1" @click="delHistory"></i>
      </div>
      <ul class="history">
        <li @click="select(item)" class="history-item" v-for="(item, index) in history" :key="index">
            {{item}}
        </li>
      </ul>
    </div>

    <!-- 商品列表 -->
    <div class="result" v-show="isShowResult">
      <product v-for="(item, index) in resultList" :key="index" :item="item" />
    </div>

    <loading v-show="isLoading" />
  </div>
</template>

<script>
import { API_SEARCH_COMPLETE, API_SEARCH } from '@/api.config.js'
import Product from '../components/Product'
import Loading from '../components/Loading'
export default {
  data () {
    return {
      keyword: '', // 关键字
      suggestList: [], // 搜索联想
      resultList: [], // 搜索结果
      isLoading: false,
      history: [] // 搜索历史信息
    }
  },
  components: { Product, Loading },
  computed: {
    isShowSuggest () {
      return this.suggestList.length
    },
    isShowResult () {
      return this.resultList.length
    }
  },
  methods: {
    onInput () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(async () => {
        const suggestList = await this.$axios.post(API_SEARCH_COMPLETE, {
          keywordPrefix: this.keyword
        })
        this.suggestList = suggestList
      }, 200)
    },
    onEnter () {
      this.getSearchResult(this.keyword)
    },
    async getSearchResult (productName) {
      if (productName === '') {
        return
      }
      this.isLoading = true
      this.suggestList = []
      const { directlyList } = await this.$axios.get(API_SEARCH, {
        params: {
          keyword: productName
        }
      })
      this.resultList = directlyList || []
      this.saveHistory(productName)
      this.isLoading = false
    },
    select (productName) {
      this.keyword = productName
      this.getSearchResult(productName)
    },
    close () {
      this.keyword = ''
      this.suggestList = []
      this.resultList = []
    },
    cancel () {
      this.$router.push('/')
    },
    // 读取历史信息
    loadHistory () {
      this.history = JSON.parse(localStorage.getItem('searchHistory')) || []
    },
    // 保存历史信息
    saveHistory (productName) {
      if (this.history.includes(productName)) {
        this.history.splice(this.history.indexOf(productName), 1)
      }
      this.history.unshift(productName)
      localStorage.setItem('searchHistory', JSON.stringify(this.history))
    },
    delHistory () {
      localStorage.removeItem('searchHistory')
      this.history = []
    }
  },
  mounted () {
    this.loadHistory()
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: $colorA;
  padding: 0 0.2rem;
}
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.2rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: $colorA;
  .search-ipt {
    flex: 1;
    background-color: $colorE;
    padding: 0 0.2rem;
    display: flex;
    .iconfont {
      font-size: $fontB;
      color: $colorC;
    }
    input {
      border: none;
      outline: none;
      background-color: $colorE;
      flex: 1;
      font-size: $fontB;
      margin: 0 0.2rem;
    }
  }
  .cancel {
    margin-left: 0.3rem;
  }
}
.search-history {
  margin-top: 0.8rem;
  .history-title {
    font-size: $fontB;
    color: $colorD;
    .iconfont {
      color: $colorC;
      margin-left: 0.3rem;
    }
  }
  .history{
      overflow: hidden;
      &-item{
          border: 1px solid $colorD;
          border-radius: 0.08rem;
          float: left;
          padding: 0 0.15rem;
          margin: 0.12rem;
          color: $colorC;
      }
  }
}
.suggest {
  padding: 0.3rem;
  margin-top: 0.3rem;
  background-color: $colorA;
  &-item {
    padding: 0.2rem 0;
    border-bottom: 1px solid $colorF;
  }
}
.result {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: $colorA;
  margin-top: 0.8rem;
  padding: 0 0.2rem;
}
</style>
