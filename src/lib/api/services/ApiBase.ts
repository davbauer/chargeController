

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type Config from "../models/Config";

export default class ApiService {

    private static instance = axios.create({
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    private static handleResponse(response: AxiosResponse, info: string | undefined = undefined) {
        if (response.status < 200 || response.status >= 300) {
            console.error(`API Error: ${info ? `[${info}] ` : ''}${response.status}-${response.statusText}`);
        }
    }

    protected static async get<T>(baseURL: string, endpoint: string): Promise<T> {
        try {
            const response = await this.instance.get<T>(endpoint, {
                baseURL: `http://${baseURL}:2000/`
            });
            this.handleResponse(response, `get:${endpoint}`);
            return response.data;
        } catch (error) {
            console.error(`API Error on get:${endpoint}`);
            throw error;
        }
    }

    protected static async post<T>(baseURL: string, endpoint: string, body: any): Promise<T> {
        try {
            const response = await this.instance.post<T>(endpoint, body, {
                baseURL: `http://${baseURL}:2000/`
            });
            this.handleResponse(response, `post:${endpoint}`);
            return response.data;
        } catch (error) {
            console.error(`API Error on post:${endpoint}`, error);
            throw error;
        }
    }
}
