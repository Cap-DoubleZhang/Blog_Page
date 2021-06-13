<template>
  <el-select v-model="value" :multiple="IsCanMultiple" placeholder="请选择">
    <el-option
      v-for="item in DictionaryDetail"
      :key="item.value"
      :label="item.value"
      :value="item.value"
    />
  </el-select>
</template>
<script>
import { getDictionariesDetail } from '@/api/dictionary'

export default {
  name: 'BlogType',
  props: {
    detailcode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: '',
      DictionaryDetail: null,
      IsCanMultiple: false,
      Query: {
        pageSize: 100,
        Code: this.detailcode
      }
    }
  },
  created() {
    console.log(this.detailcode)
    this.DictionariesDetail()
  },
  methods: {
    DictionariesDetail() {
      getDictionariesDetail(this.Query).then((response) => {
        this.DictionaryDetail = response.data.items
      })
    }
  }
}
</script>
