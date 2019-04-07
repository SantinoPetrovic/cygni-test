// Get dependencies
const request = require('request');
const useragent = require('useragent');

module.exports = {
    apiWikidata: function(wikiurl, callback) {

        // Split the url string and get only the id.
        id = wikiurl.split('wiki/').pop();
        let url = 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids='+id+'&format=json&props=sitelinks';
        const options = {
          url: url,
          headers: {
            'User-Agent': 'request'
          }
        };

        request(options, function(error, response, body) {
            if (error) {
                callback({ success: false, error: error });
            }
            let arr = JSON.parse(body);            
            if (arr.error) {
                callback({ success: false, error: arr.error}); 
            } else {
                callback({ success: true, data: arr}); 
            }
        });

    }
}