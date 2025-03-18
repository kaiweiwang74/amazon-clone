# 使用 Node.js 18 作為基礎映像
FROM node:18

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json，並安裝依賴
COPY package.json package-lock.json ./
RUN npm install

# 複製所有 TypeScript 原始碼
COPY . .

# 先編譯 TypeScript
RUN npm run build

# 伺服器開啟的 port
EXPOSE 4000

# 啟動應用程式 (執行編譯後的 server.js)
CMD ["node", "dist/server.js"]
