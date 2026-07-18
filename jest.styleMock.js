/**
 * Fallback CSS-module identity mock when identity-obj-proxy is unavailable.
 * Prefer `identity-obj-proxy` via jest.config moduleNameMapper.
 */
const styles = new Proxy(
  {},
  {
    get: (_target, key) => (typeof key === 'string' ? key : undefined),
  },
);

module.exports = {
  __esModule: true,
  default: styles,
  ...styles,
};
