# 餐厅评分网站 - 7天 Vibe Coding 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 7天内完成全国餐厅评分网站的开发、测试和部署

**Architecture:** React前端 + Node.js/Express后端 + MySQL数据库，Nginx反向代理，高德地图API集成

**Tech Stack:** React 18, React Router v6, Axios, Ant Design, Node.js, Express, Sequelize ORM, MySQL, JWT, Multer, 高德地图JS API

---

## 项目结构

```
restaurant-rating/
├── frontend/                          # React前端
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/                # 通用组件
│   │   │   ├── Header.jsx             # 顶部导航
│   │   │   ├── StarRating.jsx         # 星级评分组件
│   │   │   ├── RestaurantCard.jsx     # 餐厅卡片
│   │   │   └── AMap.jsx               # 高德地图组件
│   │   ├── pages/                     # 页面
│   │   │   ├── Home.jsx               # 首页
│   │   │   ├── RestaurantList.jsx     # 餐厅列表
│   │   │   ├── RestaurantDetail.jsx   # 餐厅详情
│   │   │   ├── Login.jsx              # 登录
│   │   │   ├── Register.jsx           # 注册
│   │   │   ├── Profile.jsx            # 用户中心
│   │   │   └── admin/                 # 管理员页面
│   │   │       ├── ReviewManage.jsx   # 评价管理
│   │   │       ├── RestaurantManage.jsx # 餐厅管理
│   │   │       └── UserManage.jsx     # 用户管理
│   │   ├── services/                  # API调用
│   │   │   ├── api.js                 # Axios实例配置
│   │   │   ├── auth.js                # 认证API
│   │   │   ├── restaurant.js          # 餐厅API
│   │   │   ├── review.js              # 评价API
│   │   │   ├── favorite.js            # 收藏API
│   │   │   └── ranking.js             # 排行榜API
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # 认证上下文
│   │   ├── utils/
│   │   │   └── helpers.js             # 工具函数
│   │   ├── App.jsx                    # 根组件
│   │   └── index.js                   # 入口
│   ├── package.json
│   └── .env
│
├── backend/                           # Node.js后端
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js            # 数据库配置
│   │   │   └── amap.js                # 高德API配置
│   │   ├── models/                    # 数据模型
│   │   │   ├── index.js               # 模型初始化
│   │   │   ├── User.js
│   │   │   ├── Restaurant.js
│   │   │   ├── Review.js
│   │   │   ├── ReviewImage.js
│   │   │   ├── Favorite.js
│   │   │   └── Category.js
│   │   ├── controllers/               # 控制器
│   │   │   ├── authController.js
│   │   │   ├── restaurantController.js
│   │   │   ├── reviewController.js
│   │   │   ├── favoriteController.js
│   │   │   └── rankingController.js
│   │   ├── routes/                    # 路由
│   │   │   ├── index.js
│   │   │   ├── auth.js
│   │   │   ├── restaurants.js
│   │   │   ├── reviews.js
│   │   │   ├── favorites.js
│   │   │   └── rankings.js
│   │   ├── middleware/                # 中间件
│   │   │   ├── auth.js                # JWT验证
│   │   │   ├── admin.js               # 管理员权限
│   │   │   └── upload.js              # 图片上传
│   │   ├── services/                  # 业务逻辑
│   │   │   └── amapService.js         # 高德API服务
│   │   └── app.js                     # Express入口
│   ├── uploads/                       # 图片存储
│   ├── package.json
│   └── .env
│
├── nginx/
│   └── default.conf                   # Nginx配置
│
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-07-20-restaurant-rating-design.md
        └── plans/
            └── 2026-07-20-restaurant-rating-plan.md
```

---

## Day 1: 项目初始化 + 数据库

### Task 1.1: 初始化后端项目

**Files:**
- Create: `backend/package.json`
- Create: `backend/.env`
- Create: `backend/src/app.js`

- [ ] **Step 1: 创建项目目录并初始化**

```bash
mkdir restaurant-rating
cd restaurant-rating
mkdir backend frontend
cd backend
npm init -y
```

- [ ] **Step 2: 安装后端依赖**

```bash
npm install express sequelize mysql2 bcryptjs jsonwebtoken cors dotenv multer axios
npm install -D nodemon
```

- [ ] **Step 3: 配置环境变量 `backend/.env`**

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=restaurant_rating
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
AMAP_KEY=your_amap_web_service_key
AMAP_JS_KEY=your_amap_js_api_key
```

- [ ] **Step 4: 创建Express入口文件 `backend/src/app.js`**

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const routes = require('./routes');
app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

- [ ] **Step 5: 配置 `package.json` scripts**

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  }
}
```

- [ ] **Step 6: 验证后端启动**

```bash
npm run dev
```

Expected: `Server running on port 3001`

---

### Task 1.2: 配置数据库 + 创建模型

**Files:**
- Create: `backend/src/config/database.js`
- Create: `backend/src/models/index.js`
- Create: `backend/src/models/User.js`
- Create: `backend/src/models/Restaurant.js`
- Create: `backend/src/models/Review.js`
- Create: `backend/src/models/ReviewImage.js`
- Create: `backend/src/models/Favorite.js`
- Create: `backend/src/models/Category.js`

- [ ] **Step 1: 创建数据库配置 `backend/src/config/database.js`**

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    timezone: '+08:00',
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

module.exports = sequelize;
```

- [ ] **Step 2: 创建 User 模型 `backend/src/models/User.js`**

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
  avatar: { type: DataTypes.STRING(255), allowNull: true },
}, { tableName: 'users' });

User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password_hash);
};

User.beforeCreate(async (user) => {
  user.password_hash = await bcrypt.hash(user.password_hash, 10);
});

module.exports = User;
```

- [ ] **Step 3: 创建 Restaurant 模型 `backend/src/models/Restaurant.js`**

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amap_id: { type: DataTypes.STRING(50), unique: true, allowNull: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  address: { type: DataTypes.STRING(500) },
  phone: { type: DataTypes.STRING(50) },
  category: { type: DataTypes.STRING(100) },
  latitude: { type: DataTypes.DECIMAL(10, 7) },
  longitude: { type: DataTypes.DECIMAL(10, 7) },
  city: { type: DataTypes.STRING(50) },
  district: { type: DataTypes.STRING(50) },
  avg_taste: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  avg_env: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  avg_service: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  avg_total: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  review_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  image_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  source: { type: DataTypes.ENUM('amap', 'manual'), defaultValue: 'amap' },
}, {
  tableName: 'restaurants',
  indexes: [
    { fields: ['city'] },
    { fields: ['category'] },
    { fields: ['avg_total'] },
  ],
});

module.exports = Restaurant;
```

- [ ] **Step 4: 创建 Review 模型 `backend/src/models/Review.js`**

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  taste_score: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
  env_score: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
  service_score: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
  content: { type: DataTypes.TEXT },
  total_score: { type: DataTypes.DECIMAL(3, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'approved' },
}, {
  tableName: 'reviews',
  indexes: [
    { fields: ['restaurant_id', 'status'] },
  ],
});

module.exports = Review;
```

