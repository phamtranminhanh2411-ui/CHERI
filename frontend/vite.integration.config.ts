import { defineConfig, mergeConfig, type ConfigEnv, type UserConfig } from "vite";
import sourceConfig from "./vite.config";

export default defineConfig((env) => {
  const createSourceConfig = sourceConfig as (configEnv: ConfigEnv) => UserConfig;

  return mergeConfig(createSourceConfig(env), {
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    preview: {
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  });
});
