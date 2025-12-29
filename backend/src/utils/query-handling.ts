import { Response } from "express";

export function handleQueryOutput(code: number, res: Response){
    return function (err: any, results: any, res: Response) {
    if (err) {
        res.status(500).json({ error: err.message });
        return;
    }
    res.status(code).json(results);
    };
}