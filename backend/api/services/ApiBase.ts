import axios from 'axios';
import type { AxiosResponse } from 'axios';
import xml2js from 'xml2js';
import errorLog from '../../functions/errorLog';

export default class ApiService {
	private static instance = axios.create({
		timeout: 5000,
		headers: {
			'Content-Type': 'application/json'
		}
	});

	private static handleResponse(response: AxiosResponse, info: string | undefined = undefined) {
		if (response.status < 200 || response.status >= 300) {
			console.error(
				`API Error: ${info ? `[${info}] ` : ''}${response.status}-${response.statusText}`
			);
		}
	}

	protected static async get<T>(baseURL: string, endpoint: string): Promise<T> {
		try {
			//console.info(`http://${baseURL}/${endpoint}`)
			const response = await this.instance.get<T>(endpoint, {
				baseURL: `http://${baseURL}/`
			});
			this.handleResponse(response, `get:${endpoint}`);
			return response.data;
		} catch (error) {
			console.error(`API Error on get:${endpoint}`, error);
			throw new Error(`API Error on get:${endpoint}`);
		}
	}

	protected static async getXML2JSON<T>(baseURL: string, endpoint: string): Promise<T> {
		try {
			const response: AxiosResponse<string> = await this.instance.get<string>(endpoint, {
				baseURL: `http://${baseURL}/`,
				headers: {
					'Content-Type': 'application/xml'
				}
			});

			if (this.isXml(response)) {
				return this.xmlToJson<T>(response.data);
			} else {
				errorLog(`API Error on getXML2JSON:${endpoint} (xml check failed)`);
				throw new Error(`API Error on getXML2JSON: ${endpoint}(xml check failed)`);
			}
		} catch (error) {
			errorLog(`API Error on getXML2JSON: ${endpoint} ${JSON.stringify(error, null, 4)}`);
			throw new Error(`API Error on getXML2JSON: ${endpoint}`);
		}
	}

	private static isXml(response: AxiosResponse<any>): boolean {
		const contentType = response.headers['content-type'];
		return (
			contentType && (contentType.includes('application/xml') || contentType.includes('text/xml'))
		);
	}

	private static async xmlToJson<T>(xml: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			xml2js.parseString(
				xml,
				{
					explicitArray: false,
					mergeAttrs: true
				},
				(err: Error | null, result: T) => {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				}
			);
		});
	}
}
