import express from 'express';
import { Api, userApi } from './apis';
import {
	ControllerFunction,
	MyRequest,
	UserController,
} from './controllers';

function registerApi<Req, Resp>(
	router: express.Router,
	api: Api<Req, Resp>,
	handler: ControllerFunction<Api<Req, Resp>>,
) {
	const { method, page, schema } = api;
	router[method](page, async (req, res) => {
		const raw = {
			...req.query,
			...req.body,
		};
		try {
			const body = await schema.validate(raw);
			const resp = await handler(new MyRequest(body));
			res.json(resp);
		} catch (e) {
			res.status(500).json(e);
		}
	});
}

const userRouter = express.Router();
const userController = new UserController();
registerApi(userRouter, userApi.get, userController.get);
registerApi(userRouter, userApi.update, userController.update);

export const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use('/user/', userRouter);
