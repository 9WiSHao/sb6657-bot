import 'koishi';

declare module 'koishi' {
    interface User {
        usage: Record<string, number>;
    }
    namespace Command {
        interface Config {
            minInterval?: number;
            maxUsage?: number;
        }
    }
}
