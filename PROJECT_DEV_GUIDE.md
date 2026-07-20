# 餐厅评分网站 - 项目开发文档

## 📋 项目概述

### 项目名称
餐厅评分网站（Restaurant Rating）

### 项目简介
一个全国范围的餐厅评分平台，用户可以搜索餐厅、查看多维度评分（口味/环境/服务）、发表评价并上传图片。系统集成高德地图API获取餐厅基础信息，支持地图展示和位置服务。

### 核心功能
- ✅ 全国范围餐厅搜索
- ✅ 多维度评分系统（口味、环境、服务各1-5分）
- ✅ 文字评价 + 图片上传
- ✅ 高德地图集成（餐厅信息 + 地图展示）
- ✅ 用户注册登录 + 管理员后台
- ✅ 收藏功能
- ✅ 排行榜（评分最高、评价最多、近期热门）

### 数据来源
- **高德地图API**: 获取餐厅基础信息（名称、地址、经纬度、分类等）
- **管理员手动添加**: 补充高德没有的餐厅
- **用户生成内容**: 评分、评价、图片

---

## 🛠️ 技术栈

### 前端
- **框架**: React 18
- **路由**: React Router v6
- **HTTP客户端**: Axios
- **UI组件库**: Ant Design
- **地图服务**: 高德地图 JS API 2.0

### 后端
- **运行时**: Node.js
- **框架**: Express
- **ORM**: Sequelize
- **数据库**: MySQL
- **认证**: JWT (JSON Web Token)
- **文件上传**: Multer
- **HTTP客户端**: Axios（调用高德API）

### 部署
- **服务器**: 腾讯云服务器
- **反向代理**: Nginx
- **进程管理**: PM2
- **操作系统**: Linux (推荐 Ubuntu/CentOS)

---

## 📁 项目结构

```
restaurant-rating/
├── frontend/                          # React前端项目
│   ├── public/                        # 静态资源
│   │   └── index.html                 # HTML模板
│   ├── src/                           # 源代码
│   │   ├── components/                # 通用组件
│   │   │   ├── Header.jsx             # 顶部导航栏
│   │   │   ├── StarRating.jsx         # 星级评分组件
│   │   │   ├── RestaurantCard.jsx     # 餐厅卡片组件
│   │   │   └── AMap.jsx               # 高德地图组件
│   │   ├── pages/                     # 页面组件
│   │   │   ├── Home.jsx               # 首页
│   │   │   ├── RestaurantList.jsx     # 餐厅列表页
│   │   │   ├── RestaurantDetail.jsx   # 餐厅详情页
│   │   │   ├── Login.jsx              # 登录页
│   │   │   ├── Register.jsx           # 注册页
│   │   │   ├── Profile.jsx            # 用户中心
│   │   │   └── admin/                 # 管理员页面
│   │   │       ├── ReviewManage.jsx   # 评价管理
│   │   │       ├── RestaurantManage.jsx # 餐厅管理
│   │   │       └── UserManage.jsx     # 用户管理
│   │   ├── services/                  # API服务层
│   │   │   ├── api.js                 # Axios实例配置
│   │   │   ├── auth.js                # 认证API
│   │   │   ├── restaurant.js          # 餐厅API
│   │   │   ├── review.js              # 评价API
│   │   │   ├── favorite.js            # 收藏API
│   │   │   └── ranking.js             # 排行榜API
│   │   ├── context/                   # React Context
│   │   │   └── AuthContext.jsx        # 认证上下文
│   │   ├── utils/                     # 工具函数
│   │   │   └── helpers.js             # 辅助函数
│   │   ├── App.jsx                    # 根组件
│   │   └── index.js                   # 入口文件
│   ├── package.json                   # 依赖配置
│   └── .env                           # 环境变量
│
├── backend/                           # Node.js后端项目
│   ├── src/                           # 源代码
│   │   ├── config/                    # 配置文件
│   │   │   ├── database.js            # 数据库配置
│   │   │   └── amap.js                # 高德API配置
│   │   ├── models/                    # 数据模型
│   │   │   ├── index.js               # 模型初始化
│   │   │   ├── User.js                # 用户模型
│   │   │   ├── Restaurant.js          # 餐厅模型
│   │   │   ├── Review.js              # 评价模型
│   │   │   ├── ReviewImage.js         # 评价图片模型
│   │   │   ├── Favorite.js            # 收藏模型
│   │   │   └── Category.js            # 分类模型
│   │   ├── controllers/               # 控制器
│   │   │   ├── authController.js      # 认证控制器
│   │   │   ├── restaurantController.js # 餐厅控制器
│   │   │   ├── reviewController.js    # 评价控制器
│   │   │   ├── favoriteController.js  # 收藏控制器
│   │   │   └── rankingController.js   # 排行榜控制器
│   │   ├── routes/                    # 路由
│   │   │   ├── index.js               # 路由入口
│   │   │   ├── auth.js                # 认证路由
│   │   │   ├── restaurants.js         # 餐厅路由
│   │   │   ├── reviews.js             # 评价路由
│   │   │   ├── favorites.js           # 收藏路由
│   │   │   └── rankings.js            # 排行榜路由
│   │   ├── middleware/                # 中间件
│   │   │   ├── auth.js                # JWT认证中间件
│   │   │   ├── admin.js               # 管理员权限中间件
│   │   │   └── upload.js              # 文件上传中间件
│   │   ├── services/                  # 业务逻辑层
│   │   │   └── amapService.js         # 高德API服务
│   │   └── app.js                     # Express入口文件
│   ├── uploads/                       # 图片上传目录
│   ├── package.json                   # 依赖配置
│   └── .env                           # 环境变量
│
├── nginx/                             # Nginx配置
│   └── default.conf                   # Nginx配置文件
│
└── docs/                              # 项目文档
    └── superpowers/
        ├── specs/                     # 设计文档
        │   └── 2026-07-20-restaurant-rating-design.md
        └── plans/                     # 实施计划
            └── 2026-07-20-restaurant-rating-plan.md
```

