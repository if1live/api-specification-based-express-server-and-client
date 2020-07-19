# API specification based express server and client

## API spec

```ts
const userGetApi: Api<GetReq, UserModel> = {
	method: 'get',
	resource: '/user',
	page: '/get',
	schema: yup.object().shape<GetReq>({
		user_uid: yup.string().required(),
	}).required();
};

export const userApi = {
	get: userGetApi,
};
```

## http client

```ts
export class UserClient extends BaseClient implements Client<typeof userApi> {
	public get = this.handle(userApi.get);
}
```

## controller

```ts
const createUserController = (): Controller<typeof userApi> => ({
	get: async (req) => {
		const { user_uid } = req.body;
		const user = users.find(x => x.user_uid === user_uid);
		if (!user) { throw new Error('not found'); }
		return user;
	},
});
```

## express router

```ts
const userRouter = express.Router();
const userController = createUserController();
registerApi(userRouter, userApi.get, userController.get);
```
