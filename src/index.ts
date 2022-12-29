import fastify from "fastify";
import hljs from "highlight.js";
import dotenv from "dotenv";
import cors from "@fastify/cors";

dotenv.config();
const server = fastify().register(cors);

type Body = {
    code: string
}

server.post<{
    Body: Body,
}>(
    "/",
    {
        preValidation: (req, _, done) => {
            const { code } = req.body;
            done(
                !(code && code.trim())
                    ? new Error("body of code can't be empty; expect({ code: String })")
                    : undefined
            );
        },
    }, async (req, rep) => {
        const { code } = req.body;
        const data = hljs.highlightAuto(code);
        rep.status(200).send({ value: data.value });
    });

server.listen({ host: process.env.HOST, port: Number(process.env.PORT) || 0 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Server listening at ${address}`);
});
