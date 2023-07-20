import { fail, type Actions } from "@sveltejs/kit"

import fs from 'fs';

export const actions: Actions = {
    save: async ({ request }) => {
        const data = await request.formData();

        const Enabled = data.get('Enabled') === 'on' ? true : false;
        const InverterHost = data.get('InverterHost');
        const ChargerHost = data.get('ChargerHost');
        const CheckSeconds = parseFloat(data.get('CheckSeconds') as string);
        const MinimumAmps = parseFloat(data.get('MinimumAmps') as string);
        const MaximumAmps = parseFloat(data.get('MaximumAmps') as string);
        const UsePowergrid = data.get('UsePowergrid') === 'on' ? true : false;


        const areValidInputs =
            typeof InverterHost === 'string' &&
            typeof ChargerHost === 'string' &&
            !isNaN(CheckSeconds) &&
            !isNaN(MinimumAmps) &&
            !isNaN(MaximumAmps);
        if (!areValidInputs) {
            return fail(400);
        }

        const configObject = {
            Enabled,
            InverterHost,
            ChargerHost,
            CheckSeconds,
            MinimumAmps,
            MaximumAmps,
            UsePowergrid
        }
        console.info(configObject)
        fs.writeFile('./backend/config.json', JSON.stringify(configObject, null, 4), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Data written to file successfully.');
            }
        });

    }
}