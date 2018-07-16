import axios, { AxiosResponse } from "axios";

const BASE_URL: string = "https://api.sipgate.com/v2/";

export interface CreateIntegrationRequest {
	crm: string;
	token: string;
	url: string;
}

export interface Integration {
	id: string;
	crm: string;
	url: string;
	token: string;
}

export async function createIntegration(
	request: CreateIntegrationRequest,
	authorizationHeader: string
): Promise<Integration> {
	const response: AxiosResponse<Integration> = await axios.post<Integration>("/crm-bridge/tokens", request, {
		baseURL: BASE_URL,
		headers: { Authorization: authorizationHeader }
	});
	return response.data;
}
