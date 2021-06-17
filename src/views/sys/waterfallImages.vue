<template>
  <vue-waterfall-easy :imgs-arr="waterfallList" @scrollReachBottom="GetFiles" />
</template>
<script>
 import { getSysFiles } from '@/api/system/file'
 import vueWaterfallEasy from 'vue-waterfall-easy'

export default ({
    components: { vueWaterfallEasy },
    data() {
        return {
            waterfallList: []
        }
    },
    created() {
        this.GetFiles()
    },
    mounted() {
	},
    methods: {
        GetFiles() {
            getSysFiles().then(response => {
                this.waterfallList = response.data.items
                setTimeout(() => {
                    this.listLoading = false
                }, 1 * 1000)
            })
        }
    }
})
</script>
