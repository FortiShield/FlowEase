const sharedOptions = require('@flowease/eslint-config/shared');

/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	extends: ['@flowease/eslint-config/base'],

	...sharedOptions(__dirname),

	rules: {
		complexity: 'error',

		// TODO: remove these
		'import/order': 'off',
		'@typescript-eslint/no-base-to-string': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-redundant-type-constituents': 'warn',
		'@typescript-eslint/prefer-nullish-coalescing': 'warn',
		'@typescript-eslint/prefer-optional-chain': 'warn',
		/**
		 * https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/return-await.md
		 */
		'@typescript-eslint/return-await': ['error', 'always'],
	},
};
