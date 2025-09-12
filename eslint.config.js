// @ts-check
import eslint from '@eslint/js'
import tslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default tslint.config(eslint.configs.recommended, tslint.configs.recommended, prettierConfig, {
	rules: {
		'no-fallthrough': 'off',
	},
})
