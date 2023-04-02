module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['standard-with-typescript', 'prettier'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    rules: {
        indent: ['error', 4],
        'trailing-comma': 'off',
        'comma-dangle': 'off',
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/comma-dangle': 'off',
        'no-new': 'off',
        semi: 'off',
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript/trailing-comma': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/no-useless-constructor': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
    },
};
