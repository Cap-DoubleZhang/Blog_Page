<template>
  <BlogDetail :is-edit="true" />
</template>

<script>
import BlogDetail from './components/blogDetail'

export default {
  name: 'EditArticle',
  components: { BlogDetail }
}
</script>
