<template>
  <AdminLayout>
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Study Materials</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse categories and access study materials</p>
        </div>
        <router-link
          to="/kuppi-sessions/study-materials/upload"
          class="inline-flex items-center px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Upload Material
        </router-link>
      </div>

      <div v-if="isLoading || categories.length === 0" class="flex justify-center items-center h-64">
        <svg class="animate-spin w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="(cat, idx) in categories"
          :key="idx"
          :to="`/kuppi-sessions/study-materials/${cat.toLowerCase().replace(/\\s+/g, '-')}`"
          class="group rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ cat }}</h3>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-brand-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ getMaterialCount(cat) }} materials</p>
        </router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useStudyMaterialsStore } from "@/store/studyMaterials";

const store = useStudyMaterialsStore();
const { categories, materials, loading, fetchCategories, fetchMaterials } = store;
const isLoading = ref(true);

const getMaterialCount = (category: string) => {
  return materials.value.filter(m => m.category === category).length;
};

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([fetchCategories(), fetchMaterials()]);
  isLoading.value = false;
});
</script>
