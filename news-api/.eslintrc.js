const path = require('path');

module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": [path.resolve(__dirname, "./tsconfig.json")],
        "tsconfigRootDir": __dirname,
        "ecmaVersion": 2020,
        "sourceType": "module"
    },
    "plugins": ["@typescript-eslint", "prettier"],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended"
    ],
    "rules": {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/strict-boolean-expressions": "error",
        "prettier/prettier": "error"
    },
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    ignorePatterns: ['node_modules/', 'dist/']
};