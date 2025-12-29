import { Response } from "express";

export function handleQueryOutput(code: number, res: Response) {
    return function (err: any, results: any, fields: any) {
    if (err) {
        res.status(500).json({ error: err.message });
        return;
    }
    res.status(code).json(results);
    };
}

export function handleExists(res: Response) {
  return function (err: any, results: any, fields: any) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ "exists": results.length > 0 });
  };
}