import * as express from 'express';

export const expressAsync = (fn: (req: express.Request, res: express.Response, next: express.NextFunction) => any) =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };
