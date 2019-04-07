// Get dependencies
const request = require('request');
const useragent = require('useragent');

module.exports = {
    apiWikipediaen: function(title, callback) {
        // Encode Url
        title = encodeURIComponent(title);
        let url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles='+title+'';
        const options = {
          url: url,
          headers: {
            'User-Agent': 'request'
          }
        };

        request(options, function(error, response, body) {
            let arr = JSON.parse(body);            
            if (error) {
                callback({ success: false, error: error});
            } else {
                callback({ success: true, data: arr.query.pages});
            }
        });

    }
}