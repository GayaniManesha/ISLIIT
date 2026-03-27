<template>
  <AdminLayout>
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <router-link
            to="/kuppi-sessions/study-materials"
            class="inline-flex items-center px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </router-link>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCategoryName(categorySlug) }}</h1>
        </div>
        <router-link
          :to="`/kuppi-sessions/study-materials/upload?category=${encodeURIComponent(categoryName)}`"
          class="inline-flex items-center px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Upload {{ formatCategoryName(categorySlug) }}
        </router-link>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-64">
        <svg class="animate-spin w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>

      <div v-else-if="materials.length === 0" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">No materials in this category yet.</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
        <div
          v-for="material in materials"
          :key="material._id"
          class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-md transition-all"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ material.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ material.description }}</p>
          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <span>{{ formatDate(material.createdAt) }}</span>
            <span>•</span>
            <span>{{ material.fileName }}</span>
          </div>
          <div class="flex gap-2">
            <a
              :href="`${apiUrl}/api/study-materials/download/${material._id}`"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useStudyMaterialsStore } from "@/store/studyMaterials";

const route = useRoute();
const store = useStudyMaterialsStore();
const { materials, loading, fetchMaterialsByCategory } = store;
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const categorySlug = route.params.category as string;

const categoryName = computed(() => {
  return formatCategoryName(categorySlug);
});

const formatCategoryName = (slug: string) => {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

onMounted(async () => {
  await fetchMaterialsByCategory(categoryName.value);
});
</script>
