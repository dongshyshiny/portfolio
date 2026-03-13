# Deploy Portfolio lên GitHub Pages

## 1. Cài package hỗ trợ deploy

```bash
npm install --save-dev gh-pages --legacy-peer-deps
```

## 2. Thêm config vào `package.json`

Thêm `homepage` ở đầu file:

```json
{
  "homepage": "https://dongnvinfoplus.github.io/react-test-example",
  ...
}
```

Thêm 2 scripts vào `"scripts"`:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  ...
}
```

## 3. Deploy

```bash
npm run deploy
```

Lệnh này sẽ tự động:
- Build project thành production
- Push thư mục `build/` lên branch `gh-pages`

## 4. Bật GitHub Pages

1. Vào repo: https://github.com/dongnvinfoplus/react-test-example
2. **Settings** > **Pages**
3. Source: chọn branch `gh-pages`, folder `/ (root)`
4. Click **Save**

Sau 1-2 phút, trang sẽ live tại:

```
https://dongnvinfoplus.github.io/react-test-example
```

## 5. Cập nhật sau khi thay đổi code

Mỗi lần sửa code xong, chỉ cần chạy lại:

```bash
npm run deploy
```

---

## Deploy lên Vercel (tuỳ chọn - nhanh hơn)

1. Vào https://vercel.com và đăng nhập bằng GitHub
2. Click **Add New Project**
3. Import repo `react-test-example`
4. Framework: chọn **Create React App**
5. Click **Deploy**

Vercel sẽ tự deploy mỗi khi push code lên GitHub.

---

## Deploy lên Netlify (tuỳ chọn)

1. Vào https://netlify.com và đăng nhập bằng GitHub
2. Click **Add new site** > **Import an existing project**
3. Chọn repo `react-test-example`
4. Build command: `npm run build`
5. Publish directory: `build`
6. Click **Deploy site**
