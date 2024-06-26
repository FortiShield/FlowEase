<script lang="ts" setup>
import type { ComponentPublicInstance, PropType } from 'vue';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import type { EnvironmentVariable, Rule, RuleGroup } from '@/Interface';
import { useI18n } from '@/composables/useI18n';
import { useToast } from '@/composables/useToast';
import { useClipboard } from '@/composables/useClipboard';
import { EnterpriseEditionFeature } from '@/constants';
import { useSettingsStore } from '@/stores/settings.store';
import { useUsersStore } from '@/stores/users.store';
import { getVariablesPermissions } from '@/permissions';

const i18n = useI18n();
const clipboard = useClipboard();
const { showMessage } = useToast();
const settingsStore = useSettingsStore();
const usersStore = useUsersStore();

const emit = defineEmits(['save', 'cancel', 'edit', 'delete']);

const props = defineProps({
	data: {
		type: Object as PropType<EnvironmentVariable>,
		default: () => ({}),
	},
	editing: {
		type: Boolean,
		default: false,
	},
});

const permissions = getVariablesPermissions(usersStore.currentUser);
const modelValue = ref<EnvironmentVariable>({ ...props.data });

const formValidationStatus = ref<Record<string, boolean>>({
	key: false,
	value: false,
});
const formValid = computed(() => {
	return formValidationStatus.value.key && formValidationStatus.value.value;
});

const keyInputRef = ref<ComponentPublicInstance & { inputRef?: HTMLElement }>();
const valueInputRef = ref<HTMLElement>();

const usage = ref(`$vars.${props.data.key}`);

const isFeatureEnabled = computed(() =>
	settingsStore.isEnterpriseFeatureEnabled(EnterpriseEditionFeature.Variables),
);

const showActions = computed(
	() => isFeatureEnabled.value && (permissions.edit || permissions.delete),
);

onMounted(() => {
	focusFirstInput();
});

const keyValidationRules: Array<Rule | RuleGroup> = [
	{ name: 'REQUIRED' },
	{ name: 'MAX_LENGTH', config: { maximum: 50 } },
	{
		name: 'MATCH_REGEX',
		config: {
			regex: /^[a-zA-Z]/,
			message: i18n.baseText('variables.editing.key.error.startsWithLetter'),
		},
	},
	{
		name: 'MATCH_REGEX',
		config: {
			regex: /^[a-zA-Z][a-zA-Z0-9_]*$/,
			message: i18n.baseText('variables.editing.key.error.jsonKey'),
		},
	},
];

const valueValidationRules: Array<Rule | RuleGroup> = [
	{ name: 'MAX_LENGTH', config: { maximum: 220 } },
];

watch(
	() => modelValue.value.key,
	async () => {
		await nextTick();
		if (formValidationStatus.value.key) {
			updateUsageSyntax();
		}
	},
);

function updateUsageSyntax() {
	usage.value = `$vars.${modelValue.value.key || props.data.key}`;
}

async function onCancel() {
	modelValue.value = { ...props.data };
	emit('cancel', modelValue.value);
}

async function onSave() {
	emit('save', modelValue.value);
}

async function onEdit() {
	emit('edit', modelValue.value);

	await nextTick();

	focusFirstInput();
}

async function onDelete() {
	emit('delete', modelValue.value);
}

function onValidate(key: string, value: boolean) {
	formValidationStatus.value[key] = value;
}

function onUsageClick() {
	void clipboard.copy(usage.value);
	showMessage({
		title: i18n.baseText('variables.row.usage.copiedToClipboard'),
		type: 'success',
	});
}

function focusFirstInput() {
	keyInputRef.value?.inputRef?.focus?.();
}
</script>

<template>
	<tr :class="$style.variablesRow" data-test-id="variables-row">
		<td class="variables-key-column">
			<div>
				<span v-if="!editing">{{ data.key }}</span>
				<flowease-form-input
					v-else
					ref="keyInputRef"
					v-model="modelValue.key"
					label
					name="key"
					data-test-id="variable-row-key-input"
					:placeholder="i18n.baseText('variables.editing.key.placeholder')"
					required
					validate-on-blur
					:validation-rules="keyValidationRules"
					@validate="(value) => onValidate('key', value)"
				/>
			</div>
		</td>
		<td class="variables-value-column">
			<div>
				<span v-if="!editing">{{ data.value }}</span>
				<flowease-form-input
					v-else
					ref="valueInputRef"
					v-model="modelValue.value"
					label
					name="value"
					data-test-id="variable-row-value-input"
					:placeholder="i18n.baseText('variables.editing.value.placeholder')"
					validate-on-blur
					:validation-rules="valueValidationRules"
					@validate="(value) => onValidate('value', value)"
				/>
			</div>
		</td>
		<td class="variables-usage-column">
			<div>
				<flowease-tooltip placement="top">
					<span v-if="modelValue.key && usage" :class="$style.usageSyntax" @click="onUsageClick">{{
						usage
					}}</span>
					<template #content>
						{{ i18n.baseText('variables.row.usage.copyToClipboard') }}
					</template>
				</flowease-tooltip>
			</div>
		</td>
		<td v-if="isFeatureEnabled">
			<div v-if="editing" :class="$style.buttons">
				<flowease-button
					data-test-id="variable-row-cancel-button"
					type="tertiary"
					class="mr-xs"
					@click="onCancel"
				>
					{{ i18n.baseText('variables.row.button.cancel') }}
				</flowease-button>
				<flowease-button
					data-test-id="variable-row-save-button"
					:disabled="!formValid"
					type="primary"
					@click="onSave"
				>
					{{ i18n.baseText('variables.row.button.save') }}
				</flowease-button>
			</div>
			<div v-else :class="[$style.buttons, $style.hoverButtons]">
				<flowease-tooltip :disabled="permissions.edit" placement="top">
					<div>
						<flowease-button
							data-test-id="variable-row-edit-button"
							type="tertiary"
							class="mr-xs"
							:disabled="!permissions.edit"
							@click="onEdit"
						>
							{{ i18n.baseText('variables.row.button.edit') }}
						</flowease-button>
					</div>
					<template #content>
						{{ i18n.baseText('variables.row.button.edit.onlyOwnerCanSave') }}
					</template>
				</flowease-tooltip>
				<flowease-tooltip :disabled="permissions.delete" placement="top">
					<div>
						<flowease-button
							data-test-id="variable-row-delete-button"
							type="tertiary"
							:disabled="!permissions.delete"
							@click="onDelete"
						>
							{{ i18n.baseText('variables.row.button.delete') }}
						</flowease-button>
					</div>
					<template #content>
						{{ i18n.baseText('variables.row.button.delete.onlyOwnerCanDelete') }}
					</template>
				</flowease-tooltip>
			</div>
		</td>
	</tr>
</template>

<style lang="scss" module>
.variablesRow {
	&:hover {
		.hoverButtons {
			opacity: 1;
		}
	}

	td {
		> div {
			display: flex;
			align-items: center;
			min-height: 40px;
		}
	}
}

.buttons {
	display: flex;
	flex-wrap: nowrap;
	justify-content: flex-end;
}

.hoverButtons {
	opacity: 0;
	transition: opacity 0.2s ease;
}

.usageSyntax {
	cursor: pointer;
	background: var(--color-variables-usage-syntax-bg);
	color: var(--color-variables-usage-font);
	font-family: var(--font-family-monospace);
	font-size: var(--font-size-s);
}
</style>
