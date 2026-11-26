<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getStudyNote } from '@/content/notes'
import '@/css/study.scss'

const route = useRoute()
const note = computed(() => getStudyNote(String(route.params.slug)))
</script>

<template>
  <main class="study">
    <div class="study-wrap">
      <router-link class="study-back" to="/study">返回笔记列表</router-link>
      <article v-if="note">
        <h1 class="study-title">{{ note.title }}</h1>
        <div class="study-meta">{{ note.date }}</div>
        <div class="study-tags">
          <span v-for="tag in note.tags" :key="tag" class="study-tag">{{ tag }}</span>
        </div>
        <div class="study-article" v-html="note.html"></div>
      </article>
      <p v-else class="study-empty">找不到这篇笔记。</p>
    </div>
  </main>
</template>