---

## 🗄️ 数据库设计

### 数据表结构

#### 1. users - 用户表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| email | VARCHAR(100) | 邮箱，唯一 |
| password_hash | VARCHAR(255) | 密码哈希 |
| role | ENUM('user', 'admin') | 角色，默认user |
| avatar | VARCHAR(255) | 头像路径 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### 2. restaurants - 餐厅表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| amap_id | VARCHAR(50) | 高德POI ID，唯一 |
| name | VARCHAR(200) | 餐厅名称 |
| address | VARCHAR(500) | 地址 |
| phone | VARCHAR(50) | 电话 |
| category | VARCHAR(100) | 分类 |
| latitude | DECIMAL(10,7) | 纬度 |
| longitude | DECIMAL(10,7) | 经度 |
| city | VARCHAR(50) | 城市 |
| district | VARCHAR(50) | 区域 |
| avg_taste | DECIMAL(3,2) | 平均口味分 |
| avg_env | DECIMAL(3,2) | 平均环境分 |
| avg_service | DECIMAL(3,2) | 平均服务分 |
| avg_total | DECIMAL(3,2) | 综合平均分 |
| review_count | INT | 评价数量 |
| image_count | INT | 图片数量 |
| source | ENUM('amap', 'manual') | 数据来源 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### 3. reviews - 评价表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| user_id | INT | 用户ID，外键 |
| restaurant_id | INT | 餐厅ID，外键 |
| taste_score | TINYINT | 口味评分(1-5) |
| env_score | TINYINT | 环境评分(1-5) |
| service_score | TINYINT | 服务评分(1-5) |
| content | TEXT | 评价内容 |
| total_score | DECIMAL(3,2) | 综合分(加权计算) |
| status | ENUM('pending','approved','rejected') | 状态 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**评分权重**: 口味40% + 环境30% + 服务30%

#### 4. review_images - 评价图片表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| review_id | INT | 评价ID，外键 |
| image_path | VARCHAR(255) | 图片路径 |
| sort_order | INT | 排序 |

#### 5. favorites - 收藏表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| user_id | INT | 用户ID，外键 |
| restaurant_id | INT | 餐厅ID，外键 |
| created_at | TIMESTAMP | 创建时间 |

**唯一约束**: (user_id, restaurant_id)

#### 6. categories - 分类表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(50) | 分类名称 |
| parent_id | INT | 父分类ID |
| icon | VARCHAR(50) | 图标 |

---

## 🔌 API接口文档

### 基础信息
- **Base URL**: `http://localhost:3001/api`
- **认证方式**: JWT Bearer Token
- **请求头**: `Authorization: Bearer <token>`

### 1. 认证模块

#### 注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response:
{
  "user": { "id", "username", "email", "role" },
  "token": "string"
}
```

#### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response:
{
  "user": { "id", "username", "email", "role" },
  "token": "string"
}
```

#### 获取当前用户信息
```http
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "user": { "id", "username", "email", "role", "avatar" }
}
```

#### 更新个人资料
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",
  "avatar": "string"
}

Response:
{
  "user": { "id", "username", "email", "role", "avatar" }
}
```

### 2. 餐厅模块

#### 搜索餐厅
```http
GET /api/restaurants/search?keyword=火锅&city=成都&page=1&limit=20

Response:
{
  "restaurants": [...],
  "total": 100,
  "page": 1
}
```

#### 获取餐厅详情
```http
GET /api/restaurants/:id

