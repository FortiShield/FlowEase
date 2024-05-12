const sharedOptions = require('@flowease/eslint-config/shared');

/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	extends: ['@flowease/eslint-config/node'],

	...sharedOptions(__dirname),

	ignorePatterns: ['index.js'],

	rules: {
		// TODO: remove all the following rules
		eqeqeq: 'warn',
		'id-denylist': 'warn',
		'import/extensions': 'warn',
		'import/order': 'warn',
		'prefer-spread': 'warn',
		'import/no-extraneous-dependencies': 'warn',

		'@typescript-eslint/naming-convention': ['error', { selector: 'memberLike', format: null }],
		'@typescript-eslint/no-explicit-any': 'warn', //812 warnings, better to fix in separate PR
		'@typescript-eslint/no-non-null-assertion': 'warn', //665 errors, better to fix in separate PR
		'@typescript-eslint/no-unsafe-assignment': 'warn', //7084 problems, better to fix in separate PR
		'@typescript-eslint/no-unsafe-call': 'warn', //541 errors, better to fix in separate PR
		'@typescript-eslint/no-unsafe-member-access': 'warn', //4591 errors, better to fix in separate PR
		'@typescript-eslint/no-unsafe-return': 'warn', //438 errors, better to fix in separate PR
		'@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
		'@typescript-eslint/restrict-template-expressions': 'warn', //1152 errors, better to fix in separate PR
		'@typescript-eslint/unbound-method': 'warn',
		'@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': true }],
		'@typescript-eslint/prefer-nullish-coalescing': 'warn',
		'@typescript-eslint/no-base-to-string': 'warn',
		'@typescript-eslint/no-redundant-type-constituents': 'warn',
		'@typescript-eslint/no-unsafe-argument': 'warn',
		'@typescript-eslint/prefer-optional-chain': 'warn',
		'@typescript-eslint/restrict-plus-operands': 'warn',
	},

	overrides: [
		{
			files: ['./credentials/*.ts'],
			plugins: ['eslint-plugin-flowease-nodes-base'],
			rules: {
				'flowease-nodes-base/cred-class-field-authenticate-type-assertion': 'error',
				'flowease-nodes-base/cred-class-field-display-name-missing-oauth2': 'error',
				'flowease-nodes-base/cred-class-field-display-name-miscased': 'error',
				'flowease-nodes-base/cred-class-field-documentation-url-missing': 'error',
				'flowease-nodes-base/cred-class-field-name-missing-oauth2': 'error',
				'flowease-nodes-base/cred-class-field-name-unsuffixed': 'error',
				'flowease-nodes-base/cred-class-field-name-uppercase-first-char': 'error',
				'flowease-nodes-base/cred-class-field-properties-assertion': 'error',
				'flowease-nodes-base/cred-class-field-type-options-password-missing': 'error',
				'flowease-nodes-base/cred-class-name-missing-oauth2-suffix': 'error',
				'flowease-nodes-base/cred-class-name-unsuffixed': 'error',
				'flowease-nodes-base/cred-filename-against-convention': 'error',
			},
		},
		{
			files: ['./nodes/**/*.ts'],
			plugins: ['eslint-plugin-flowease-nodes-base'],
			rules: {
				'flowease-nodes-base/node-class-description-credentials-name-unsuffixed': 'error',
				'flowease-nodes-base/node-class-description-display-name-unsuffixed-trigger-node': 'error',
				'flowease-nodes-base/node-class-description-empty-string': 'error',
				'flowease-nodes-base/node-class-description-icon-not-svg': 'error',
				'flowease-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
				'flowease-nodes-base/node-class-description-inputs-wrong-trigger-node': 'error',
				'flowease-nodes-base/node-class-description-missing-subtitle': 'error',
				'flowease-nodes-base/node-class-description-non-core-color-present': 'error',
				'flowease-nodes-base/node-class-description-name-miscased': 'error',
				'flowease-nodes-base/node-class-description-name-unsuffixed-trigger-node': 'error',
				'flowease-nodes-base/node-class-description-outputs-wrong': 'error',
				'flowease-nodes-base/node-dirname-against-convention': 'error',
				'flowease-nodes-base/node-execute-block-double-assertion-for-items': 'error',
				'flowease-nodes-base/node-execute-block-wrong-error-thrown': 'error',
				'flowease-nodes-base/node-filename-against-convention': 'error',
				'flowease-nodes-base/node-param-array-type-assertion': 'error',
				'flowease-nodes-base/node-param-collection-type-unsorted-items': 'error',
				'flowease-nodes-base/node-param-color-type-unused': 'error',
				'flowease-nodes-base/node-param-default-missing': 'error',
				'flowease-nodes-base/node-param-default-wrong-for-boolean': 'error',
				'flowease-nodes-base/node-param-default-wrong-for-collection': 'error',
				'flowease-nodes-base/node-param-default-wrong-for-fixed-collection': 'error',
				'flowease-nodes-base/node-param-default-wrong-for-fixed-collection': 'error',
				'flowease-nodes-base/node-param-default-wrong-for-multi-options': 'error',
				'flowease-nodes-base/node-param-default-wrong-for-number': 'error',
				'flowease-nodes-base/node-param-default-wrong-for-simplify': 'error',
				'flowease-nodes-base/node-param-default-wrong-for-string': 'error',
				'flowease-nodes-base/node-param-description-boolean-without-whether': 'error',
				'flowease-nodes-base/node-param-description-comma-separated-hyphen': 'error',
				'flowease-nodes-base/node-param-description-empty-string': 'error',
				'flowease-nodes-base/node-param-description-excess-final-period': 'error',
				'flowease-nodes-base/node-param-description-excess-inner-whitespace': 'error',
				'flowease-nodes-base/node-param-description-identical-to-display-name': 'error',
				'flowease-nodes-base/node-param-description-line-break-html-tag': 'error',
				'flowease-nodes-base/node-param-description-lowercase-first-char': 'error',
				'flowease-nodes-base/node-param-description-miscased-id': 'error',
				'flowease-nodes-base/node-param-description-miscased-json': 'error',
				'flowease-nodes-base/node-param-description-miscased-url': 'error',
				'flowease-nodes-base/node-param-description-missing-final-period': 'error',
				'flowease-nodes-base/node-param-description-missing-for-ignore-ssl-issues': 'error',
				'flowease-nodes-base/node-param-description-missing-for-return-all': 'error',
				'flowease-nodes-base/node-param-description-missing-for-simplify': 'error',
				'flowease-nodes-base/node-param-description-missing-from-dynamic-multi-options': 'error',
				'flowease-nodes-base/node-param-description-missing-from-dynamic-options': 'error',
				'flowease-nodes-base/node-param-description-missing-from-limit': 'error',
				'flowease-nodes-base/node-param-description-unencoded-angle-brackets': 'error',
				'flowease-nodes-base/node-param-description-unneeded-backticks': 'error',
				'flowease-nodes-base/node-param-description-untrimmed': 'error',
				'flowease-nodes-base/node-param-description-url-missing-protocol': 'error',
				'flowease-nodes-base/node-param-description-weak': 'error',
				'flowease-nodes-base/node-param-description-wrong-for-dynamic-multi-options': 'error',
				'flowease-nodes-base/node-param-description-wrong-for-dynamic-options': 'error',
				'flowease-nodes-base/node-param-description-wrong-for-ignore-ssl-issues': 'error',
				'flowease-nodes-base/node-param-description-wrong-for-limit': 'error',
				'flowease-nodes-base/node-param-description-wrong-for-return-all': 'error',
				'flowease-nodes-base/node-param-description-wrong-for-simplify': 'error',
				'flowease-nodes-base/node-param-description-wrong-for-upsert': 'error',
				'flowease-nodes-base/node-param-display-name-excess-inner-whitespace': 'error',
				'flowease-nodes-base/node-param-display-name-miscased-id': 'error',
				'flowease-nodes-base/node-param-display-name-miscased': 'error',
				'flowease-nodes-base/node-param-display-name-not-first-position': 'error',
				'flowease-nodes-base/node-param-display-name-untrimmed': 'error',
				'flowease-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options': 'error',
				'flowease-nodes-base/node-param-display-name-wrong-for-dynamic-options': 'error',
				'flowease-nodes-base/node-param-display-name-wrong-for-simplify': 'error',
				'flowease-nodes-base/node-param-display-name-wrong-for-update-fields': 'error',
				'flowease-nodes-base/node-param-min-value-wrong-for-limit': 'error',
				'flowease-nodes-base/node-param-multi-options-type-unsorted-items': 'error',
				'flowease-nodes-base/node-param-name-untrimmed': 'error',
				'flowease-nodes-base/node-param-operation-option-action-wrong-for-get-many': 'error',
				'flowease-nodes-base/node-param-operation-option-description-wrong-for-get-many': 'error',
				'flowease-nodes-base/node-param-operation-option-without-action': 'error',
				'flowease-nodes-base/node-param-operation-without-no-data-expression': 'error',
				'flowease-nodes-base/node-param-option-description-identical-to-name': 'error',
				'flowease-nodes-base/node-param-option-name-containing-star': 'error',
				'flowease-nodes-base/node-param-option-name-duplicate': 'error',
				'flowease-nodes-base/node-param-option-name-wrong-for-get-many': 'error',
				'flowease-nodes-base/node-param-option-name-wrong-for-upsert': 'error',
				'flowease-nodes-base/node-param-option-value-duplicate': 'error',
				'flowease-nodes-base/node-param-options-type-unsorted-items': 'error',
				'flowease-nodes-base/node-param-placeholder-miscased-id': 'error',
				'flowease-nodes-base/node-param-placeholder-missing-email': 'error',
				'flowease-nodes-base/node-param-required-false': 'error',
				'flowease-nodes-base/node-param-resource-with-plural-option': 'error',
				'flowease-nodes-base/node-param-resource-without-no-data-expression': 'error',
				'flowease-nodes-base/node-param-type-options-missing-from-limit': 'error',
				'flowease-nodes-base/node-param-type-options-password-missing': 'error',
			},
		},
		{
			files: ['**/*.test.ts', '**/test/**/*.ts'],
			rules: {
				'import/no-extraneous-dependencies': 'off',
			},
		},
	],
};
