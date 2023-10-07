import type AppInfo from '../models/AppInfo';
import ApiBase from './ApiBase';

export default class extends ApiBase {
    static async getAppInfo(): Promise<AppInfo> {
        return this.get<AppInfo>('appinfo');
    }
}
