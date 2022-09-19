import { PrismaClient } from "@prisma/client";
import express from "express";
import morgan from "morgan";
const PORT = process.env.PORT ?? 8080

const prisma = new PrismaClient()

const bootstrap = async () => {
    const app = express()

    app.use(morgan())
    app.use(express.json())

    app.route("/uploadData").post(async (req, res) => {
        const { min, max, title, type, options, step } = req.body


        try {

            const schema = await prisma.schema.create({
                data: {
                    ...req.body
                }
            })

            res.json({
                schema
            })

        } catch (error) {
            res.json({
                error
            })
        }
    })

    app.get("/getData/:id", async (req, res) => {
        const { id } = req.params

        try {
            if (!id) {
                return res.json({
                    damn: 'fuck'
                })
            }
            const schema = await prisma.schema.findUniqueOrThrow({
                where: {
                    id: parseInt(id.toString())
                }
            })

            res.json({
                schema
            })

        } catch (error) {
            console.log(error)
            res.json({
                error
            })
        }
    })




    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}

await bootstrap().then(async () => {
    await prisma.$disconnect()
})
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })