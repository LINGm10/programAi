# 餐厅评分网站设计文档

**日期**: 2026-07-20  
**项目**: 全国餐厅评分网站  
**状态**: 待实施

---

## 1. 项目概述

### 1.1 目标
构建一个全国范围的餐厅评分网站，用户可以搜索餐厅、查看多维度评分（口味/环境/服务）、发表评价并上传图片。

### 1.2 核心特性
- 全国范围餐厅搜索
- 多维度评分系统（口味、环境、服务各1-5分）
- 文字评价 + 图片上传
- 高德地图集成（餐厅信息 + 地图展示）
- 用户注册登录 + 管理员后台
- 收藏功能
- 排行榜（评分最高、评价最多、近期热门）

### 1.3 数据来源
- **高德地图API**: 获取餐厅基础信息（名称、地址、经纬度、分类等）
- **管理员手动添加**: 补充高德没有的餐厅
- **用户生成内容**: 评分、评价、图片

---

## 2. 系统架构

### 2.1 技术栈
- **前端**: React + React Router + Axios + Ant Design
- **后端**: Node.js + Express + JWT
- **数据库**: MySQL
- **地图服务**: 高德地图 JS API（前端）+ Web服务API（后端）
- **图片存储**: 本地磁盘（腾讯云服务器）

### 2.2 架构图

```
用户浏览器
    │
    ▼
┌──────────┐
│  Nginx   │  :80/:443
│  反向代理 │
└────┬─────┘
     │
     ├── /              → React 静态文件（build/）
     │
     ├── /api/*         → Express API（:3001）
     │
     └── /uploads/*     → 图片静态服务
              │
              ▼
┌─────────────────────┐
│  Node.js + Express  │  :3001
├─────────────────────┤
│  JWT 认证            │
│  餐厅 API            │
│  评价 API            │
│  用户 API            │
│  高德 API 代理        │
│  图片上传处理         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      MySQL          │  :3306
├─────────────────────┤
│  users              │
│  restaurants        │
│  reviews            │
│  review_images      │
│  favorites          │
│  categories         │
└─────────────────────┘
```

### 2.3 关键决策
- Nginx统一入口，按路径分发到前端静态文件和后端API
- Express同时承担业务API和高德API代理（避免前端暴露API Key）
- 图片通过Express上传到本地 `uploads/` 目录，Nginx直接提供静态访问

---

## 3. 数据库设计

### 3.1 表结构

```sql
-- 用户表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 餐厅表
CREATE TABLE restaurants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  amap_id VARCHAR(50) UNIQUE,  -- 高德POI ID，手动添加时为NULL
  name VARCHAR(200) NOT NULL,
  address VARCHAR(500),
  phone VARCHAR(50),
  category VARCHAR(100),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  city VARCHAR(50),
  district VARCHAR(50),
  avg_taste DECIMAL(3, 2) DEFAULT 0,
  avg_env DECIMAL(3, 2) DEFAULT 0,
  avg_service DECIMAL(3, 2) DEFAULT 0,
  avg_total DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  image_count INT DEFAULT 0,
  source ENUM('amap', 'manual') DEFAULT 'amap',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_city (city),
  INDEX idx_category (category),
  INDEX idx_avg_total (avg_total DESC)
);

-- 评价表
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  taste_score TINYINT NOT NULL CHECK (taste_score BETWEEN 1 AND 5),
  env_score TINYINT NOT NULL CHECK (env_score BETWEEN 1 AND 5),
  service_score TINYINT NOT NULL CHECK (service_score BETWEEN 1 AND 5),
  content TEXT,
  total_score DECIMAL(3, 2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurant_status (restaurant_id, status),
  UNIQUE KEY unique_user_restaurant (user_id, restaurant_id)
);

-- 评价图片表
CREATE TABLE review_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_id INT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- 收藏表
CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_restaurant (user_id, restaurant_id)
);

-- 菜系/分类表
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  parent_id INT,
  icon VARCHAR(50),
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

### 3.2 关键决策
- `amap_id` 做唯一约束，避免高德重复导入
- 餐厅表缓存平均分和评价数，避免每次查询都聚合计算
- 评价设 `status` 字段，管理员可审核不当内容
- `total_score` 由后端按权重计算（口味40%、环境30%、服务30%）
- 每个用户对同一家餐厅只能评价一次

---

## 4. API设计

### 4.1 用户模块

```
POST   /api/auth/register      注册
  Body: { username, email, password }
  Response: { user, token }

