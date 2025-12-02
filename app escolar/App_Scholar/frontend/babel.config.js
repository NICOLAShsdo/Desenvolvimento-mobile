module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Sem plugins extras – nada de module-resolver aqui
  };
};
