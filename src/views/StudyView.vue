<script setup lang="ts">
import { listStudyNotes } from '@/content/notes'
import '@/css/study.scss'

const notes = listStudyNotes()
</script>

<template>
  <main class="study">
    <div class="study-wrap">
      <router-link class="study-back" to="/">返回首页</router-link>
      <h1 class="study-heading">学习笔记</h1>
      <p class="study-lead">记录一些学习笔记日常。</p>
      <div v-if="notes.length" class="study-list">
        <router-link
          v-for="note in notes"
          :key="note.slug"
          class="study-card"
          :to="`/study/${note.slug}`"
        >
          <div class="study-card-title">{{ note.title }}</div>
          <div class="study-card-meta">{{ note.date }}</div>
          <div class="study-tags">
            <span v-for="tag in note.tags" :key="tag" class="study-tag">{{ tag }}</span>
          </div>
          <p class="study-card-summary">{{ note.summary }}</p>
        </router-link>
      </div>
      <p v-else class="study-empty">还没有笔记。</p>
    </div>
  </main>
</template>
