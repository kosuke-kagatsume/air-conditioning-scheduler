module.exports = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
};