interface LoadOptions {
    [key: string]: string | number | undefined;
}

interface RequestParams {
    endpoint: string;
    options?: LoadOptions;
}
//загрузчик данных (делает запросы)
class Loader {
    private readonly baseLink: string;
    private readonly options: LoadOptions;

    constructor(baseLink: string, options: LoadOptions) {
        this.baseLink = baseLink;
        this.options = options;
    }
    //дженерик потому что я не знаю заранее, какой тип данных вернёт сервер
    public getResp<T>({ endpoint, options = {} }: RequestParams, callback: (data: T) => void): void {
        this.load<T>('GET', endpoint, callback, options);
    }
    //пришла ли ошибка от сервера
    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404) {
                console.error(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            }
            throw new Error(res.statusText);
        }
        return res;
    }
    //собирает строку URL, для отправки запроса на сервер
    private makeUrl(options: LoadOptions, endpoint: string): string {
        const urlOptions = { ...this.options, ...options };
        const params = new URLSearchParams();

        Object.entries(urlOptions).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, String(value));
            }
        });

        return `${this.baseLink}${endpoint}?${params.toString()}`;
    }
    //Самое главн - Делает сам запрос к серверу.
    private load<T>(method: string, endpoint: string, callback: (data: T) => void, options: LoadOptions = {}): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then((res) => this.errorHandler(res))
            .then((res) => res.json() as Promise<T>)
            .then((data: T) => callback(data))
            .catch((err) => console.error(err));
    }
}

export default Loader;
