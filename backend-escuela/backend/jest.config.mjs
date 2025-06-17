export default {
  transform: {
    '^.+\\.m?[tj]sx?$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'mjs', 'cjs'],
  transformIgnorePatterns: [
    '/node_modules/(?!(express-rate-limit|zod|swagger-jsdoc|bcryptjs|@prisma/client)/)',
  ],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.js'],
  testMatch: ['**/test/**/*.test.mjs'],
  rootDir: './test',
  testEnvironmentOptions: {
    envFile: '.env.test',
  },
};
