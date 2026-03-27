<template>
  <AdminLayout>
    <div class="p-6">
      <div class="mb-6">
        <router-link
          to="/kuppi-sessions/study-materials"
          class="inline-flex items-center px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 mb-4"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Upload Study Material</h1>
      </div>

      <div class="max-w-2xl mx-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ selectedCategory || "Select a category" }}</p>
            <select
              v-model="form.category"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              required
            >
              <option value="">Select a category</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Material title"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
            <textarea
              v-model="form.description"
              placeholder="Material description"
              rows="4"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File *</label>
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              :class="['border-2 border-dashed rounded-lg p-8 text-center transition-colors', isDragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'border-gray-300 dark:border-gray-600']"
            >
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx"
                @change="handleFileSelect"
              />
              <div v-if="!selectedFile" @click="$refs.fileInput?.click()" class="cursor-pointer">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <p class="text-sm text-gray-600 dark:text-gray-400">Drag and drop or click to select</p>
              </div>
              <div v-else class="space-y-2">
                <p class="text-sm text-gray-900 dark:text-white font-medium">{{ selectedFile.name }}</p>
                <p class="text-xs text-gray-500">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
                <button type="button" @click="selectedFile = null" class="text-xs text-error-600 dark:text-error-400 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="p-4 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-sm">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="p-4 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 text-sm">
            {{ successMessage }}
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="isSubmitting || !authUser.authUser.value"
              :title="!authUser.authUser.value ? 'Please log in to upload' : ''"
              class="flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              {{ isSubmitting ? "Uploading..." : "Upload Material" }}
            </button>
            <router-link
              to="/kuppi-sessions/study-materials"
              class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium transition-colors"
            >
              Cancel
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useStudyMaterialsStore } from "@/store/studyMaterials";
import { useAuthUser } from "@/composables/useAuthUser";

const route = useRoute();
const router = useRouter();
const store = useStudyMaterialsStore();
const { categories, fetchCategories, uploadMaterial } = store;
const authUser = useAuthUser();

const form = ref({
  title: "",
  description: "",
  category: "",
  fileName: "",
  uploadedBy: "",
});

const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const selectedCategory = ref("");

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    selectedFile.value = input.files[0];
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files?.length) {
    selectedFile.value = event.dataTransfer.files[0];
  }
};

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!form.value.title.trim()) {
    errorMessage.value = "Please enter a title";
    return;
  }

  if (!form.value.description.trim()) {
    errorMessage.value = "Please enter a description";
    return;
  }

  if (!form.value.category) {
    errorMessage.value = "Please select a category";
    return;
  }

  if (!selectedFile.value) {
    errorMessage.value = "Please select a file to upload";
    return;
  }

  if (!authUser.authUser.value) {
    errorMessage.value = "You must be logged in to upload materials. Please log in first.";
    return;
  }

  isSubmitting.value = true;

  try {
    // Read file as base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = (e.target?.result as string)?.split(",")[1]; // Remove data URL prefix

      const payload = {
        title: form.value.title,
        description: form.value.description,
        category: form.value.category,
        fileName: selectedFile.value!.name,
        uploadedBy: authUser.authUser.value?.username || authUser.authUser.value?.student_id || "unknown",
        fileContent: fileContent,
      };

      const result = await uploadMaterial(payload);

      if (result) {
        successMessage.value = "Material uploaded successfully!";
        form.value = { title: "", description: "", category: "", fileName: "", uploadedBy: "" };
        selectedFile.value = null;
        setTimeout(() => {
          router.push("/kuppi-sessions/study-materials");
        }, 1500);
      } else {
        errorMessage.value = store.error || "Failed to upload material";
      }

      isSubmitting.value = false;
    };
    reader.readAsDataURL(selectedFile.value);
  } catch (error) {
    errorMessage.value = "Error reading file";
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await fetchCategories();
  const categoryParam = route.query.category as string;
  if (categoryParam) {
    form.value.category = decodeURIComponent(categoryParam);
    selectedCategory.value = form.value.category;
  }

  // Check if user is logged in
  if (!authUser.authUser.value) {
    errorMessage.value = "You must be logged in to upload materials. Please log in first.";
  }
});
</script>
