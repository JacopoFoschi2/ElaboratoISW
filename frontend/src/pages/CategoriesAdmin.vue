<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Category {
    categoryId: number;
    categoryName: string;
}

const categories = ref<Category[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const showForm = ref(false);
const isEditing = ref(false);
const selectedCategoryId = ref<number | null>(null);

const form = ref({
    categoryName: '',
});

const fetchCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error();
        categories.value = await res.json();
    } catch {
        error.value = 'Error loading categories';
    } finally {
        loading.value = false;
    }
};

const openCreate = () => {
    showForm.value = true;
    isEditing.value = false;
    selectedCategoryId.value = null;
    form.value = { categoryName: '' };
};

const openEdit = (category: Category) => {
    showForm.value = true;
    isEditing.value = true;
    selectedCategoryId.value = category.categoryId;
    form.value = { categoryName: category.categoryName };
};

const saveCategory = async () => {
    try {
        if (isEditing.value && selectedCategoryId.value === null) {
            console.error('Save failed: missing category id');
            return;
        }

        const url = isEditing.value
            ? `/api/categories/${selectedCategoryId.value}`
            : '/api/categories';

        const method = isEditing.value ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value),
        });

        if (!res.ok) {
            console.error('Save failed with status:', res.status);
            return;
        }

        console.log(
            isEditing.value
                ? 'Category updated successfully'
                : 'Category created successfully'
        );

        showForm.value = false;
        fetchCategories();
    } catch (err) {
        console.error('Error saving category:', err);
    }
};



const deleteCategory = async (categoryId: number) => {
    if (categoryId === null || categoryId === undefined) {
        console.error('Delete failed: missing categoryId');
        return;
    }

    try {
        const res = await fetch(`/api/categories/${categoryId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            console.error('Delete failed with status:', res.status);
            return;
        }

        fetchCategories();
    } catch (err) {
        console.error('Error deleting category:', err);
    }
};


onMounted(fetchCategories);
</script>

<template>
    <div class="categories-admin">
        <div class="header">
            <h1>Categories Admin</h1>
            <button class="primary" @click="openCreate">+ New Category</button>
        </div>

        <div v-if="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <table v-if="categories.length">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="cat in categories" :key="cat.categoryId">
                    <td>{{ cat.categoryName }}</td>
                    <td class="actions">
                        <button @click="openEdit(cat)">Edit</button>
                        <button class="danger" @click="deleteCategory(cat.categoryId)">
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="showForm" class="modal-backdrop">
            <div class="edit-modal">
                <h2>{{ isEditing ? 'Edit Category' : 'New Category' }}</h2>

                <input v-model="form.categoryName" placeholder="Category name" />

                <div class="modal-actions">
                    <button @click="showForm = false">Cancel</button>
                    <button class="primary" @click="saveCategory">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.categories-admin {
    width: 100%;
    color: style-variables.$default-text-color;
}

.loader {
    font-size: 1.9rem;
    margin-bottom: 20px;
    color: style-variables.$default-text-color;
}

.error {
    color: style-variables.$error-color;
    font-size: 1.9rem;
    margin-bottom: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    font-size: 1.7rem;
}

th,
td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid style-variables.$button-and-border-footer-color;
}

.actions {
    display: flex;
    gap: 10px;
}

button {
    padding: 6px 12px;
    border: none;
    cursor: pointer;
}

button.primary {
    background-color: style-variables.$button-and-border-footer-color;
    color: style-variables.$default-text-color;
}

button.danger {
    background-color: #e53935;
    color: style-variables.$default-text-color;
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit-modal {
    background: style-variables.$default-background-color;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 900px;
    max-width: 95vw;
    padding: 32px 40px;
}

.edit-modal input,
.edit-modal textarea {
    width: 100%;
    font-size: 16px;
    padding: 12px 14px;
    margin-bottom: 16px;

    border: none;
    outline: none;
}

.edit-modal textarea {
    min-height: 160px;
    resize: vertical;
}

.edit-modal .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.edit-modal,
.edit-modal * {
    box-sizing: border-box;
}
</style>
