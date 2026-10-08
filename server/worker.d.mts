declare const worker: { fetch(request: Request, env: any, context: any): Promise<Response> };
export default worker;
