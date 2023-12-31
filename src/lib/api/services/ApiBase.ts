import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { dev } from '$app/environment';
import { wsConnectionId } from '$lib/store';
import { get } from 'svelte/store';

export default class ApiService {
	private static instance = axios.create({
		timeout: 5000,
		headers: {
			'Content-Type': 'application/json'
		}
	});

	private static BACKEND_PORT = 80;

	private static handleResponse(response: AxiosResponse, info: string | undefined = undefined) {
		if (response.status < 200 || response.status >= 300) {
			console.error(
				`API Error: ${info ? `[${info}] ` : ''}${response.status}-${response.statusText}`
			);
		}
	}

	protected static async get<T>(endpoint: string): Promise<T> {
		try {
			const headers = { 'X-Ws-Connection-Id': get(wsConnectionId) }; // Custom header
			const response = await this.instance.get<T>(endpoint, {
				headers,
				baseURL: `http://${
					dev ? `${window.location.hostname}:${this.BACKEND_PORT}` : window.location.host
				}/`
			});
			this.handleResponse(response, `get:${endpoint}`);
			return response.data;
		} catch (error) {
			console.error(`API Error on get:${endpoint}`);
			throw error;
		}
	}

	protected static async post<T>(endpoint: string, body: any): Promise<T> {
		try {
			const headers = { 'X-Ws-Connection-Id': get(wsConnectionId) }; // Custom header
			const response = await this.instance.post<T>(endpoint, body, {
				headers,
				baseURL: `http://${
					dev ? `${window.location.hostname}:${this.BACKEND_PORT}` : window.location.host
				}/`
			});
			this.handleResponse(response, `post:${endpoint}`);
			return response.data;
		} catch (error) {
			console.error(`API Error on post:${endpoint}`, error);
			throw error;
		}
	}
}
