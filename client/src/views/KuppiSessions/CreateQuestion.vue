<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <RouterLink to="/kuppi-sessions/qa" class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 mb-4">
            <ChevronRightIcon class="w-5 h-5 rotate-180" />
            Back to Questions
          </RouterLink>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ask a Question</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Provide a clear and detailed question to get better answers
          </p>
        </div>

        <!-- Form -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title Field -->
          <div>
            <label for="title" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Question Title
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="e.g., How to implement authentication in Vue 3?"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': errors.title }"
              @blur="validateField('title')"
            />
            <p v-if="errors.title" class="text-red-600 dark:text-red-400 text-sm mt-1">
              {{ errors.title }}
            </p>
            <p class="text-gray-500 text-sm mt-2">
              {{ formData.title.length }}/200 characters
            </p>
          </div>

          <!-- Description Field -->
          <div>
            <label for="description" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Question Description
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              placeholder="Provide more context and details about your question..."
              rows="8"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              :class="{ 'border-red-500': errors.description }"
              @blur="validateField('description')"
            />
            <p v-if="errors.description" class="text-red-600 dark:text-red-400 text-sm mt-1">
              {{ errors.description }}
            </p>
            <p class="text-gray-500 text-sm mt-2">
              Minimum 20 characters required
            </p>
          </div>

          <!-- Tags Field -->
          <div>
            <label for="tags" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Tags (Optional)
            </label>
            <div class="mb-3">
              <input
                v-model="newTag"
                type="text"
                placeholder="Enter a tag and press Enter (e.g., vue3, authentication)"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                @keydown.enter.prevent="addTag"
              />
            </div>

            <!-- Selected Tags -->
            <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(index)"
                  class="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  ×
                </button>
              </span>
            </div>
            <p class="text-gray-500 text-sm">
              {{ formData.tags.length }}/5 tags (
              <span class="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" @click="suggestTags">
                Popular tags
              </span>
              )
            </p>
          </div>

          <!-- Preview Section -->
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Preview</h3>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ formData.title || 'Your question title will appear here' }}
            </h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {{ formData.description || 'Your question description will appear here' }}
            </p>
            <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="tag in formData.tags"
                :key="tag"
                class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Error Messages -->
          <div v-if="generalError" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {{ generalError }}
          </div>

          <!-- Actions -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <span v-if="!loading">Ask Question</span>
              <span v-else>Publishing...</span>
            </button>
            <RouterLink
              to="/kuppi-sessions/qa"
              class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-center"
            >
              Cancel
            </RouterLink>
          </div>
        </form>
        </div>

        <!-- Tips Section -->
        <div class="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">Tips for asking a good question</h3>
          <ul class="space-y-2 text-blue-800 dark:text-blue-300">
            <li class="flex gap-2">
              <span>•</span>
              <span>Be specific and clear about what you're asking</span>
            </li>
            <li class="flex gap-2">
              <span>•</span>
              <span>Include relevant context and background information</span>
            </li>
            <li class="flex gap-2">
              <span>•</span>
              <span>Add relevant tags to help others find your question</span>
            </li>
            <li class="flex gap-2">
              <span>•</span>
              <span>Check if similar questions have already been asked</span>
            </li>
            <li class="flex gap-2">
              <span>•</span>
              <span>Avoid asking multiple questions at once</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useQAStore } from '@/store/qaStore';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ChevronRightIcon from '@/icons/ChevronRightIcon.vue';

const router = useRouter();
const qaStore = useQAStore();

const loading = ref(false);
const generalError = ref('');
const newTag = ref('');

const formData = reactive({
  title: '',
  description: '',
  tags: [] as string[],
});

const errors = reactive({
  title: '',
  description: '',
});

const popularTags = [
  'vue3',
  'typescript',
  'authentication',
  'database',
  'api',
  'javascript',
  'tailwind',
  'nodejs',
];

const validateField = (field: string) => {
  if (field === 'title') {
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      errors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 200) {
      errors.title = 'Title cannot exceed 200 characters';
    } else {
      errors.title = '';
    }
  } else if (field === 'description') {
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    } else {
      errors.description = '';
    }
  }
};

const validateForm = () => {
  validateField('title');
  validateField('description');
  return !errors.title && !errors.description;
};

const addTag = () => {
  const tag = newTag.value.trim().toLowerCase();
  if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
    formData.tags.push(tag);
    newTag.value = '';
  }
};

const removeTag = (index: number) => {
  formData.tags.splice(index, 1);
};

const suggestTags = () => {
  const available = popularTags.filter((t) => !formData.tags.includes(t));
  if (available.length > 0) {
    formData.tags.push(available[0]);
  }
};

const handleSubmit = async () => {
  generalError.value = '';

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const newQuestion = await qaStore.createQuestion({
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags: formData.tags,
    });

    // Redirect to question detail page
    await router.push(`/kuppi-sessions/qa/${newQuestion._id}`);
  } catch (error: any) {
    generalError.value = error.message || 'Failed to create question. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