- [ ] **Step 5: 创建 ReviewImage 模型 `backend/src/models/ReviewImage.js`**

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReviewImage = sequelize.define('ReviewImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  review_id: { type: DataTypes.INTEGER, allowNull: false },
  image_path: { type: DataTypes.STRING(255), allowNull: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'review_images' });

module.exports = ReviewImage;
```

- [ ] **Step 6: 创建 Favorite 模型 `backend/src/models/Favorite.js`**

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'favorites',
  indexes: [
    { unique: true, fields: ['user_id', 'restaurant_id'] },
  ],
});

module.exports = Favorite;
```

- [ ] **Step 7: 创建 Category 模型 `backend/src/models/Category.js`**

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  parent_id: { type: DataTypes.INTEGER, allowNull: true },
  icon: { type: DataTypes.STRING(50) },
}, { tableName: 'categories' });

module.exports = Category;
```

- [ ] **Step 8: 创建模型索引文件 `backend/src/models/index.js`**

```javascript
const sequelize = require('../config/database');
const User = require('./User');
const Restaurant = require('./Restaurant');
const Review = require('./Review');
const ReviewImage = require('./ReviewImage');
const Favorite = require('./Favorite');
const Category = require('./Category');

// 关联关系
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

Restaurant.hasMany(Review, { foreignKey: 'restaurant_id' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

Review.hasMany(ReviewImage, { foreignKey: 'review_id' });
ReviewImage.belongsTo(Review, { foreignKey: 'review_id' });

User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

Restaurant.hasMany(Favorite, { foreignKey: 'restaurant_id' });
Favorite.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });

module.exports = {
  sequelize,
  User,
  Restaurant,
  Review,
  ReviewImage,
  Favorite,
  Category,
};
```

- [ ] **Step 9: 创建数据库同步脚本并运行**

```javascript
// backend/src/scripts/sync-db.js
const { sequelize } = require('../models');

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database sync failed:', error);
    process.exit(1);
  }
}

syncDatabase();
```

```bash
node src/scripts/sync-db.js
```

Expected: `Database synced successfully`

---

### Task 1.3: 创建基础路由框架

**Files:**
- Create: `backend/src/routes/index.js`
- Create: `backend/src/routes/auth.js`
- Create: `backend/src/routes/restaurants.js`
- Create: `backend/src/routes/reviews.js`
- Create: `backend/src/routes/favorites.js`
- Create: `backend/src/routes/rankings.js`

- [ ] **Step 1: 创建路由入口 `backend/src/routes/index.js`**

```javascript
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/restaurants', require('./restaurants'));
router.use('/reviews', require('./reviews'));
router.use('/favorites', require('./favorites'));
router.use('/rankings', require('./rankings'));

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
```

- [ ] **Step 2: 创建占位路由文件（每个文件先导出空router）**

`backend/src/routes/auth.js`:
```javascript
const express = require('express');
const router = express.Router();
module.exports = router;
```

`backend/src/routes/restaurants.js`:
```javascript
const express = require('express');
const router = express.Router();
module.exports = router;
```

`backend/src/routes/reviews.js`:
```javascript
const express = require('express');
const router = express.Router();
module.exports = router;
```

`backend/src/routes/favorites.js`:
```javascript
const express = require('express');
const router = express.Router();
module.exports = router;
```

`backend/src/routes/rankings.js`:
```javascript
const express = require('express');
const router = express.Router();
module.exports = router;
```

- [ ] **Step 3: 验证API健康检查**

```bash
curl http://localhost:3001/api/health
```

Expected: `{"status":"ok","timestamp":"..."}`

---

### Task 1.4: 初始化前端项目

**Files:**
- Create: `frontend/` (整个React项目)

- [ ] **Step 1: 使用Create React App初始化**

```bash
cd restaurant-rating
npx create-react-app frontend
cd frontend
npm install react-router-dom axios antd @ant-design/icons
```

- [ ] **Step 2: 配置环境变量 `frontend/.env`**

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_AMAP_KEY=your_amap_js_api_key
```

- [ ] **Step 3: 创建API服务基础配置 `frontend/src/services/api.js`**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

- [ ] **Step 4: 创建认证上下文 `frontend/src/context/AuthContext.jsx`**

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then((data) => setUser(data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

- [ ] **Step 5: 配置路由 `frontend/src/App.jsx`**

```javascript
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

- [ ] **Step 6: 创建顶部导航组件 `frontend/src/components/Header.jsx`**

```javascript
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{ padding: '16px 24px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
          餐厅评分
        </Link>
        <Space>
          <Link to="/restaurants">找餐厅</Link>
          {user ? (
            <>
              <Link to="/profile"><UserOutlined /> {user.username}</Link>
              <Button icon={<LogoutOutlined />} onClick={() => { logout(); navigate('/'); }}>退出</Button>
            </>
          ) : (
            <>
              <Link to="/login">登录</Link>
              <Link to="/register">注册</Link>
            </>
          )}
        </Space>
      </div>
    </header>
  );
};

export default Header;
```

- [ ] **Step 7: 验证前端启动**

```bash
cd frontend
npm start
```

Expected: React应用启动在 http://localhost:3000

---

### Task 1.5: Day 1 提交

- [ ] **Step 1: 提交代码**

```bash
git init
git add .
git commit -m "feat: 项目初始化 - 前后端脚手架、数据库模型、基础路由"
```

---

## Day 2: 用户系统

### Task 2.1: 认证中间件

**Files:**
- Create: `backend/src/middleware/auth.js`
- Create: `backend/src/middleware/admin.js`

- [ ] **Step 1: 创建JWT认证中间件 `backend/src/middleware/auth.js`**

```javascript
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '请先登录' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: '认证失败，请重新登录' });
  }
};

module.exports = auth;
```

- [ ] **Step 2: 创建管理员权限中间件 `backend/src/middleware/admin.js`**

```javascript
const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
};

module.exports = admin;
```

---

### Task 2.2: 认证控制器和路由

**Files:**
- Create: `backend/src/controllers/authController.js`
- Modify: `backend/src/routes/auth.js`

- [ ] **Step 1: 创建认证控制器 `backend/src/controllers/authController.js`**

```javascript
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: '邮箱已被注册' });
    }

    const user = await User.create({
      username,
      email,
      password_hash: password,
    });

    const token = generateToken(user);
    res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: '注册失败' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const token = generateToken(user);
    res.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: '登录失败' });
  }
};

exports.getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    },
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    await req.user.update({ username, avatar });
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ error: '更新失败' });
  }
};
```

- [ ] **Step 2: 配置认证路由 `backend/src/routes/auth.js`**

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
```

