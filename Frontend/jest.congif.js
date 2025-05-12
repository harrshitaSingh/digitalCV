module.exports = {
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
};
  