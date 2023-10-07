import ApiBase from './ApiBase.js';
import ConfigFile from '../../classes/ConfigFile.js';
import InterfaceBatEMSData from '../../models/InterfaceBatEMSData.js'
export default class extends ApiBase {
	static async getEMSDATA(): Promise<InterfaceBatEMSData> {
		return this.getXML2JSON<InterfaceBatEMSData>(ConfigFile.read().BatteryHost, 'cgi/ems_data.xml');
	}
}
