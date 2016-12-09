var url = require('url');
var logger = require('../tools/logger');
var redis = require('../tools/redis');
var fetch = require('node-fetch');
var ak = require('../config');

module.exports = function (req, res) {
    var userIP = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var query = url.parse(req.url,true).query;
    var ip = query.ip || userIP;

    redis.client.get(`BaiduLocation${ip}`, function(err, reply) {
        if (reply) {
            logger.info(`BaiduLocation ip ${ip} form redis, IP: ${userIP}`);
            res.send(reply);
        }
        else {
            logger.info(`BaiduLocation ip ${ip} form origin, IP: ${userIP}`);

                fetch(`http://api.map.baidu.com/highacciploc/v1?qcip=${ip}&qterm=pc&ak=${ak}&coord=bd09ll`).then(
                    response => response.json()
                ).then((data) => {
                        if (data.content) {
                            fetch(`http://api.map.baidu.com/geocoder/v2/?location=${data.content.location.lat},${data.content.location.lng}&output=json&ak=${ak}`).then(
                                response => response.text()
                            ).then((data) => {
                                    res.send(data);
                                    redis.set(`BaiduLocation${ip}`, data);
                                }
                            ).catch(
                                e => logger.error("BaiduLocation Error: getting location", e)
                            );
                        }
                        else {
                            res.send(data);
                            redis.set(`BaiduLocation${ip}`, JSON.stringify(data));
                        }
                    }
                ).catch(
                    e => logger.error("BaiduLocation Error: getting highacciploc", e)
                );
        }
    });
};