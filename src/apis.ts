import yup = require('yup');

export type Method = 'get' | 'post' | 'delete' | 'put';

export interface Api<Req, Resp> {
	method: Method;
	// url = resource + page
	resource: string;
	page: string;
	schema: yup.Schema<Req>;
}

interface GetReq {
	user_uid: string;
}

const userGetSchema = yup.object().shape<GetReq>({
	user_uid: yup.string().required(),
}).required();

interface UpdateReq {
	user_uid: string;
	name: string;
}

const userUpdateSchema = yup.object().shape<UpdateReq>({
	user_uid: yup.string().required(),
	name: yup.string().required(),
}).required();

export interface UserModel {
	user_uid: string;
	name: string;
}

const userGetApi: Api<GetReq, UserModel> = {
	method: 'get',
	resource: '/user',
	page: '/get',
	schema: userGetSchema,
};

const userUpdateApi: Api<UpdateReq, UserModel> = {
	method: 'post',
	resource: '/user',
	page: '/update',
	schema: userUpdateSchema,
};

export const userApi = {
	get: userGetApi,
	update: userUpdateApi,
};
