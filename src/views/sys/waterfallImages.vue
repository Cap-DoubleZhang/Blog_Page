<template>
  <vue-waterfall-easy :imgs-arr="waterfallList" :max-cols="6" height="885px" :src-key="realPath" @scrollReachBottom="GetFiles" />
</template>
<script>
 import { getSysFiles } from '@/api/system/file'
 import vueWaterfallEasy from 'vue-waterfall-easy'

export default ({
    components: { vueWaterfallEasy },
    data() {
        return {
            waterfallList: [
                {
                src: 'https://p1.music.126.net/RVcAosDFn4uLeSZ_byDGdg==/109951165726231133.jpg?param=1024y1024?imageView2/1/w/80/h/80' },
                {
                'src': 'http://picture.ik123.com/uploads/allimg/201118/12-20111Q64451.jpg' },
                {
                'src': 'https://tu1.whhost.net/uploads/20181229/10/1546051605-wWcjCXLymH.jpg' },
                {
                 'src': 'https://img.96an.com/caiji/2020/08/frc-168e906839797092a3c34a77edf3a586.jpeg' },
                 {
                 'src': 'http://picture.ik123.com/uploads/allimg/160720/3-160H0163319.jpg' },
                 {
                 'src': 'http://www.46ps.com/uploadfile/2013/0614/20130614104453530.jpg' },
                 {
                 'src': 'https://img.xjh.me/desktop/img/62759523_p0.jpg' },
                 {
                 'src': 'https://img.xjh.me/desktop/img/59322189_p0_master1200.jpg' },
                 {
                 'src': 'https://img.xjh.me/desktop/img/44400363_p0.jpg' },
                 {
                 'src': 'https://img.xjh.me/desktop/img/41615157_p0.jpg' },
                 {
                 'src': 'https://img.xjh.me/desktop/img/63304069_p0.jpg' }
            ]
        }
    },
    created() {
        // this.GetFiles()
        console.log(this.waterfallList)
    },
    mounted() {
	},
    methods: {
        GetFiles() {
            getSysFiles().then(response => {
                this.waterfallList = response.data.items
            })
        }
    }
})
</script>
