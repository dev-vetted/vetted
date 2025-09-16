// Learn more: https://docs.expo.dev/guides/monorepos/#metro-config
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/** @type {import('metro-config').ConfigT} */
const config = getDefaultConfig(projectRoot);

// Watch the monorepo root
config.watchFolders = [workspaceRoot];

// Resolve modules from the project and the workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Ensure Metro doesn't fall back to other node_modules
config.resolver.disableHierarchicalLookup = true;

// Enable PNPM symlink resolution
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require', 'node'];

module.exports = config;