- [ ] **Step 3: 验证注册API**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'
```

Expected: `{"user":{...},"token":"..."}`

- [ ] **Step 4: 验证登录API**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

Expected: `{"user":{...},"token":"..."}`

---

### Task 2.3: 前端登录/注册页面

**Files:**
- Create: `frontend/src/services/auth.js`
- Create: `frontend/src/pages/Login.jsx`
- Create: `frontend/src/pages/Register.jsx`

- [ ] **Step 1: 创建认证API服务 `frontend/src/services/auth.js`**

```javascript
import api from './api';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);
```

- [ ] **Step 2: 创建登录页面 `frontend/src/pages/Login.jsx`**

```javascript
import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/auth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await loginApi(values);
      login(data.user, data.token);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.error || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <Card title="登录">
        <Form onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input prefix={<UserOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            没有账号？<Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
```

- [ ] **Step 3: 创建注册页面 `frontend/src/pages/Register.jsx`**

```javascript
import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/auth';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await registerApi(values);
      login(data.user, data.token);
      message.success('注册成功');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.error || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <Card title="注册">
        <Form onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}>
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, min: 6, message: '密码至少6位' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            已有账号？<Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
```

- [ ] **Step 4: 创建用户中心页面 `frontend/src/pages/Profile.jsx`**

```javascript
import React from 'react';
import { Card, Tabs } from 'antd';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <Card>
        <h2>{user.username}</h2>
        <p>{user.email}</p>
        <Tabs items={[
          { key: 'reviews', label: '我的评价', children: <div>评价列表（待实现）</div> },
          { key: 'favorites', label: '我的收藏', children: <div>收藏列表（待实现）</div> },
        ]} />
      </Card>
    </div>
  );
};

export default Profile;
```

- [ ] **Step 5: 验证登录/注册流程**

在浏览器中访问 http://localhost:3000，测试注册和登录功能。

- [ ] **Step 6: 提交代码**

```bash
git add .
git commit -m "feat: 用户系统 - 注册/登录/JWT认证/个人资料"
```

---

## Day 3: 餐厅模块（后端）

### Task 3.1: 高德API服务

**Files:**
- Create: `backend/src/config/amap.js`
- Create: `backend/src/services/amapService.js`

- [ ] **Step 1: 创建高德API配置 `backend/src/config/amap.js`**

```javascript
module.exports = {
  baseUrl: 'https://restapi.amap.com/v3',
  key: process.env.AMAP_KEY,
};
```

- [ ] **Step 2: 创建高德API服务 `backend/src/services/amapService.js`**

```javascript
const axios = require('axios');
const config = require('../config/amap');

const client = axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
});

exports.searchRestaurants = async (params) => {
  const { keyword, city, category, page = 1, pageSize = 20 } = params;

  const response = await client.get('/place/text', {
    params: {
      key: config.key,
      keywords: keyword || '餐厅',
      city: city || '',
      types: category || '',
      offset: pageSize,
      page,
      extensions: 'all',
    },
  });

  if (response.data.status !== '1') {
    throw new Error(response.data.info || '高德API调用失败');
  }

  return {
    restaurants: response.data.pois.map((poi) => ({
      amap_id: poi.id,
      name: poi.name,
      address: poi.address,
      phone: poi.tel,
      category: poi.type,
      latitude: poi.location?.split(',')[1],
      longitude: poi.location?.split(',')[0],
      city: poi.cityname,
      district: poi.adname,
    })),
    total: parseInt(response.data.count) || 0,
  };
};

exports.getRestaurantDetail = async (amapId) => {
  const response = await client.get('/place/detail', {
    params: {
      key: config.key,
      id: amapId,
      extensions: 'all',
    },
  });

  if (response.data.status !== '1' || !response.data.pois.length) {
    throw new Error('餐厅信息获取失败');
  }

  const poi = response.data.pois[0];
  return {
    amap_id: poi.id,
    name: poi.name,
    address: poi.address,
    phone: poi.tel,
    category: poi.type,
    latitude: poi.location?.split(',')[1],
    longitude: poi.location?.split(',')[0],
    city: poi.cityname,
    district: poi.adname,
  };
};
```

---

### Task 3.2: 餐厅控制器和路由

**Files:**
- Create: `backend/src/controllers/restaurantController.js`
- Modify: `backend/src/routes/restaurants.js`

- [ ] **Step 1: 创建餐厅控制器 `backend/src/controllers/restaurantController.js`**

```javascript
const { Op } = require('sequelize');
const { Restaurant, Review, User, ReviewImage } = require('../models');
const amapService = require('../services/amapService');

exports.search = async (req, res) => {
  try {
    const { keyword, city, category, page = 1, limit = 20 } = req.query;
    const where = {};

    if (keyword) where.name = { [Op.like]: `%${keyword}%` };
    if (city) where.city = city;
    if (category) where.category = { [Op.like]: `%${category}%` };

    const { count, rows } = await Restaurant.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['avg_total', 'DESC']],
    });

    res.json({ restaurants: rows, total: count, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ error: '搜索失败' });
  }
};

exports.getById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [{
        model: Review,
        as: 'Reviews',
        where: { status: 'approved' },
        required: false,
        include: [
          { model: User, attributes: ['id', 'username', 'avatar'] },
          { model: ReviewImage },
        ],
        order: [['created_at', 'DESC']],
      }],
    });

    if (!restaurant) {
      return res.status(404).json({ error: '餐厅不存在' });
    }

    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ error: '获取详情失败' });
  }
};

exports.syncFromAmap = async (req, res) => {
  try {
    const { city, keyword, category } = req.body;
    const result = await amapService.searchRestaurants({ keyword, city, category });

    let synced = 0;
    for (const poi of result.restaurants) {
      const [restaurant, created] = await Restaurant.findOrCreate({
        where: { amap_id: poi.amap_id },
        defaults: poi,
      });
      if (created) synced++;
    }

    res.json({ synced, total: result.total });
  } catch (error) {
    res.status(500).json({ error: '同步失败: ' + error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      source: 'manual',
    });
    res.status(201).json({ restaurant });
  } catch (error) {
    res.status(500).json({ error: '添加失败' });
  }
};

exports.getNearby = async (req, res) => {
  try {
    const { latitude, longitude, radius = 3 } = req.query;

    const restaurants = await Restaurant.findAll({
      where: {
        latitude: { [Op.between]: [latitude - radius * 0.01, latitude + radius * 0.01] },
        longitude: { [Op.between]: [longitude - radius * 0.01, longitude + radius * 0.01] },
      },
      limit: 20,
      order: [['avg_total', 'DESC']],
    });

    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ error: '获取附近餐厅失败' });
  }
};
```

- [ ] **Step 2: 配置餐厅路由 `backend/src/routes/restaurants.js`**

```javascript
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/search', restaurantController.search);
router.get('/nearby', restaurantController.getNearby);
router.get('/:id', restaurantController.getById);
router.post('/sync-amap', auth, admin, restaurantController.syncFromAmap);
router.post('/', auth, admin, restaurantController.create);

