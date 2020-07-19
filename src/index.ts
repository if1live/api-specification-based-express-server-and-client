import { app } from './app';
import { UserClient } from './clients';

app.listen(3000, async () => {
	console.log('listen 127.0.0.1:3000');

	const client = new UserClient('http://127.0.0.1:3000');
	console.log('update', await client.update({ user_uid: '1', name: 'hello' }));
	console.log('get', await client.get({ user_uid: '1' }));
});