POST   /api/auth/login         登录
  Body: { email, password }
  Response: { user, token }

GET    /api/auth/me            获取当前用户信息
  Headers: Authorization: Bearer <token>
  Response: { user }

PUT    /api/auth/profile       更新个人资料
  Headers: Authorization: Bearer <token>
  Body: { username, avatar }
  Response: { user }
```

### 4.2 餐厅模块

```
GET    /api/restaurants/search
  Query: keyword, city, category, page, limit
  Response: { restaurants: [...], total, page }

GET    /api/restaurants/:id
  Response: { restaurant }

GET    /api/restaurants/:id/nearby
  Query: latitude, longitude, radius
  Response: { restaurants: [...] }

POST   /api/restaurants/sync-amap  (管理员)
  Body: { city, keyword, category }
  Response: { synced: number }

POST   /api/restaurants  (管理员)
  Body: { name, address, phone, category, latitude, longitude, city, district }
  Response: { restaurant }
```

### 4.3 评价模块

```
POST   /api/reviews
  Headers: Authorization: Bearer <token>
  Body: multipart/form-data { restaurant_id, taste_score, env_score, service_score, content, images[] }
  Response: { review }

GET    /api/reviews/:restaurantId
  Query: page, limit, sort (latest|highest|lowest)
  Response: { reviews: [...], total, page }

PUT    /api/reviews/:id
  Headers: Authorization: Bearer <token>
  Body: { taste_score, env_score, service_score, content }
  Response: { review }

DELETE /api/reviews/:id
  Headers: Authorization: Bearer <token>
  Response: { success: true }

PUT    /api/reviews/:id/status  (管理员)
  Body: { status }
  Response: { review }
```

### 4.4 收藏模块

```
POST   /api/favorites/:restaurantId
  Headers: Authorization: Bearer <token>
  Response: { success: true }

DELETE /api/favorites/:restaurantId
  Headers: Authorization: Bearer <token>
  Response: { success: true }

GET    /api/favorites
  Headers: Authorization: Bearer <token>
  Query: page, limit
  Response: { favorites: [...], total, page }
```

### 4.5 排行榜模块

```
GET    /api/rankings/top-rated
  Query: city, limit
  Response: { restaurants: [...] }

GET    /api/rankings/most-reviewed
  Query: city, limit
  Response: { restaurants: [...] }

GET    /api/rankings/trending
  Query: city, limit, days (默认7天)
  Response: { restaurants: [...] }
```

### 4.6 关键决策
- 高德API调用封装在后端，前端不接触API Key
- 图片上传用 `multipart/form-data`，Express用 `multer` 处理
- 评价发表后默认 `approved`，管理员可标记为 `rejected`
- 排行榜按缓存的平均分排序，性能更好
- 所有需要认证的接口都通过JWT中间件验证

---

## 5. 前端页面结构

### 5.1 页面列表

```
首页 (/)
├── 搜索栏（关键词 + 城市选择）
├── 排行榜入口（评分最高、评价最多、近期热门）
└── 推荐餐厅列表

餐厅列表页 (/restaurants)
├── 左侧：筛选面板（菜系、区域、评分范围）
├── 中间：餐厅卡片列表（名称、平均分、地址、缩略图）
└── 右侧：高德地图（显示当前列表餐厅位置）

餐厅详情页 (/restaurants/:id)
├── 餐厅基本信息（名称、地址、电话、分类）
├── 高德地图定位
├── 综合评分展示（口味/环境/服务 + 总分）
├── 评价列表（多维度评分 + 文字 + 图片）
├── 发表评价表单（登录后可见）
└── 收藏按钮

用户中心 (/profile)
├── 个人资料
├── 我的评价
├── 我的收藏
└── 账号设置