module.exports = router;
```

- [ ] **Step 3: 验证搜索API**

```bash
curl "http://localhost:3001/api/restaurants/search?keyword=火锅&city=成都"
```

Expected: `{"restaurants":[],"total":0}` (数据库为空时)

- [ ] **Step 4: 验证高德同步API**

```bash
curl -X POST http://localhost:3001/api/restaurants/sync-amap \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"city":"成都","keyword":"火锅"}'
```

Expected: `{"synced":20,"total":100}`

- [ ] **Step 5: 提交代码**

```bash
git add .
git commit -m "feat: 餐厅模块后端 - 高德API集成、搜索、同步"
```

---

## Day 4: 餐厅模块（前端）

### Task 4.1: 餐厅API服务 + 首页

**Files:**
- Create: `frontend/src/services/restaurant.js`
- Create: `frontend/src/components/RestaurantCard.jsx`
- Create: `frontend/src/pages/Home.jsx`

- [ ] **Step 1: 创建餐厅API服务 `frontend/src/services/restaurant.js`**

```javascript
import api from './api';

export const searchRestaurants = (params) => api.get('/restaurants/search', { params });
export const getRestaurant = (id) => api.get(`/restaurants/${id}`);
export const getNearby = (params) => api.get('/restaurants/nearby', { params });
export const syncFromAmap = (data) => api.post('/restaurants/sync-amap', data);
export const createRestaurant = (data) => api.post('/restaurants', data);
```

- [ ] **Step 2: 创建星级评分组件 `frontend/src/components/StarRating.jsx`**

```javascript
import React from 'react';
import { Rate } from 'antd';

const StarRating = ({ value, count = 5, allowHalf = true, disabled = true, size = 'default' }) => {
  return <Rate value={parseFloat(value)} count={count} allowHalf={allowHalf} disabled={disabled} size={size} />;
};

export default StarRating;
```

- [ ] **Step 3: 创建餐厅卡片组件 `frontend/src/components/RestaurantCard.jsx`**

```javascript
import React from 'react';
import { Card, Tag, Space } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurants/${restaurant.id}`}>
      <Card hoverable style={{ marginBottom: 16 }}>
        <h3>{restaurant.name}</h3>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <StarRating value={restaurant.avg_total} />
          <span style={{ color: '#666' }}>
            口味 {restaurant.avg_taste} | 环境 {restaurant.avg_env} | 服务 {restaurant.avg_service}
          </span>
          <span style={{ color: '#999' }}>
            <EnvironmentOutlined /> {restaurant.address}
          </span>
          <Tag color="blue">{restaurant.category}</Tag>
          <span style={{ color: '#999', fontSize: 12 }}>
            {restaurant.review_count} 条评价
          </span>
        </Space>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
```

- [ ] **Step 4: 创建首页 `frontend/src/pages/Home.jsx`**

```javascript
import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Row, Col, Card, List } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { searchRestaurants } from '../services/restaurant';

const { Search } = Input;

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await searchRestaurants({ limit: 10 });
      setRestaurants(data.restaurants);
    } catch (error) {
      console.error('加载失败', error);
    }
  };

  const handleSearch = () => {
    navigate(`/restaurants?keyword=${keyword}&city=${city}`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1>发现美食</h1>
        <Row gutter={16} justify="center" style={{ maxWidth: 600, margin: '0 auto' }}>
          <Col span={8}>
            <Select
              placeholder="选择城市"
              style={{ width: '100%' }}
              value={city}
              onChange={setCity}
              options={[
                { value: '北京', label: '北京' },
                { value: '上海', label: '上海' },
                { value: '广州', label: '广州' },
                { value: '深圳', label: '深圳' },
                { value: '成都', label: '成都' },
                { value: '杭州', label: '杭州' },
              ]}
            />
          </Col>
          <Col span={12}>
            <Search
              placeholder="搜索餐厅"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={handleSearch} block>搜索</Button>
          </Col>
        </Row>
      </div>

      <h2>推荐餐厅</h2>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={restaurants}
        renderItem={(item) => (
          <List.Item>
            <RestaurantCard restaurant={item} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Home;
```

---

### Task 4.2: 餐厅列表页 + 地图

**Files:**
- Create: `frontend/src/components/AMap.jsx`
- Create: `frontend/src/pages/RestaurantList.jsx`

- [ ] **Step 1: 在 `public/index.html` 中引入高德地图JS API**

在 `<head>` 标签中添加：

```html
<script src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_JS_KEY"></script>
```

- [ ] **Step 2: 创建高德地图组件 `frontend/src/components/AMap.jsx`**

```javascript
import React, { useEffect, useRef } from 'react';

const AMap = ({ markers = [], center, zoom = 12, style = { height: 400, width: '100%' } }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.AMap) return;

    mapInstance.current = new window.AMap.Map(mapRef.current, {
      zoom,
      center: center ? [center.longitude, center.latitude] : undefined,
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    mapInstance.current.clearMap();

    markers.forEach((marker) => {
      if (marker.latitude && marker.longitude) {
        const m = new window.AMap.Marker({
          position: [marker.longitude, marker.latitude],
          title: marker.name,
        });
        m.setMap(mapInstance.current);

        const infoWindow = new window.AMap.InfoWindow({
          content: `<div style="padding:8px"><strong>${marker.name}</strong><br/>${marker.address || ''}</div>`,
        });

        m.on('click', () => {
          infoWindow.open(mapInstance.current, m.getPosition());
        });
      }
    });

    if (markers.length > 0 && markers[0].latitude) {
      mapInstance.current.setCenter([markers[0].longitude, markers[0].latitude]);
    }
  }, [markers]);

  return <div ref={mapRef} style={style} />;
};

export default AMap;
```

- [ ] **Step 3: 创建餐厅列表页 `frontend/src/pages/RestaurantList.jsx`**

```javascript
import React, { useState, useEffect } from 'react';
import { Input, Select, Row, Col, Pagination, Spin, Empty } from 'antd';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import AMap from '../components/AMap';
import { searchRestaurants } from '../services/restaurant';

const { Search } = Input;

const RestaurantList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const keyword = searchParams.get('keyword') || '';
  const city = searchParams.get('city') || '';

  useEffect(() => {
    loadRestaurants();
  }, [keyword, city, page]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await searchRestaurants({ keyword, city, page, limit: 10 });
      setRestaurants(data.restaurants);
      setTotal(data.total);
    } catch (error) {
      console.error('加载失败', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchParams({ keyword: value, city });
    setPage(1);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Row gutter={24}>
        <Col span={6}>
          <div style={{ marginBottom: 16 }}>
            <Search placeholder="搜索餐厅" defaultValue={keyword} onSearch={handleSearch} />
          </div>
          <Select
            placeholder="选择城市"
            style={{ width: '100%', marginBottom: 16 }}
            value={city}
            onChange={(val) => setSearchParams({ keyword, city: val })}
            allowClear
            options={[
              { value: '北京', label: '北京' },
              { value: '上海', label: '上海' },
              { value: '广州', label: '广州' },
              { value: '深圳', label: '深圳' },
              { value: '成都', label: '成都' },
              { value: '杭州', label: '杭州' },
            ]}
          />
        </Col>

        <Col span={12}>
          <Spin spinning={loading}>
            {restaurants.length === 0 ? (
              <Empty description="暂无餐厅数据" />
            ) : (
              <>
                {restaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
                <Pagination
                  current={page}
                  total={total}
                  pageSize={10}
                  onChange={setPage}
                  style={{ textAlign: 'center', marginTop: 24 }}
                />
              </>
            )}
          </Spin>
        </Col>

        <Col span={6}>
          <AMap markers={restaurants} />
        </Col>
      </Row>
    </div>
  );
};

export default RestaurantList;
```

