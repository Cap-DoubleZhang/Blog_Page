<template>
  <el-select v-model="value" collapse-tags :multiple="IsCanMultiple" placeholder="请选择">
    <el-option
      v-for="item in DictionaryDetail"
      :key="item.value"
      :label="item.value"
      :value="item.value"
    />
  </el-select>
</template>
<script>
import { getDictionariesDetail, getDictionaries } from '@/api/dictionary'

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
      },
      listQuery: {
        pageIndex: 1,
        pageSize: 1,
        code: this.detailcode
      }
    }
  },
  created() {
    this.DictionariesDetail()
    this.GetDetailList()
  },
  methods: {
    DictionariesDetail() {
      getDictionariesDetail(this.Query).then((response) => {
        this.DictionaryDetail = response.data.items
      })
    },
    GetDetailList() {
      getDictionaries(this.listQuery).then(response => {
        this.IsCanMultiple = response.data.items == null ? false : response.data.items[0].isCanMultiple
      })
    },
    GetValue() {
      return this.value
    },
    SetValue(Value) {
       this.value = Value
    }
  }
}
</script>
