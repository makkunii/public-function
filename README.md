# Public Function Frontend

This repository contains the frontend for the **Public Function** project, a **multi-tenant + RBAC system**, built with **React 19**, **Tailwind CSS**, and **Ant Design**, connecting to the Laravel backend API (`Private Function`).

While this frontend provides a management interface, the API can also be used independently to implement a custom RBAC system.

---

## 🛠️ Technology Stack

- React 19.x
    
- Tailwind CSS 4.x
    
- Ant Design 5.x
    
- React Router v7
    
- Redux Toolkit
    
- Axios (for API requests)
    
- Vite (development/build tool)
    
- ESLint (linting)
    
- PostCSS + Autoprefixer
    

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/public_function.git
cd public_function
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root with the backend API URL:

```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Start development server

```bash
npm run dev
```

The app will run at `http://localhost:5173` (or as shown in terminal).

---

## 🌐 Multi-Tenant + RBAC Features

- Supports multiple tenants with role-based access control.
    
- Roles and permissions are assigned per tenant.
    
- Users can belong to multiple tenants.
    
- Permissions control access to frontend pages/components.
    
- Integrates seamlessly with Laravel backend (`Private Function`) for auth and RBAC.
    
---

## ⚙️ Scripts

|Command|Description|
|---|---|
|`npm run dev`|Start development server|
|`npm run build`|Build production-ready app|
|`npm run preview`|Preview production build|
|`npm run lint`|Lint the project files|

---

## 🌐 API Integration

- The frontend communicates with the Laravel backend (`Private Function`) via Axios.
    
- Example Axios setup:
    

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export default api;
```

- All protected routes require a Bearer token.
    
---

## 📦 Deployment

- Build the production app:
    

```bash
npm run build
```

- Deploy `dist/` folder to preferred hosting (Netlify, Vercel, AWS S3, etc.)
    

---

## 🤝 Contributing

1. Fork the repository
    
2. Create a branch (`git checkout -b feature/my-feature`)
    
3. Commit changes (`git commit -am 'Add new feature'`)
    
4. Push to branch (`git push origin feature/my-feature`)
    
5. Open a Pull Request
    

---

## 📞 Contact

For questions or support, contact **makkunii** at `mmanuel.eugene@gmail.com`.