---

### Task 4.3: 餐厅详情页

**Files:**
- Create: `frontend/src/pages/RestaurantDetail.jsx`

- [ ] **Step 1: 创建餐厅详情页 `frontend/src/pages/RestaurantDetail.jsx`**

```javascript
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Rate, Tag, List, Avatar, Spin, Button, message } from 'antd';
import { HeartOutlined, HeartFilled, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { getRestaurant } from '../services/restaurant';
import { useAuth } from '../context/AuthContext';
import AMap from '../components/AMap';
import StarRating from '../components/StarRating';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await getRestaurant(id);
      setRestaurant(data.restaurant);
    } catch (error) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!restaurant) return <div>餐厅不存在</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', padding: '0 24px' }}>
      <Card>
        <Row gutter={24}>
          <Col span={16}>
            <h1>{restaurant.name}</h1>
            <p><EnvironmentOutlined /> {restaurant.address}</p>
            {restaurant.phone && <p><PhoneOutlined /> {restaurant.phone}</p>}
            <Tag color="blue">{restaurant.category}</Tag>
            <Tag>{restaurant.district}</Tag>
          </Col>
          <Col span={8} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#fa8c16' }}>
              {restaurant.avg_total}
            </div>
            <StarRating value={restaurant.avg_total} />
            <p style={{ color: '#999' }}>{restaurant.review_count} 条评价</p>
          </Col>
        </Row>
      </Card>

      <Card title="评分详情" style={{ marginTop: 16 }}>
        <Row gutter={24}>
          <Col span={8}>口味 <Rate disabled value={parseFloat(restaurant.avg_taste)} allowHalf /></Col>
          <Col span={8}>环境 <Rate disabled value={parseFloat(restaurant.avg_env)} allowHalf /></Col>
          <Col span={8}>服务 <Rate disabled value={parseFloat(restaurant.avg_service)} allowHalf /></Col>
        </Row>
      </Card>

      <Card title="位置" style={{ marginTop: 16 }}>
        <AMap
          markers={[{ name: restaurant.name, latitude: restaurant.latitude, longitude: restaurant.longitude }]}
          center={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
          zoom={15}
          style={{ height: 300 }}
        />
      </Card>

      <Card title="评价" style={{ marginTop: 16 }}>
        <List
          dataSource={restaurant.Reviews || []}
          renderItem={(review) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{review.User?.username?.[0]}</Avatar>}
                title={
                  <div>
                    <span>{review.User?.username}</span>
                    <span style={{ marginLeft: 16 }}>
                      口味{review.taste_score} 环境{review.env_score} 服务{review.service_score}
                    </span>
                  </div>
                }
                description={
                  <div>
                    <p>{review.content}</p>
                    {review.ReviewImages?.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        {review.ReviewImages.map((img) => (
                          <img key={img.id} src={`/uploads/${img.image_path}`} alt="" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                        ))}
                      </div>
                    )}
                    <span style={{ color: '#999', fontSize: 12 }}>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default RestaurantDetail;
```

- [ ] **Step 2: 验证前端页面**

访问 http://localhost:3000，测试首页、列表页、详情页。

- [ ] **Step 3: 提交代码**

```bash
git add .
git commit -m "feat: 餐厅模块前端 - 首页、列表页(含地图)、详情页"
```

---

## Day 5: 评价系统

### Task 5.1: 图片上传中间件

**Files:**
- Create: `backend/src/middleware/upload.js`

- [ ] **Step 1: 创建上传中间件 `backend/src/middleware/upload.js`**

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('只支持图片文件'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
```

---

### Task 5.2: 评价控制器和路由

**Files:**
- Create: `backend/src/controllers/reviewController.js`
- Modify: `backend/src/routes/reviews.js`

- [ ] **Step 1: 创建评价控制器 `backend/src/controllers/reviewController.js`**

```javascript
const { Review, ReviewImage, Restaurant, User } = require('../models');

exports.create = async (req, res) => {
  try {
    const { restaurant_id, taste_score, env_score, service_score, content } = req.body;

    const existing = await Review.findOne({
      where: { user_id: req.user.id, restaurant_id },
    });
    if (existing) {
      return res.status(400).json({ error: '你已经评价过这家餐厅' });
    }

    const total_score = (taste_score * 0.4 + env_score * 0.3 + service_score * 0.3).toFixed(2);

    const review = await Review.create({
      user_id: req.user.id,
      restaurant_id,
      taste_score,
      env_score,
      service_score,
      content,
      total_score,
    });

    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        review_id: review.id,
        image_path: file.filename,
        sort_order: index,
      }));
      await ReviewImage.bulkCreate(images);

      await Restaurant.increment('image_count', {
        where: { id: restaurant_id },
        by: req.files.length,
      });
    }

    await updateRestaurantScores(restaurant_id);

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ error: '发表评价失败' });
  }
};

exports.getByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10, sort = 'latest' } = req.query;

    let order = [['created_at', 'DESC']];
    if (sort === 'highest') order = [['total_score', 'DESC']];
    if (sort === 'lowest') order = [['total_score', 'ASC']];

    const { count, rows } = await Review.findAndCountAll({
      where: { restaurant_id: restaurantId, status: 'approved' },
      include: [
        { model: User, attributes: ['id', 'username', 'avatar'] },
        { model: ReviewImage },
      ],
      order,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({ reviews: rows, total: count, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ error: '获取评价失败' });
  }
};

exports.update = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!review) {
      return res.status(404).json({ error: '评价不存在' });
    }

    const { taste_score, env_score, service_score, content } = req.body;
    const total_score = (taste_score * 0.4 + env_score * 0.3 + service_score * 0.3).toFixed(2);

    await review.update({ taste_score, env_score, service_score, content, total_score });
    await updateRestaurantScores(review.restaurant_id);

    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: '更新评价失败' });
  }
};

