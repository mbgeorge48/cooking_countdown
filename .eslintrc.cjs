module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "react-app",
        "react-app/jest",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs", "jest.config.ts"],
    parser: "@typescript-eslint/parser",
    plugins: ["react"],
    extends: ["eslint:recommended", "plugin:react/recommended"],
    rules: {
        "react/react-in-jsx-scope": 0,
        "react/jsx-uses-react": 0,
        "react/no-unescaped-entities": 0,
        "no-undef": 0,
    },
    overrides: [
        {
            files: ["**/__helpers__/**", "**/*.test.*"],
            env: {
                jest: true,
            },
        },
    ],
};
