// Get dependencies
const request = require('request');
const useragent = require('useragent');

module.exports = {
    apiMusicbrainz: function(mbid, callback) {
        var wikiurl = true;
        let url = 'http://musicbrainz.org/ws/2/artist/'+ mbid +'?&fmt=json&inc=url-rels+release-groups';
        const options = {
          url: url,
          headers: {
            'User-Agent': 'request'
          }
        };

        request(options, function(error, response, body) {
            if (typeof body === "undefined") {
                callback({success: false, error: "Wrong MBID."});
            } else {

                if (error) {
                    callback({ success: false, error: error });
                }

                let arr = JSON.parse(body);
                let wikiobj = arr.relations.find(i => i.type === 'wikidata');

                if (typeof wikiobj === "undefined") {
                    wikiurl = false;
                } else {
                    wikiurl = wikiobj.url.resource; 
                }

                var releaseobj = arr["release-groups"];

                callback({ success: true, wikiurl: wikiurl, releaseobj: releaseobj});
            }            
        });

    }
}