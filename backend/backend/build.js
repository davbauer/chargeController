define("models/Config", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("functions/readConfigFile", ["require", "exports", "fs"], function (require, exports, fs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(filePath) {
        try {
            var fileContents = fs_1.default.readFileSync(filePath, 'utf-8');
            var data = JSON.parse(fileContents);
            return data;
        }
        catch (error) {
            console.error('Error reading or parsing file:', error);
            return null;
        }
    }
    exports.default = default_1;
});
define("backend", ["require", "exports", "functions/readConfigFile"], function (require, exports, readConfigFile_cjs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var express = require('express');
    var app = express();
    var PORT = 5000;
    var chargerAdjustmentInterval;
    app.get('/getConfig', function (res) {
        var configObject = (0, readConfigFile_cjs_1.default)("./backend/config.json");
        if (configObject === null) {
            return res.send(400, {
                msg: "Error parsing config file"
            });
        }
        return res.send(configObject);
    });
    app.get('/start', function (res) {
        chargerAdjustmentInterval = setInterval(function () {
            console.log("Checking and adjusting charger...");
            // Place your logic to check and adjust the charger here
        }, 20000); // 20 seconds
        res.send("Started charger adjustment process.");
    });
    app.get('/stop', function (res) {
        clearInterval(chargerAdjustmentInterval);
        res.send("Stopped charger adjustment process.");
    });
    //test
    app.listen(PORT, function () {
        console.log("Server running at http://localhost:".concat(PORT));
    });
});
