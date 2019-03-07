import axios, { AxiosResponse } from "axios";

const BASE_URL: string = "https://api.clinq.com";

export interface CreateIntegrationRequest {
	name: string;
	key: string;
	url: string;
}

export interface Integration {
	id: string;
	name: string;
	url: string;
	key: string;
}

export async function createIntegration(
	request: CreateIntegrationRequest,
	authorizationHeader: string
): Promise<Integration> {
	const response: AxiosResponse<Integration> = await axios.post<Integration>("/integrations/registered", request, {
		baseURL: BASE_URL,
		headers: { Authorization: authorizationHeader }
	});
	return response.data;
}
