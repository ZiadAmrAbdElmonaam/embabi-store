"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = require("../controllers/signup");
const verifyEmail_1 = require("../controllers/verifyEmail");
const router = express_1.default.Router();
// Add a test route to verify the router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working' });
});
router.post('/signup', signup_1.signup);
router.post('/verify-email', verifyEmail_1.verifyEmail);
// Log the routes when they're created
console.log('Auth routes registered:', router.stack.map(r => { var _a; return (_a = r.route) === null || _a === void 0 ? void 0 : _a.path; }));
exports.default = router;
