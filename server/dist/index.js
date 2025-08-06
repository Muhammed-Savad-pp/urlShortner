"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const urlRoutes_1 = __importDefault(require("./routes/urlRoutes"));
dotenv_1.default.config();
const port = process.env.PORT;
const frontentUrl = process.env.FRONTENT_URL;
const mongoUrl = process.env.MONGO_URL ?? '';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: frontentUrl,
    credentials: true,
}));
app.use('/api/auth', userRoutes_1.default);
app.use('/api/url', urlRoutes_1.default);
mongoose_1.default
    .connect(mongoUrl)
    .then(() => console.log('MongDB connected'))
    .catch((err) => console.log(err));
app.listen(port, () => {
    console.log(`server is Running on http://localhost:${port}`);
});
