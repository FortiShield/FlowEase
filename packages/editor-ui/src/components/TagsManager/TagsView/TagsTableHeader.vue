<template>
	<el-row class="tags-header">
		<el-col :span="10">
			<flowease-input
				:placeholder="$locale.baseText('tagsTableHeader.searchTags')"
				:model-value="search"
				:disabled="disabled"
				:maxlength="maxLength"
				clearable
				@update:model-value="onSearchChange"
			>
				<template #prefix>
					<font-awesome-icon icon="search" />
				</template>
			</flowease-input>
		</el-col>
		<el-col :span="14">
			<flowease-button
				:disabled="disabled"
				icon="plus"
				:label="$locale.baseText('tagsTableHeader.addNew')"
				size="large"
				float="right"
				@click="onAddNew"
			/>
		</el-col>
	</el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MAX_TAG_NAME_LENGTH } from '@/constants';

export default defineComponent({
	props: {
		disabled: {
			default: false,
		},
		search: {
			default: '',
		},
	},
	data() {
		return {
			maxLength: MAX_TAG_NAME_LENGTH,
		};
	},
	methods: {
		onAddNew() {
			this.$emit('createEnable');
		},
		onSearchChange(search: string) {
			this.$emit('searchChange', search);
		},
	},
});
</script>

<style lang="scss" scoped>
.tags-header {
	margin-bottom: 15px;
}
</style>
