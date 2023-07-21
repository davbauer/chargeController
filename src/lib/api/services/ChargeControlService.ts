import type ResBase from "../models/ResBase";
import ApiBase from "./ApiBase";

export default class extends ApiBase {
    static async chargeStart(baseURL: string,): Promise<ResBase> {
        return this.post<ResBase>(baseURL, 'charge-start', undefined);
    }
    static async chargeStop(baseURL: string,): Promise<ResBase> {
        return this.post<ResBase>(baseURL, 'charge-stop', undefined);
    }
}