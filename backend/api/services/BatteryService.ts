import ApiBase from './ApiBase.js';
import ConfigFile from '../../classes/ConfigFile.js';
import BatEMSDATA from '../models/BatEMSDATA.js';
export default class extends ApiBase {
    static async getEMSDATA(): Promise<BatEMSDATA> {
        return this.getXML2JSON<BatEMSDATA>(
            ConfigFile.read().BatteryHost,
            'cgi/ems_data.xml'
        );
    }
}
