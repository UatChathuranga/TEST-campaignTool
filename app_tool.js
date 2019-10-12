console.log("................................................................");
//
var DbConn = require('dvp-dbmodels');
let dialerRedisHandler = require('./DialerRedisHandler.js');
//
var campaignIds = [
    '1302'
];
//
function startFlushing() {
    console.log("starting...");
    for (i = 0; i < campaignIds.length; i++) {
        console.log("----: " + campaignIds[i]);
        removeCampaignNumbers(campaignIds[i], '1', '6', function (err, resp) {
            console.log("Err | Ok ");
        });
    }
    console.log("END");
}
//
function removeCampaignNumbers(campaignId, tenantId, companyId, callback) {
    console.log("fushing...: " + campaignId);
    DbConn.CampConfigurations.find({where: [{CampaignId: campaignId, TenantId: tenantId, CompanyId: companyId}]}).then(function (campConf) {
        if (campConf) {
            if (campConf.NumberLoadingMethod === 'NUMBER') {

                //Change state to removed

                DbConn.CampContactSchedule
                        .update(
                                {
                                    DialerStatus: 'removed_by_api'
                                },
                                {
                                    where: {
                                        CampaignId: campaignId,
                                        DialerStatus: 'added'
                                    }
                                }
                        ).then(function (updateRes) {

                    //remove from redis
                    let pattern = "CampaignNumbers:" + companyId + ":" + tenantId + ":" + campaignId + ":*";
                    dialerRedisHandler.GetKeys(pattern, function (err, keys) {

                        keys.forEach(function (key) {
                            dialerRedisHandler.DeleteObject(key);
                        })

                    });
                    callback(null, true);

                }).catch(function (err) {
                    callback(err, false);

                })

            } else if (campConf.NumberLoadingMethod === 'CONTACT') {
                DbConn.CampContactbaseNumbers
                        .update(
                                {
                                    DialerStatus: 'removed_by_api'
                                },
                                {
                                    where: {
                                        CampaignId: campaignId,
                                        DialerStatus: 'added'
                                    }
                                }
                        ).then(function (updateRes) {

                    //remove from redis
                    let key = "CampaignContacts:" + companyId + ":" + tenantId + ":" + campaignId;
                    dialerRedisHandler.DeleteObject(key);
                    callback(null, true);

                }).catch(function (err) {
                    callback(err, false);

                })

            } else {
                console.log("Invalid number loading type");
                callback(new Error("Invalid number loading type"), false);
            }

        } else {
            console.log("Campaign not found : " + campaignId);
            callback(new Error("Campaign not found"), false);
        }

    }).catch(function (err) {
        console.log("err");
        callback(err, false);
    })
    console.log("done: " + campaignId);
}

startFlushing();