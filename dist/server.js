"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const categoryRoutes_1 = __importDefault(require("./app/category/routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("./app/product/routes/productRoutes"));
const authRoutes_1 = __importDefault(require("./app/user/routes/authRoutes"));
const orderRoutes_1 = __importDefault(require("./app/order/routes/orderRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200'
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/auth', authRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Basic test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running' });
});
// Log all registered routes
console.log('All registered routes:');
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Direct route: ${middleware.route.path}`);
    }
    else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                const path = handler.route.path;
                const methods = Object.keys(handler.route.methods);
                console.log(`Router route: ${methods} ${path}`);
            }
        });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Connect to MongoDB and start server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Test URL: http://localhost:${PORT}/test`);
            console.log(`Auth routes base URL: http://localhost:${PORT}/api/auth`);
        });
    }
    catch (error) {
        console.error('Could not start the server:', error);
        process.exit(1);
    }
});
startServer();
exports.default = app;