Response:
{
  "restaurant": {
    "id", "name", "address", "phone", "category",
    "latitude", "longitude", "city", "district",
    "avg_taste", "avg_env", "avg_service", "avg_total",
    "review_count", "image_count",
    "Reviews": [...]
  }
}
```

#### 获取附近餐厅
```http
GET /api/restaurants/nearby?latitude=30.57&longitude=104.07&radius=3

Response:
{
  "restaurants": [...]
}
```

#### 从高德同步餐厅（管理员）
```http
POST /api/restaurants/sync-amap
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "city": "成都",
  "keyword": "火锅",
  "category": "餐饮"
}

Response:
{
  "synced": 20,
  "total": 100
}
```

#### 手动添加餐厅（管理员）
```http
POST /api/restaurants
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "string",
  "address": "string",
  "phone": "string",
  "category": "string",
  "latitude": 30.57,
  "longitude": 104.07,
  "city": "成都",
  "district": "武侯区"
}

Response:
{
  "restaurant": {...}
}
```

### 3. 评价模块

#### 发表评价
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: multipart/form-data

restaurant_id: 1
taste_score: 5
env_score: 4
service_score: 5
content: "很好吃！"
images: [file1, file2, ...]

Response:
{
  "review": {...}
}
```

#### 获取餐厅评价列表
```http
GET /api/reviews/:restaurantId?page=1&limit=10&sort=latest

Response:
{
  "reviews": [...],
  "total": 50,
  "page": 1
}
```

#### 编辑评价
```http
PUT /api/reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "taste_score": 5,
  "env_score": 4,
  "service_score": 5,
  "content": "更新后的评价"
}

Response:
{
  "review": {...}
}
```

#### 删除评价
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>

Response:
{
  "success": true
}
```

#### 审核评价（管理员）
```http
PUT /api/reviews/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "approved" | "rejected"
}

Response:
{
  "review": {...}
}
```

### 4. 收藏模块

#### 添加收藏
```http
POST /api/favorites/:restaurantId
Authorization: Bearer <token>

Response:
{
  "success": true
}
```

#### 取消收藏
```http
DELETE /api/favorites/:restaurantId
Authorization: Bearer <token>

Response:
{
  "success": true
}
```

#### 获取收藏列表
```http
GET /api/favorites?page=1&limit=10
Authorization: Bearer <token>

Response:
{
  "favorites": [...],
  "total": 20,
  "page": 1
}
```

### 5. 排行榜模块

#### 评分最高
```http
GET /api/rankings/top-rated?city=成都&limit=10

Response:
{
  "restaurants": [...]
}
```

#### 评价最多
```http
GET /api/rankings/most-reviewed?city=成都&limit=10

Response:
{
  "restaurants": [...]
}
```

#### 近期热门
```http
GET /api/rankings/trending?city=成都&limit=10&days=7

Response:
{
  "restaurants": [...]
}
```

---

## 🚀 环境要求

### 开发环境
- **Node.js**: >= 16.x
- **npm**: >= 8.x
- **MySQL**: >= 8.0
- **Git**: >= 2.x

### 生产环境（腾讯云服务器）
- **操作系统**: Ubuntu 20.04+ 或 CentOS 7+
- **Node.js**: >= 16.x
- **MySQL**: >= 8.0
- **Nginx**: >= 1.18
- **PM2**: >= 5.x

---

## 📦 安装步骤

### 1. 克隆项目
```bash
git clone <repository-url>
cd restaurant-rating
```

### 2. 安装后端依赖
```bash
cd backend
npm install
```

### 3. 配置后端环境变量
创建 `backend/.env` 文件：
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

### 4. 创建数据库
```bash
mysql -u root -p
```
```sql
CREATE DATABASE restaurant_rating CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 同步数据库表
```bash
cd backend
node src/scripts/sync-db.js
```

### 6. 安装前端依赖
```bash
cd frontend
npm install
```

### 7. 配置前端环境变量
创建 `frontend/.env` 文件：
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_AMAP_KEY=your_amap_js_api_key
```

### 8. 配置高德地图
在 `frontend/public/index.html` 的 `<head>` 标签中添加：
```html
<script src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_JS_KEY"></script>
```

---

## 💻 开发指南

### 启动后端服务
```bash
cd backend
npm run dev
```
服务将运行在 `http://localhost:3001`

### 启动前端服务
```bash
cd frontend
npm start
```
应用将运行在 `http://localhost:3000`

### 开发流程
1. 确保MySQL服务已启动
2. 启动后端服务（端口3001）
3. 启动前端服务（端口3000）
4. 访问 http://localhost:3000 进行开发

### 代码规范
- 前端使用ESLint + Prettier
- 后端使用ESLint
- 提交前运行 `npm run lint` 检查代码

---

