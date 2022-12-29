import fastify from "fastify";
import hljs from "highlight.js";
import dotenv from "dotenv";
import cors from "@fastify/cors";

dotenv.config();
const server = fastify().register(cors);

type Body = {
    data: string
}

server.post<{
    Body: Body,
}>(
    "/",
    {
        preValidation: (req, _, done) => {
            const { data } = req.body;
            done(
                !(data && data.trim() && typeof data == "string")
                    ? new Error("body of code was invalid; expecting \"{ data: String })\"")
                    : undefined
            );
        },
    }, async (req, rep) => {
        const { data } = req.body;
        const result = hljs.highlightAuto(data);
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
