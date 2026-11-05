// Jest runs outside Next's `react-server` condition, where `server-only` throws by design.
// This mock keeps the marker in application code without breaking unit tests.
module.exports = {};
