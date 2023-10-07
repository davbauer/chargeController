import ApiBase from './ApiBase.js';
import ConfigFile from '../../classes/ConfigFile.js';
import InterfaceBatData from '../../models/InterfaceBatData.js';

export default class extends ApiBase {
	static async getEMSDATA(): Promise<InterfaceBatData> {
		return this.getXML2JSON<InterfaceBatData>(ConfigFile.read().BatteryHost, 'cgi/ems_data.xml');
	}
}
