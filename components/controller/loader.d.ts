interface LoadOptions {
    [key: string]: string | number | undefined;
}
interface RequestParams {
    endpoint: string;
    options?: LoadOptions;
}
declare class Loader {
    private readonly baseLink;
    private readonly options;
    constructor(baseLink: string, options: LoadOptions);
    getResp<T>({ endpoint, options }: RequestParams, callback: (data: T) => void): void;
    private errorHandler;
    private makeUrl;
    private load;
}
export default Loader;
//# sourceMappingURL=loader.d.ts.map