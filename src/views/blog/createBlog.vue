<template>
  <BlogDetail :is-edit="false" />
</template>

<script>
import BlogDetail from './components/blogDetail'

export default {
  name: 'CreateArticle',
  components: { BlogDetail }
}
</script>
