// Get dependencies
const request = require('request');
const useragent = require('useragent');

module.exports = {
    apiCoverart: function(album, callback) {
            let arr = [];
            let imagesObj = {};
            let id = ''; 
            let options = '';
            let url = '';
            let title = '';
            id = album.id;
            title = album.title;
            url = 'http://coverartarchive.org/release-group/'+id;
            options = {
              url: url,
              headers: {
                'User-Agent': 'request'
              }
            };
            request(options, function(error, response, body) {
                if (error) {
                    imagesobj = {
                        error: error
                    }
                } else {
                    try {
                        let arr = JSON.parse(body);
                        imagesObj = {
                            title: title, 
                            id: id, 
                            image: arr.images[0].image
                        };                                              
                    } catch(error) {
                        imagesObj = {
                            title: title, 
                            id: id, 
                            image_error: "404 not found" 
                        };                        
                    }
                }
                callback({success: true, album: imagesObj});
            });      

    }
}