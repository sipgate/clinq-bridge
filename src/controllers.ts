import { Request, Response } from "express";

export default impl => ({
	async handleContacts(req: Request, res: Response) {
		const contacts = await impl.getContacts();

		res.send(contacts);
	}
});
