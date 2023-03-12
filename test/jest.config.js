const path = require("path");
module.exports = {
    preset: "ts-jest",
    // verbose: true,
    globals: {
        "ts-jest": {
            tsConfig: "<rootDir>/tsconfig.json",
            importHelpers: true
        },
        "process.env.TARO_ENV": process.env.TARO_ENV,
    },
    testEnvironment: "jsdom",
    rootDir: path.resolve(__dirname, "../"),
    testMatch: [
        "<rootDir>/src/**/*.spec.js",
        "<rootDir>/test/**/*.spec.js",
        "<rootDir>/test/**/*.spec.jsx",
    ],
    moduleNameMapper: {
        '@tarojs/taro': '<rootDir>/test/mocks/taro-mock.js',
        '@tarojs/components': '@tarojs/components/dist-h5/react',
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/test/mocks/empty-mock.js",
        "\\.(css|less|scss)$": "<rootDir>/test/mocks/empty-mock.js",
        '@/components/Recommend': '<rootDir>/src/components/Recommend/index.h5.tsx',
        '@/utils/Cookie': '<rootDir>/src/utils/Cookie/index.h5.js',
        '@/utils/GetQuery': '<rootDir>/src/utils/GetQuery/index.h5.ts',
        '@/utils/Track': '<rootDir>/test/mocks/track-mock.js',
        '@legos/js-security-v3/dist': '<rootDir>/test/mocks/empty-mock.js',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
    },
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!((@tarojs)|(@base)|(@legos/fingerprint))/)',
    ],
    snapshotSerializers: ["enzyme-to-json/serializer"],
    setupFilesAfterEnv: ["<rootDir>/test/setup"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testPathIgnorePatterns: [
        "/node_modules",
        // "test/components/Dialog.spec.js*",
    ],
    collectCoverage: true,
    coverageDirectory: "<rootDir>/test/coverage",
    collectCoverageFrom: [
        "<rootDir>/src/**/*.[jt]s?(x)",
        "!src/pages/**/index.config.ts",
        "!src/common/js/reports/ea-points/*.h5.ts",
        "!src/pages/couponList/**",
        // "!src/utils/Track/**", // 后续安排
        // "!src/utils/Base64/**",
        "!src/utils/QrCode/**",
    ],
    coveragePathIgnorePatterns: [
        '.*-mock\..*',
    ],
    // "coverageThreshold": {
    //     "global": {
    //         "branches": 50,
    //         "functions": 50,
    //         "lines": 50,
    //         "statements": 50
    //       },
    //       "./src/components/": {
    //         "branches": 40,
    //         "statements": 40
    //       },
    //       "./src/reducers/**/*.js": {
    //         "statements": 90
    //       },
    //       "./src/utils/VersionCompare": {
    //         "branches": 100,
    //         "functions": 100,
    //         "lines": 100,
    //         "statements": 100
    //       }
    // },
    testResultsProcessor: "jest-bamboo-reporter",
    reporters: [
        "default",
        [
            "./node_modules/jest-html-reporter",
            {
                pageTitle: "Test Report",
                outputPath: "./test/report/test-report.html"
            }
        ],
        ["jest-html-reporters", {
            "publicPath": "./test/report",
            "filename": "jest_html_reporters.html",
            // "openReport": true
        }]
    ]
};
