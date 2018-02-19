export interface BridgeImplementation {
	getContacts: (token: string) => Promise<any>;
}
