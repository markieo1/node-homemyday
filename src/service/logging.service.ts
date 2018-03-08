import winston = require('winston');

export class LoggingService {
    private logger;

    public LoggingService() {
        this.logger = new winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: 'info.log'})
            ]
        });
    }

    public Log(msg: string): void {
        this.logger.log({
            level: 'info',
            message: msg
        });
    }
}
