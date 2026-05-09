// Logging middleware utility

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzdW5rYXJhYWpheTg2QGdtYWlsLmNvbSIsImV4cCI6MTc3ODMwNjg3NCwiaWF0IjoxNzc4MzA1OTc0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOThiNjBlYTItZDkyYi00YTI4LWEzZDMtYzQwNTg0MWEwZTg4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3Vua2FyYSBhamF5Iiwic3ViIjoiZTAxMDYxMjctZTkxMi00MWYyLWI1NDktYWRmNjY3NWY5MGE3In0sImVtYWlsIjoic3Vua2FyYWFqYXk4NkBnbWFpbC5jb20iLCJuYW1lIjoic3Vua2FyYSBhamF5Iiwicm9sbE5vIjoiMjM0ODFhNTRnOCIsImFjY2Vzc0NvZGUiOiJlSmRDdUMiLCJjbGllbnRJRCI6ImUwMTA2MTI3LWU5MTItNDFmMi1iNTQ5LWFkZjY2NzVmOTBhNyIsImNsaWVudFNlY3JldCI6InJLbVNHVXFlV3BtSmpoUU0ifQ.kmaWJuOIuHClVUBTi7YgotACraFMU_ESX60g01IL6Nc";

export const getAuthorizationHeader = (): string => {
    return `Bearer ${ACCESS_TOKEN}`;
};

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