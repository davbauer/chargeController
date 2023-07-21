import type ResBase from "../models/ResBase";
import ApiBase from "./ApiBase";

export default class extends ApiBase {
    static async postEnabled(baseURL: string, state: boolean): Promise<ResBase> {
        return this.post<ResBase>(baseURL, 'enabled', { state });
    }
}