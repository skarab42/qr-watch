module.exports = {
  type: "bundle",
  esbuild: {
    define: {
      "process.env.NODE_ENV": `"dev"`,
    },
  },
};
