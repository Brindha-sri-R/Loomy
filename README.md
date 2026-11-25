# LOOMY | Modern Fashion, Timeless Style

<p align="center">
  <strong>Discover Your Style. Define Your Identity.</strong>
</p>

<p align="center">
  A modern full-stack fashion e-commerce platform built to deliver a seamless, elegant, and interactive online shopping experience.
</p>

---

## ✨ About LOOMY

**LOOMY** is a modern fashion e-commerce platform designed to bring together contemporary fashion, elegant design, and seamless shopping functionality.

From discovering new collections to managing shopping carts and placing orders, LOOMY provides an intuitive shopping experience through a clean interface, interactive product displays, and a reliable backend architecture.

The platform focuses on combining aesthetics with functionality, creating a digital fashion store that feels premium, responsive, and easy to use.

## 🚀 Key Features

### 🛍️ Shopping Experience
- Modern and responsive fashion storefront.
- Multiple product categories and collections.
- Interactive product cards and product details.
- Product search and category-based filtering.
- Product sorting options.
- Featured and newly added products.

### ❤️ User Experience
- User registration and login.
- Secure authentication using JWT.
- Personal shopping cart.
- Wishlist management.
- Individual user accounts.
- Order placement and order history.
- Form validation and error handling.
- Skeleton loading states for smoother browsing.

### ⚙️ Backend Functionality
- RESTful API architecture.
- MongoDB database integration.
- Server-side input validation.
- Protected API routes.
- Secure password handling.
- Server-side order total calculation.
- Centralized error handling.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Development and build tooling |
| JavaScript | Application logic |
| CSS | Styling and responsive UI |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | Database modeling |
| JWT | Authentication |

## 📂 Project Structure

```text
LOOMY/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── assets/
│   └── ...
│
├── public/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
│
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

## 💻 Getting Started

Follow these steps to run LOOMY locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Brindha-sri-R/Loomy.git
```

### 2. Navigate to the Project

```bash
cd Loomy
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Install Backend Dependencies

```bash
cd server
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

Replace the placeholder values with your own configuration.

**Important:** Never commit `.env` files, database credentials, or authentication secrets to GitHub.

### 6. Start the Backend

From the `server` directory, run:

```bash
node server.js
```

### 7. Start the Frontend

Open another terminal in the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔌 API Overview

LOOMY uses RESTful APIs to manage authentication, products, shopping carts, wishlists, and orders.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/me` | Get authenticated user |

### Products & Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Retrieve products |
| GET | `/api/products/:id` | Get product details |
| GET | `/api/products/search?q=` | Search products |
| GET | `/api/categories` | Retrieve categories |

Product listing also supports category filtering and sorting.

### Shopping Cart

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Retrieve cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:itemId` | Update cart quantity |

### Wishlist

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/wishlist` | Retrieve wishlist |
| POST | `/api/wishlist` | Add item to wishlist |
| DELETE | `/api/wishlist/:productId` | Remove wishlist item |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place an order |
| GET | `/api/orders` | Retrieve user orders |
| GET | `/api/orders/:id` | Retrieve order details |

Protected endpoints require a valid authentication token.

## 🔐 Security & Validation

Security and data integrity are important parts of LOOMY.

- JWT-based user authentication.
- Protected routes for authenticated operations.
- Password hashing.
- Server-side input validation.
- Duplicate account detection.
- Server-side order total calculation.
- Environment-based configuration.
- Consistent API error responses.

## 📱 Responsive Design

LOOMY aims to provide a consistent shopping experience across:

- Desktop computers
- Laptops
- Tablets
- Mobile devices

## 🧪 Testing & Verification

The project has undergone frontend and backend verification.

| Verification | Result |
|---|---|
| Frontend lint | Passed with warnings |
| Production build | Passed |
| Backend syntax check | Passed |
| MongoDB connection | Passed |
| Public product APIs | Passed |
| Authentication validation | Tested |
| Cart functionality | Tested |
| Wishlist functionality | Tested |
| Order functionality | Tested |

**Note:** Authenticated end-to-end tests passed in an isolated run with a temporary JWT secret. Production configuration and deployment verification remain separate tasks.

## 🌐 Deployment

LOOMY is structured with separate frontend and backend services within a single repository.

The deployment configuration is designed around Vercel's multi-service architecture.

Production deployment requires:

- MongoDB connection configuration.
- Secure JWT secret.
- Correct frontend and backend service routing.
- Production environment variables.
- Verification of deployed API endpoints.

## 🔮 Future Enhancements

- Advanced product recommendations.
- Enhanced product filtering.
- More fashion collections.
- Improved shopping experience.
- Additional account management features.
- Performance and accessibility improvements.


<p align="center">
  <strong>LOOMY</strong>
  <br/>
  Modern Fashion. Timeless Identity.
  <br/><br/>
  Made with passion and creativity.
</p>
