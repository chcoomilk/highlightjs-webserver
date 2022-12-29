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
const server = (0, fastify_1.default)().register(cors_1.default);
server.post("/", {
    preValidation: (req, _, done) => {
        const { data } = req.body;
        done(!(data && data.trim() && typeof data == "string")
            ? new Error("body of code was invalid; expecting \"{ data: String })\"")
            : undefined);
    },
}, async (req, rep) => {
    const { data } = req.body;
    const result = highlight_js_1.default.highlightAuto(data);
    result.illegal
        ? rep.status(200).send({ data, msg: "data was illegal, returned previous data" })
        : rep.status(200).send({ data: result.value });
});
server.listen({ host: process.env.HOST || "localhost", port: Number(process.env.PORT) || 0 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