管理员后台 (/admin)
├── 评价管理（审核/删除）
├── 餐厅管理（同步高德/手动添加）
└── 用户管理
```

### 5.2 关键决策
- 餐厅列表页集成地图，搜索时地图同步更新标记点
- 详情页突出多维度评分可视化（如雷达图）
- 评价列表支持按时间/评分排序
- 移动端响应式设计（React组件适配）

---

## 6. 部署方案

### 6.1 服务器配置
- 腾讯云服务器（Linux）
- Nginx（反向代理 + 静态文件服务）
- Node.js（Express API）
- MySQL（数据库）

### 6.2 部署流程
1. 安装 Node.js、MySQL、Nginx
2. 克隆代码到服务器
3. 安装依赖：`npm install`（前端和后端）
4. 构建前端：`npm run build`（生成 `build/` 目录）
5. 配置 Nginx（反向代理规则）
6. 配置 MySQL（创建数据库和表）
7. 启动 Express：使用 PM2 管理进程
8. 配置 HTTPS（可选，使用 Let's Encrypt）

### 6.3 Nginx配置示例

```nginx
server {
    listen 80;
    server_id your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 图片静态服务
    location /uploads {
        alias /path/to/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 7. 后续扩展（完整版功能）

以下功能在进阶版完成后实现：

- 用户关注/粉丝系统
- 评价点赞/评论
- 个性化推荐（基于用户偏好和历史行为）
- 餐厅认领（商家可以认领自己的餐厅）
- 优惠券/活动发布
- 移动端APP（React Native）

---

## 8. 项目目录结构

```
restaurant-rating/
├── frontend/                 # React前端
│   ├── public/
│   ├── src/
│   │   ├── components/      # 通用组件
│   │   ├── pages/           # 页面组件
│   │   ├── services/        # API调用
│   │   ├── utils/           # 工具函数
│   │   └── App.js
│   ├── package.json
│   └── README.md
│
├── backend/                  # Node.js后端
│   ├── src/
│   │   ├── config/          # 配置文件
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── middleware/      # 中间件（认证等）
│   │   ├── services/        # 业务逻辑
│   │   ├── utils/           # 工具函数
│   │   └── app.js           # 入口文件
│   ├── uploads/             # 图片上传目录
│   ├── package.json
│   └── README.md
│
└── docs/                     # 文档
    └── superpowers/
        └── specs/
            └── 2026-07-20-restaurant-rating-design.md
```

---

## 9. 开发计划（7天 Vibe Coding）

> 使用 AI 辅助开发（Vibe Coding），大幅压缩开发周期。

| 天数 | 模块 | 交付物 |
|------|------|--------|
| Day 1 | 项目初始化 + 数据库 | 前后端脚手架、数据库表、基础路由 |
| Day 2 | 用户系统 | 注册/登录/JWT/个人资料 |
| Day 3 | 餐厅模块（后端） | 高德API集成、搜索/详情/同步API |
| Day 4 | 餐厅模块（前端） | 首页、列表页（含地图）、详情页 |
| Day 5 | 评价系统 | 评价CRUD、图片上传、前端评价表单 |
| Day 6 | 收藏 + 排行榜 + 管理员后台 | 收藏功能、排行榜、Admin面板 |
| Day 7 | 联调测试 + 部署 | 端到端测试、Nginx配置、上线 |

**总预计时间**: 7天

---

## 10. 风险与挑战

1. **高德API限制**: 需要关注API调用配额和费用
2. **图片存储**: 本地存储在流量大时可能成为瓶颈，后续可迁移到对象存储
3. **SEO问题**: SPA的SEO较弱，可考虑SSR或预渲染
4. **数据一致性**: 高德数据更新时需要同步机制
5. **并发性能**: 评价和评分计算需要优化，避免数据库压力过大

---

## 11. 成功标准

- 用户可以顺利注册登录
- 可以搜索全国餐厅（基于高德数据）
- 可以发表多维度评分和文字评价
- 可以上传评价图片
- 可以查看餐厅详情和评价列表
- 管理员可以审核评价和管理餐厅
- 网站响应速度 < 2秒
- 支持1000+并发用户

---

**文档版本**: 1.0  
**最后更新**: 2026-07-20