exports.remove = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id },
    });

    if (!review) {
      return res.status(404).json({ error: '评价不存在' });
    }

    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权删除' });
    }

    await ReviewImage.destroy({ where: { review_id: review.id } });
    await review.destroy();
    await updateRestaurantScores(review.restaurant_id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '删除评价失败' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ error: '评价不存在' });
    }

    await review.update({ status: req.body.status });
    await updateRestaurantScores(review.restaurant_id);

    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: '更新状态失败' });
  }
};

async function updateRestaurantScores(restaurantId) {
  const reviews = await Review.findAll({
    where: { restaurant_id: restaurantId, status: 'approved' },
  });

  if (reviews.length === 0) {
    await Restaurant.update({
      avg_taste: 0, avg_env: 0, avg_service: 0, avg_total: 0, review_count: 0,
    }, { where: { id: restaurantId } });
    return;
  }

  const sums = reviews.reduce((acc, r) => ({
    taste: acc.taste + parseFloat(r.taste_score),
    env: acc.env + parseFloat(r.env_score),
    service: acc.service + parseFloat(r.service_score),
    total: acc.total + parseFloat(r.total_score),
  }), { taste: 0, env: 0, service: 0, total: 0 });

  const count = reviews.length;
  await Restaurant.update({
    avg_taste: (sums.taste / count).toFixed(2),
    avg_env: (sums.env / count).toFixed(2),
    avg_service: (sums.service / count).toFixed(2),
    avg_total: (sums.total / count).toFixed(2),
    review_count: count,
  }, { where: { id: restaurantId } });
}
```

- [ ] **Step 2: 配置评价路由 `backend/src/routes/reviews.js`**

```javascript
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('images', 9), reviewController.create);
router.get('/:restaurantId', reviewController.getByRestaurant);
router.put('/:id', auth, reviewController.update);
router.delete('/:id', auth, reviewController.remove);
router.put('/:id/status', auth, admin, reviewController.updateStatus);

module.exports = router;
```

- [ ] **Step 3: 验证评价API**

```bash
curl -X POST http://localhost:3001/api/reviews \
  -H "Authorization: Bearer <token>" \
  -F "restaurant_id=1" \
  -F "taste_score=5" \
  -F "env_score=4" \
  -F "service_score=5" \
  -F "content=很好吃！"
```

Expected: `{"review":{...}}`

- [ ] **Step 4: 提交代码**

```bash
git add .
git commit -m "feat: 评价系统 - CRUD、图片上传、评分计算"
```

---

### Task 5.3: 前端评价表单

**Files:**
- Create: `frontend/src/services/review.js`
- Modify: `frontend/src/pages/RestaurantDetail.jsx` (添加评价表单)

- [ ] **Step 1: 创建评价API服务 `frontend/src/services/review.js`**

```javascript
import api from './api';

export const createReview = (formData) => api.post('/reviews', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const getReviews = (restaurantId, params) => api.get(`/reviews/${restaurantId}`, { params });

export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);

export const deleteReview = (id) => api.delete(`/reviews/${id}`);
```

- [ ] **Step 2: 在餐厅详情页添加评价表单**

在 `RestaurantDetail.jsx` 中，在评价列表上方添加评价表单：

```javascript
import { Form, Input, Rate, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createReview } from '../services/review';

// 在 Card title="评价" 内部，List 之前添加：
{user && (
  <Card title="发表评价" style={{ marginBottom: 16 }}>
    <Form onFinish={handleSubmitReview}>
      <Form.Item label="口味" name="taste_score" rules={[{ required: true }]}>
        <Rate />
      </Form.Item>
      <Form.Item label="环境" name="env_score" rules={[{ required: true }]}>
        <Rate />
      </Form.Item>
      <Form.Item label="服务" name="service_score" rules={[{ required: true }]}>
        <Rate />
      </Form.Item>
      <Form.Item label="评价" name="content">
        <Input.TextArea rows={4} placeholder="分享你的用餐体验..." />
      </Form.Item>
      <Form.Item label="图片" name="images">
        <Upload listType="picture-card" beforeUpload={() => false} maxCount={9}>
          <div><PlusOutlined /><div style={{ marginTop: 8 }}>上传</div></div>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">提交评价</Button>
      </Form.Item>
    </Form>
  </Card>
)}
```

添加提交处理函数：

```javascript
const handleSubmitReview = async (values) => {
  const formData = new FormData();
  formData.append('restaurant_id', id);
  formData.append('taste_score', values.taste_score);
  formData.append('env_score', values.env_score);
  formData.append('service_score', values.service_score);
  formData.append('content', values.content || '');

  if (values.images) {
    values.images.fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });
  }

  try {
    await createReview(formData);
    message.success('评价成功');
    loadDetail();
  } catch (error) {
    message.error(error.response?.data?.error || '评价失败');
  }
};
```

- [ ] **Step 3: 验证评价流程**

在详情页测试发表评价，确认评分和图片上传正常。

- [ ] **Step 4: 提交代码**

```bash
git add .
git commit -m "feat: 前端评价表单 - 多维度评分、图片上传"
```

---

## Day 6: 收藏 + 排行榜 + 管理员后台

### Task 6.1: 收藏功能

**Files:**
- Create: `backend/src/controllers/favoriteController.js`
- Modify: `backend/src/routes/favorites.js`
- Create: `frontend/src/services/favorite.js`

- [ ] **Step 1: 创建收藏控制器 `backend/src/controllers/favoriteController.js`**

```javascript
const { Favorite, Restaurant } = require('../models');

