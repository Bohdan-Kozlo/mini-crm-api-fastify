import { buildServer } from "./server";


async function main() {
    const server = await buildServer();

    try {
        await server.listen({ port: 3000, host: '0.0.0.0' })
        server.log.info('Server is running on port 3000')
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }

    const signals = ['SIGINT', 'SIGTERM'] as const;
    for (const signal of signals) {
        process.on(signal, () => {
            server.log.info(`${signal} signal received, closing HTTP server...`);
            server.close().then(() => {
                server.log.info('HTTP server closed');
                process.exit(0);
            });
        });
    }
}

main();

