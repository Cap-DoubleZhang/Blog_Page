<template>
  <div class="app-container">
    <vue-waterfall-easy :imgs-arr="waterfallList" :max-cols="6" height="790px" @scrollReachBottom="GetFiles" />
  </div>
</template>
<script>
 import { getWaterfallImages } from '@/api/system/file'
 import vueWaterfallEasy from 'vue-waterfall-easy'

export default ({
    components: { vueWaterfallEasy },
    data() {
        return {
            waterfallList: [],
            query: {
                pageIndex: 1
            }
        }
    },
    created() {
        this.GetFiles()
    },
    mounted() {
	},
    methods: {
        GetFiles() {
            getWaterfallImages(this.query).then(response => {
                this.waterfallList = this.waterfallList.concat(response.data.items)
                this.query.pageIndex++
            })
        }
    }
})
</script>