exports.add = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const existing = await Favorite.findOne({
      where: { user_id: req.user.id, restaurant_id: restaurantId },
    });
    if (existing) {
      return res.status(400).json({ error: '已经收藏过了' });
    }

    await Favorite.create({
      user_id: req.user.id,
      restaurant_id: restaurantId,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '收藏失败' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Favorite.destroy({
      where: { user_id: req.user.id, restaurant_id: req.params.restaurantId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '取消收藏失败' });
  }
};

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { count, rows } = await Favorite.findAndCountAll({
      where: { user_id: req.user.id },
      include: [{ model: Restaurant }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({ favorites: rows, total: count, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ error: '获取收藏失败' });
  }
};
```

- [ ] **Step 2: 配置收藏路由 `backend/src/routes/favorites.js`**

```javascript
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const auth = require('../middleware/auth');

router.post('/:restaurantId', auth, favoriteController.add);
router.delete('/:restaurantId', auth, favoriteController.remove);
router.get('/', auth, favoriteController.list);

module.exports = router;
```

- [ ] **Step 3: 创建收藏API服务 `frontend/src/services/favorite.js`**

```javascript
import api from './api';

export const addFavorite = (restaurantId) => api.post(`/favorites/${restaurantId}`);
export const removeFavorite = (restaurantId) => api.delete(`/favorites/${restaurantId}`);
export const getFavorites = (params) => api.get('/favorites', { params });
```

- [ ] **Step 4: 在详情页添加收藏按钮**

在 `RestaurantDetail.jsx` 中添加收藏功能：

```javascript
import { addFavorite, removeFavorite } from '../services/favorite';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

const [isFavorited, setIsFavorited] = useState(false);

const toggleFavorite = async () => {
  try {
    if (isFavorited) {
      await removeFavorite(id);
      setIsFavorited(false);
      message.success('已取消收藏');
    } else {
      await addFavorite(id);
      setIsFavorited(true);
      message.success('收藏成功');
    }
  } catch (error) {
    message.error('操作失败');
  }
};

// 在页面中添加按钮：
{user && (
  <Button
    type={isFavorited ? 'primary' : 'default'}
    icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
    onClick={toggleFavorite}
  >
    {isFavorited ? '已收藏' : '收藏'}
  </Button>
)}
```

- [ ] **Step 5: 提交代码**

```bash
git add .
git commit -m "feat: 收藏功能 - 添加/取消/列表"
```

---

### Task 6.2: 排行榜

**Files:**
- Create: `backend/src/controllers/rankingController.js`
- Modify: `backend/src/routes/rankings.js`
- Create: `frontend/src/services/ranking.js`

- [ ] **Step 1: 创建排行榜控制器 `backend/src/controllers/rankingController.js`**

```javascript
const { Restaurant, Op } = require('sequelize');
const { Review } = require('../models');

exports.topRated = async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;
    const where = { review_count: { [Op.gt]: 0 } };
    if (city) where.city = city;

    const restaurants = await Restaurant.findAll({
      where,
      order: [['avg_total', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ error: '获取排行榜失败' });
  }
};

exports.mostReviewed = async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;
    const where = {};
    if (city) where.city = city;

    const restaurants = await Restaurant.findAll({
      where,
      order: [['review_count', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ error: '获取排行榜失败' });
  }
};

exports.trending = async (req, res) => {
  try {
    const { city, limit = 10, days = 7 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const where = { created_at: { [Op.gte]: since } };
    const restaurantWhere = {};
    if (city) restaurantWhere.city = city;

    const reviews = await Review.findAll({
      where,
      attributes: ['restaurant_id'],
      group: ['restaurant_id'],
    });

    const restaurantIds = reviews.map((r) => r.restaurant_id);

    const restaurants = await Restaurant.findAll({
      where: {
        id: { [Op.in]: restaurantIds },
        ...restaurantWhere,
      },
      order: [['avg_total', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ error: '获取排行榜失败' });
  }
};
```

- [ ] **Step 2: 配置排行榜路由 `backend/src/routes/rankings.js`**

```javascript
const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');

router.get('/top-rated', rankingController.topRated);
router.get('/most-reviewed', rankingController.mostReviewed);
router.get('/trending', rankingController.trending);

module.exports = router;
```

- [ ] **Step 3: 创建排行榜API服务 `frontend/src/services/ranking.js`**

```javascript
import api from './api';

export const getTopRated = (params) => api.get('/rankings/top-rated', { params });
export const getMostReviewed = (params) => api.get('/rankings/most-reviewed', { params });
export const getTrending = (params) => api.get('/rankings/trending', { params });
```

- [ ] **Step 4: 在首页添加排行榜入口**

在 `Home.jsx` 中添加排行榜展示区域：

```javascript
import { Tabs } from 'antd';
import { getTopRated, getMostReviewed, getTrending } from '../services/ranking';

const [rankings, setRankings] = useState({ topRated: [], mostReviewed: [], trending: [] });

useEffect(() => {
  loadRankings();
}, []);

const loadRankings = async () => {
  try {
    const [topRated, mostReviewed, trending] = await Promise.all([
      getTopRated({ limit: 5 }),
      getMostReviewed({ limit: 5 }),
      getTrending({ limit: 5 }),
    ]);
    setRankings({ topRated: topRated.restaurants, mostReviewed: mostReviewed.restaurants, trending: trending.restaurants });
  } catch (error) {
    console.error('加载排行榜失败', error);
  }
};

// 在推荐餐厅列表之前添加：
<Tabs items={[
  { key: 'top', label: '评分最高', children: <RankingList data={rankings.topRated} /> },
  { key: 'reviewed', label: '评价最多', children: <RankingList data={rankings.mostReviewed} /> },
  { key: 'trending', label: '近期热门', children: <RankingList data={rankings.trending} /> },
]} />
```

- [ ] **Step 5: 提交代码**

```bash
git add .
git commit -m "feat: 排行榜 - 评分最高/评价最多/近期热门"
```

---

### Task 6.3: 管理员后台

**Files:**
- Create: `frontend/src/pages/admin/ReviewManage.jsx`
- Create: `frontend/src/pages/admin/RestaurantManage.jsx`
- Create: `frontend/src/pages/admin/UserManage.jsx`
- Modify: `frontend/src/App.jsx` (添加管理员路由)

- [ ] **Step 1: 创建评价管理页面 `frontend/src/pages/admin/ReviewManage.jsx`**

```javascript
import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, message, Popconfirm } from 'antd';
import api from '../../services/api';

const ReviewManage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/reviews');
      setReviews(data.reviews);
    } catch (error) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      message.success('更新成功');
      loadReviews();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户', dataIndex: ['User', 'username'] },
    { title: '餐厅', dataIndex: ['Restaurant', 'name'] },
    { title: '评分', render: (_, r) => `${r.taste_score}/${r.env_score}/${r.service_score}` },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    { title: '状态', dataIndex: 'status', render: (s) => <Tag color={s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'orange'}>{s}</Tag> },
    {
      title: '操作',
      render: (_, record) => (
        <span>
          <Button size="small" onClick={() => handleStatusChange(record.id, 'approved')}>通过</Button>
          <Button size="small" danger onClick={() => handleStatusChange(record.id, 'rejected')}>拒绝</Button>
        </span>
      ),
    },
  ];

  return <Table columns={columns} dataSource={reviews} rowKey="id" loading={loading} />;
};

export default ReviewManage;
```

- [ ] **Step 2: 创建餐厅管理页面 `frontend/src/pages/admin/RestaurantManage.jsx`**

```javascript
import React, { useState } from 'react';
import { Button, Form, Input, Select, message, Table } from 'antd';
import { syncFromAmap, createRestaurant } from '../../services/restaurant';

const RestaurantManage = () => {
  const [loading, setLoading] = useState(false);

  const handleSync = async (values) => {
    setLoading(true);
    try {
      const data = await syncFromAmap(values);
      message.success(`同步成功，新增 ${data.synced} 家餐厅`);
    } catch (error) {
      message.error('同步失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await createRestaurant(values);
      message.success('添加成功');
    } catch (error) {
      message.error('添加失败');
    }
  };

  return (
    <div>
      <h3>从高德同步餐厅</h3>
      <Form layout="inline" onFinish={handleSync}>
        <Form.Item name="city" rules={[{ required: true }]}>
          <Input placeholder="城市" />
        </Form.Item>
        <Form.Item name="keyword">
          <Input placeholder="关键词" />
        </Form.Item>
        <Form.Item name="category">
          <Input placeholder="分类" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>同步</Button>
        </Form.Item>
      </Form>

      <h3 style={{ marginTop: 24 }}>手动添加餐厅</h3>
      <Form layout="vertical" onFinish={handleCreate}>
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="地址">
          <Input />
        </Form.Item>
        <Form.Item name="city" label="城市">
          <Input />
        </Form.Item>
        <Form.Item name="category" label="分类">
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="电话">
          <Input />
        </Form.Item>
        <Form.Item name="latitude" label="纬度">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="longitude" label="经度">
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">添加</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RestaurantManage;
```

- [ ] **Step 3: 创建用户管理页面 `frontend/src/pages/admin/UserManage.jsx`**

```javascript
import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import api from '../../services/api';

const UserManage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then((data) => setUsers(data.users)).catch(console.error);
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '角色', dataIndex: 'role', render: (r) => <Tag color={r === 'admin' ? 'red' : 'blue'}>{r}</Tag> },
    { title: '注册时间', dataIndex: 'created_at', render: (d) => new Date(d).toLocaleDateString() },
  ];

  return <Table columns={columns} dataSource={users} rowKey="id" />;
};

export default UserManage;
```

- [ ] **Step 4: 在App.jsx中添加管理员路由**

```javascript
import ReviewManage from './pages/admin/ReviewManage';
import RestaurantManage from './pages/admin/RestaurantManage';
import UserManage from './pages/admin/UserManage';

// 在Routes中添加：
<Route path="/admin" element={<AdminLayout />}>
  <Route path="reviews" element={<ReviewManage />} />
  <Route path="restaurants" element={<RestaurantManage />} />
  <Route path="users" element={<UserManage />} />
</Route>
```

- [ ] **Step 5: 提交代码**

```bash
git add .
git commit -m "feat: 管理员后台 - 评价审核、餐厅管理、用户管理"
```

---

## Day 7: 联调测试 + 部署

### Task 7.1: 端到端测试

- [ ] **Step 1: 测试完整用户流程**

1. 注册新用户
2. 搜索餐厅
3. 查看餐厅详情
4. 发表评价（含图片）
5. 收藏餐厅
6. 查看排行榜

- [ ] **Step 2: 测试管理员流程**

1. 登录管理员账号
2. 从高德同步餐厅数据
3. 审核评价
4. 手动添加餐厅

- [ ] **Step 3: 修复发现的问题**

---

### Task 7.2: 部署到腾讯云服务器

**Files:**
- Create: `nginx/default.conf`

- [ ] **Step 1: 创建Nginx配置 `nginx/default.conf`**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/restaurant-rating/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/restaurant-rating/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

- [ ] **Step 2: 在服务器上安装依赖**

```bash
# 在腾讯云服务器上执行
sudo apt update
sudo apt install -y nodejs npm mysql-server nginx

# 安装PM2
sudo npm install -g pm2
```

- [ ] **Step 3: 上传代码到服务器**

```bash
# 方式一：使用git
git clone <your-repo-url> /var/www/restaurant-rating

# 方式二：使用scp
scp -r restaurant-rating/* user@server:/var/www/restaurant-rating/
```

- [ ] **Step 4: 配置MySQL数据库**

```bash
mysql -u root -p
```

```sql
CREATE DATABASE restaurant_rating CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON restaurant_rating.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
```

- [ ] **Step 5: 安装后端依赖并同步数据库**

```bash
cd /var/www/restaurant-rating/backend
npm install
node src/scripts/sync-db.js
```

- [ ] **Step 6: 构建前端**

```bash
cd /var/www/restaurant-rating/frontend
npm install
npm run build
```

- [ ] **Step 7: 配置后端环境变量**

```bash
cd /var/www/restaurant-rating/backend
cp .env.example .env
# 编辑 .env 文件，填入实际配置
```

- [ ] **Step 8: 使用PM2启动后端**

```bash
cd /var/www/restaurant-rating/backend
pm2 start src/app.js --name restaurant-api
pm2 save
pm2 startup
```

- [ ] **Step 9: 配置Nginx**

```bash
sudo cp /var/www/restaurant-rating/nginx/default.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/default.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

- [ ] **Step 10: 验证部署**

访问 `http://your-domain.com`，确认：
- 首页正常加载
- API请求正常
- 图片上传和显示正常
- 地图正常显示

- [ ] **Step 11: 提交最终代码**

```bash
git add .
git commit -m "feat: 部署配置 - Nginx、PM2、环境变量"
```

---

## 开发检查清单

### Day 1 完成标准
- [ ] 后端Express启动正常
- [ ] 数据库表创建成功
- [ ] 前端React启动正常
- [ ] API健康检查通过

### Day 2 完成标准
- [ ] 用户可以注册
- [ ] 用户可以登录
- [ ] JWT认证正常工作
- [ ] 前端登录/注册页面可用

### Day 3 完成标准
- [ ] 高德API调用成功
- [ ] 餐厅同步功能正常
- [ ] 餐厅搜索API正常
- [ ] 餐厅详情API正常

### Day 4 完成标准
- [ ] 首页展示正常
- [ ] 餐厅列表页展示正常
- [ ] 地图显示正常
- [ ] 餐厅详情页展示正常

### Day 5 完成标准
- [ ] 评价发表成功
- [ ] 图片上传成功
- [ ] 评分计算正确
- [ ] 评价列表展示正常

### Day 6 完成标准
- [ ] 收藏功能正常
- [ ] 排行榜展示正常
- [ ] 管理员后台可用
- [ ] 评价审核功能正常

### Day 7 完成标准
- [ ] 所有功能端到端测试通过
- [ ] 服务器部署成功
- [ ] 网站可正常访问
- [ ] 性能基本达标

---

## 常见问题

### 1. 高德API Key配置
- Web服务API Key用于后端调用（搜索、详情）
- Web端(JS API) Key用于前端地图展示
- 两个Key需要在高德开放平台分别申请

### 2. MySQL连接失败
- 检查MySQL服务是否启动：`sudo systemctl status mysql`
- 检查数据库用户权限
- 检查 `.env` 中的数据库配置

### 3. 前端跨域问题
- 开发环境：在 `frontend/.env` 中配置 `REACT_APP_API_URL=http://localhost:3001/api`
- 生产环境：通过Nginx反向代理解决

### 4. 图片上传失败
- 检查 `uploads/` 目录权限：`chmod 755 uploads/`
- 检查文件大小限制（默认5MB）
- 检查Nginx的 `client_max_body_size` 配置

### 5. 地图不显示
- 检查高德JS API Key是否正确
- 检查Key的配额和域名白名单
- 浏览器控制台查看错误信息

---

**文档版本**: 1.0  
**最后更新**: 2026-07-20  
**预计完成时间**: 7天
