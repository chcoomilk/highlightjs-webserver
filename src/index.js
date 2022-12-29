"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const highlight_js_1 = __importDefault(require("highlight.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("@fastify/cors"));
dotenv_1.default.config();
const server = (0, fastify_1.default)();
server.register(cors_1.default);
server.post("/", {
    preValidation: (req, _, done) => {
        const { code } = req.body;
        done(!(code && code.trim())
            ? new Error("body of code can't be empty; expect({ code: String })")
            : undefined);
    },
}, async (req, rep) => {
    const { code } = req.body;
    const data = highlight_js_1.default.highlightAuto(code);
    rep.status(201).send({ value: data.value });
});
server.listen({ port: Number(process.env.PORT) || 0 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
