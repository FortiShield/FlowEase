<template>
	<div
		:class="$style.wrapper"
		:style="iconStyleData"
		@click="(e) => $emit('click')"
		@mouseover="showTooltip = true"
		@mouseleave="showTooltip = false"
	>
		<div :class="$style.tooltip">
			<flowease-tooltip placement="top" :visible="showTooltip">
				<template #content>
					<div v-text="nodeType.displayName"></div>
				</template>
				<span />
			</flowease-tooltip>
		</div>
		<div v-if="nodeIconData !== null" :class="$style.icon" title="">
			<div :class="$style.iconWrapper" :style="iconStyleData">
				<div v-if="nodeIconData !== null" :class="$style.icon">
					<img
						v-if="nodeIconData.type === 'file'"
						:src="nodeIconData.fileBuffer || nodeIconData.path"
						:style="imageStyleData"
					/>
					<font-awesome-icon
						v-else
						:icon="nodeIconData.icon || nodeIconData.path"
						:style="fontStyleData"
					/>
				</div>
				<div v-else class="node-icon-placeholder">
					{{ nodeType !== null ? nodeType.displayName.charAt(0) : '?' }}
				</div>
			</div>
		</div>
		<div v-else :class="$style.placeholder">
			{{ nodeType !== null ? nodeType.displayName.charAt(0) : '?' }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ITemplatesNode } from '@/Interface';
import type { INodeTypeDescription } from 'flowease-workflow';
import { mapStores } from 'pinia';
import { useRootStore } from '@/stores/floweaseRoot.store';

interface NodeIconData {
	type: string;
	path?: string;
	fileExtension?: string;
	fileBuffer?: string;
}

export default defineComponent({
	name: 'HoverableNodeIcon',
	props: {
		circle: {
			type: Boolean,
			default: false,
		},
		clickButton: {
			type: Function,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		nodeType: {
			type: Object,
		},
		size: {
			type: Number,
		},
	},
	computed: {
		...mapStores(useRootStore),
		fontStyleData(): object {
			return {
				'max-width': this.size + 'px',
			};
		},
		iconStyleData(): object {
			const nodeType = this.nodeType as ITemplatesNode | null;
			const color = nodeType ? nodeType.defaults && nodeType.defaults.color : '';
			if (!this.size) {
				return { color };
			}

			return {
				color,
				width: this.size + 'px',
				height: this.size + 'px',
				'font-size': this.size + 'px',
				'line-height': this.size + 'px',
				'border-radius': this.circle ? '50%' : '2px',
				...(this.disabled && {
					color: 'var(--color-text-light)',
					'-webkit-filter': 'contrast(40%) brightness(1.5) grayscale(100%)',
					filter: 'contrast(40%) brightness(1.5) grayscale(100%)',
				}),
			};
		},
		imageStyleData(): object {
			return {
				width: '100%',
				'max-width': '100%',
				'max-height': '100%',
			};
		},
		nodeIconData(): null | NodeIconData {
			const nodeType = this.nodeType as INodeTypeDescription | ITemplatesNode | null;
			if (nodeType === null) {
				return null;
			}

			if ((nodeType as ITemplatesNode).iconData) {
				return (nodeType as ITemplatesNode).iconData;
			}

			const restUrl = this.rootStore.getRestUrl;

			if (nodeType.icon) {
				const [type, path] = nodeType.icon.split(':');
				const returnData: NodeIconData = {
					type,
					path,
				};

				if (type === 'file') {
					returnData.path = restUrl + '/node-icon/' + nodeType.name;
					returnData.fileExtension = path.split('.').slice(-1).join();
				}

				return returnData;
			}
			return null;
		},
	},
	data() {
		return {
			showTooltip: false,
		};
	},
});
</script>

<style lang="scss" module>
.wrapper {
	cursor: pointer;
	z-index: 2000;
}

.icon {
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.iconWrapper {
	svg {
		height: 100%;
		width: 100%;
	}
}

.placeholder {
	text-align: center;
}

.tooltip {
	left: 10px;
	position: relative;
	z-index: 9999;
}
</style>
