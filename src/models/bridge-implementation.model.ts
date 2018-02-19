export interface IBridgeImplementation {
	getContacts: (token: string) => Promise<any>;
}
