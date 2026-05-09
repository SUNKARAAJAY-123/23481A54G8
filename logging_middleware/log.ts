// Logging middleware utility

export interface LogEntry {
    level: 'info' | 'warn' | 'error';
    message: string;
    timestamp: Date;
    data?: any;
}

export class Logger {
    private logs: LogEntry[] = [];

    log(level: LogEntry['level'], message: string, data?: any) {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date(),
            data
        };
        this.logs.push(entry);
        console.log(`[${level.toUpperCase()}] ${message}`, data || '');
    }

    info(message: string, data?: any) {
        this.log('info', message, data);
    }

    warn(message: string, data?: any) {
        this.log('warn', message, data);
    }

    error(message: string, data?: any) {
        this.log('error', message, data);
    }

    getLogs(): LogEntry[] {
        return this.logs;
    }

    clearLogs() {
        this.logs = [];
    }
}

export const logger = new Logger();