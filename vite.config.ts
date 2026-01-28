import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 项目页需要设置 base 为 "/<repo>/"
// 这里假设你新的仓库名为 "AirCourse"
const REPO_NAME = "AirCourse";
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

export default defineConfig(() => {
  return {
    base: isGithubActions ? `/${REPO_NAME}/` : "/",
    server: {
      port: 3000,
      host: "0.0.0.0"
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, ".")
      }
    }
  };
});
