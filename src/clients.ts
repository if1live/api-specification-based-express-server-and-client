import { Api, userApi } from './apis';
import fetch, { Response } from 'node-fetch';

type ClientFunction<T> = T extends Api<infer Req, infer Resp>
	? (body: Req) => Promise<Resp>
	: never;

type Client<T> = {
	[P in keyof T]: ClientFunction<T[P]>;
}

class BaseClient {
	constructor(protected readonly host: string) { }

	public handle<Req extends { [key: string]: any }, Resp>(
		api: Api<Req, Resp>,
	) {
		const fn: ClientFunction<Api<Req, Resp>> = async (req) => {
			const { method, resource, page } = api;
			const url = `${this.host}${resource}${page}`;

			let resp: Response;
			if (method === 'get') {
				const params = new URLSearchParams();
				const keys = Object.keys(req);
				for (const key of keys) {
					params.set(key, req[key]);
				}
				resp = await fetch(`${url}?${params.toString()}`);

			} else {
				resp = await fetch(url, {
					method: method,
					body: JSON.stringify(req),
					headers: {
						'Content-Type': 'application/json',
					},
				});
			}

			const text = await resp.text();
			try {
				return JSON.parse(text);
			} catch (e) {
				throw e;
			}
		};
		return fn;
	}
}

export class UserClient extends BaseClient implements Client<typeof userApi> {
	public get = this.handle(userApi.get);
	public update = this.handle(userApi.update);
}
