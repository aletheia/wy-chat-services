/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject, injectable} from 'tsyringe';
import {Logger as WLogger, createLogger, format, transports} from 'winston';
import {Config} from '../config';

@injectable()
export class Logger {
  private logger: WLogger;

  constructor(@inject('config') config: Config) {
    this.logger = createLogger({
      level: config.logLevel,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({stack: true}),
        //format.splat()
        format.json()
      ),
      //   defaultMeta: {service: config.serviceName},
      transports: [
        new transports.Console(),
        new transports.File({filename: 'error.log', level: 'error'}),
        new transports.File({filename: 'log.log'}),
      ],
    });
  }

  public info(message: any, meta?: any) {
    this.logger.info(message, meta);
  }

  public error(message: any, meta?: any) {
    this.logger.error(message, meta);
  }

  public warn(message: any, meta?: any) {
    this.logger.warn(message, meta);
  }

  public debug(message: any, meta?: any) {
    this.logger.debug(message, meta);
  }

  public verbose(message: any, meta?: any) {
    this.logger.verbose(message, meta);
  }

  public silly(message: any, meta?: any) {
    this.logger.silly(message, meta);
  }

  public log(level: string, message: any, meta?: any) {
    this.logger.log(level, message, meta);
  }
}
