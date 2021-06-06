<template>
  <el-select v-model="value" placeholder="请选择">
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
  data() {
    return {
      value: '',
      DictionaryDetail: null,
      Query: {
        pageSize: 100,
        Code: 'detailCode'
      }
    }
  },
  created() {
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
