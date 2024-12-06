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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const category_1 = __importDefault(require("../app/category/models/category"));
const User_1 = __importDefault(require("../app/user/models/User"));
dotenv_1.default.config(); // Load .env variables
// Connect to the database
mongoose_1.default.connect(process.env.MONGO_URI || '', {}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
// Seed Categories
const seedCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = [
        { name: 'Electronics' },
        { name: 'Home Appliances' },
        { name: 'Books' },
        { name: 'Clothing' },
        { name: 'Toys' }
    ];
    yield category_1.default.insertMany(categories);
    console.log('Categories seeded');
});
// Seed Users
const seedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const adminPassword = yield bcryptjs_1.default.hash('adminpassword', 10); // Hash password for admin
    const userPassword = yield bcryptjs_1.default.hash('userpassword', 10); // Hash password for normal user
    const users = [
        {
            username: 'admin',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin', // Set role to admin
        },
        {
            username: 'user',
            email: 'user@example.com',
            password: userPassword,
            role: 'user', // Set role to normal user
        },
    ];
    yield User_1.default.insertMany(users);
    console.log('Users seeded');
});
// Seed the database
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield seedCategories();
        yield seedUsers();
        console.log('Database seeded successfully');
        mongoose_1.default.connection.close(); // Close connection after seeding
    }
    catch (error) {
        console.error('Error seeding the database:', error);
        mongoose_1.default.connection.close();
    }
});
seedDatabase();
