// @ts-check
import eslint from '@eslint/js'
import tslint from 'typescript-eslint'

export default tslint.config(
	eslint.configs.recommended,
	...tslint.configs.recommended,
	{
		rules: {
	// 		'@typescript-eslint/quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
			'quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }]

		}
	}
)

// export default antfu(
// 	{
// 		typescript: {
// 			tsconfigPath: 'tsconfig.json',
// 		},
// 		// antfu overrides
// 		rules: {
// 			'no-console': 'off',
// 			// 'indent': ['error', 2],
// 			'quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
// 			// 'no-undef': 'off',
// 			'brace-style': '1tbs',
// 			// 'unused-imports/no-unused-vars': 'off',
// 			// 'no-useless-return': 'off',
// 			'style/no-tabs': 'off',
// 			'style/indent': ['error', 'tab'],
// 			'jsonc/indent': ['error', 'tab'],
// 			'antfu/consistent-list-newline': 'off',
// 		},
// 	}
// )
