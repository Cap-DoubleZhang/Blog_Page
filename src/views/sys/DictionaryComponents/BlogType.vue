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
        code: this.detailcode
      },
      firstQuery: {
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
      getDictionaries(this.firstQuery).then(response => {
        this.IsCanMultiple = response.data.items == null ? false : response.data.items[0].isCanMultiple
      })
    },
    GetValue() {
      const value = this.IsCanMultiple ? this.value.length > 1 ? this.value.join(',') : this.value : this.value
      return value
    },
    SetValue(Value) {
      // const arr = Value.split(',')
      // console.log(arr)
       this.value = Value
    }
  }
}
</script>
