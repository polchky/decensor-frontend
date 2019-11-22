module.exports = {
    plugins: [
        'vuetify',
    ],
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'plugin:vue/recommended',
    ],
    rules: {
        'no-underscore-dangle': [
            'error', {
                allow: ['_id'],
            },
        ],
        'arrow-parens': [
            'error',
            'always',
        ],
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        'import/no-unresolved': [
            'off',
        ],
        indent: [
            'error',
            4,
        ],
        'vue/html-indent': [
            'error',
            4,
        ],
        'no-param-reassign': [
            2,
            {
                props: false,
            },
        ],
        'vuetify/no-deprecated-classes': 'error',
        'vuetify/grid-unknown-attributes': 'error',
        'vuetify/no-legacy-grid': 'error',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