## 🌐 部署指南

### 1. 服务器准备
```bash
# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装MySQL
sudo apt install mysql-server

# 安装Nginx
sudo apt install nginx

# 安装PM2
sudo npm install -g pm2
```

### 2. 上传代码
```bash
# 方式一：使用Git
git clone <repository-url> /var/www/restaurant-rating

# 方式二：使用SCP
scp -r restaurant-rating/* user@server:/var/www/restaurant-rating/
```

### 3. 配置MySQL
```bash
mysql -u root -p
```
```sql
CREATE DATABASE restaurant_rating CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON restaurant_rating.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
```

### 4. 配置后端
```bash
cd /var/www/restaurant-rating/backend
npm install
cp .env.example .env
# 编辑 .env 填入实际配置
node src/scripts/sync-db.js
```

### 5. 构建前端
```bash
cd /var/www/restaurant-rating/frontend
npm install
npm run build
```

### 6. 启动后端服务
```bash
cd /var/www/restaurant-rating/backend
pm2 start src/app.js --name restaurant-api
pm2 save
pm2 startup
```

### 7. 配置Nginx
```bash
sudo cp /var/www/restaurant-rating/nginx/default.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/default.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. 验证部署
访问 `http://your-domain.com`，确认：
- ✅ 首页正常加载
- ✅ API请求正常
- ✅ 图片上传和显示正常
- ✅ 地图正常显示

---

## 📅 开发计划（7天）

| 天数 | 模块 | 交付物 | 状态 |
|------|------|--------|------|
| **Day 1** | 项目初始化 + 数据库 | 前后端脚手架、6张数据库表、基础路由 | ⏳ 待开始 |
| **Day 2** | 用户系统 | 注册/登录/JWT认证/个人资料页面 | ⏳ 待开始 |
| **Day 3** | 餐厅模块（后端） | 高德API集成、搜索/详情/同步API | ⏳ 待开始 |
| **Day 4** | 餐厅模块（前端） | 首页、列表页（含地图）、详情页 | ⏳ 待开始 |
| **Day 5** | 评价系统 | 多维度评分、图片上传、评分计算 | ⏳ 待开始 |
| **Day 6** | 收藏 + 排行榜 + 管理员 | 收藏功能、排行榜、Admin面板 | ⏳ 待开始 |
| **Day 7** | 联调测试 + 部署 | 端到端测试、Nginx/PM2、上线 | ⏳ 待开始 |

---

## 🔑 关键配置

### 高德地图API Key申请
1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册账号并创建应用
3. 申请两个Key：
   - **Web服务**: 用于后端调用（搜索、详情）
   - **Web端(JS API)**: 用于前端地图展示

### JWT密钥生成
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 数据库密码
- 开发环境：可以使用简单密码
- 生产环境：必须使用强密码（16位以上，包含大小写字母、数字、特殊字符）

---

## 🐛 常见问题

### 1. 前端跨域问题
**开发环境**: 在 `frontend/.env` 中配置 `REACT_APP_API_URL=http://localhost:3001/api`

**生产环境**: 通过Nginx反向代理解决

### 2. MySQL连接失败
```bash
# 检查MySQL服务状态
sudo systemctl status mysql

# 检查数据库用户权限
mysql -u root -p
SELECT user, host FROM mysql.user;
```

### 3. 图片上传失败
```bash
# 检查uploads目录权限
chmod 755 backend/uploads

# 检查文件大小限制（默认5MB）
# 检查Nginx配置
client_max_body_size 10M;
```

### 4. 地图不显示
- 检查高德JS API Key是否正确
- 检查Key的配额和域名白名单
- 浏览器控制台查看错误信息

### 5. 端口被占用
```bash
# 查看端口占用
lsof -i :3001
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

---

## 📝 开发检查清单

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

## 📚 参考文档

- [React官方文档](https://react.dev/)
- [Express官方文档](https://expressjs.com/)
- [Sequelize官方文档](https://sequelize.org/)
- [Ant Design官方文档](https://ant.design/)
- [高德地图API文档](https://lbs.amap.com/api)
- [PM2官方文档](https://pm2.keymetrics.io/)

---

## 📄 相关文档

- [设计文档](./docs/superpowers/specs/2026-07-20-restaurant-rating-design.md)
- [实施计划](./docs/superpowers/plans/2026-07-20-restaurant-rating-plan.md)

---

## 👥 团队

- **开发**: AI辅助开发（Vibe Coding）
- **预计周期**: 7天

---

## 📞 支持

如有问题，请查看：
1. 本文档的"常见问题"部分
2. 设计文档中的"风险与挑战"部分
3. 实施计划中的详细步骤

---

**文档版本**: 1.0  
**最后更新**: 2026-07-20  
**项目状态**: 开发中
