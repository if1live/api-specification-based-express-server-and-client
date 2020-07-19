import { Api, UserModel, userApi } from './apis';

export class MyRequest<T> {
	constructor(public readonly body: T) { }
}

export type ControllerFunction<T> = T extends Api<infer Req, infer Resp>
	? (req: MyRequest<Req>) => Promise<Resp>
	: never;

type Controller<T> = {
	[P in keyof T]: ControllerFunction<T[P]>;
}

const users: UserModel[] = [
	{ user_uid: '1', name: 'first' },
	{ user_uid: '2', name: 'second' },
];

const createUserController = (): Controller<typeof userApi> => ({
	get: async (req) => {
		const { user_uid } = req.body;
		const user = users.find(x => x.user_uid === user_uid);
		if (!user) { throw new Error('not found'); }
		return user;
	},
	update: async (req) => {
		const { user_uid, name } = req.body;
		const user = users.find(x => x.user_uid === user_uid);
		if (!user) { throw new Error('not found'); }
		user.name = name;
		return user;
	},
});

export const UserController: new () => Controller<typeof userApi> = function () {
	return createUserController();
} as any;
