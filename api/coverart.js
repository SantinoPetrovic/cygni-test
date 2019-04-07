// Get dependencies
const request = require('request');
const useragent = require('useragent');

module.exports = {
    apiCoverart: function(coverartArr, callback) {
        let arr = [];
        let imagesArr = [];
        let imagesObj = {};
        let id = ''; 
        let options = '';
        let url = '';
        let title = '';
        for (var i = 0; i < coverartArr.length; i++) {
            id = coverartArr[i].id;
            title = coverartArr[i].title;
            url = 'http://coverartarchive.org/release-group/'+id;
            options = {
              url: url,
              headers: {
                'User-Agent': 'request'
              }
            };
            setTimeout(requestFunction(id, title, options), function() {
                    if (coverartArr.length <= i) {
                        callback({albums: imagesArr}); 
                    }
            }, 1000);

            // There are currently no rate limiting rules in place at http://coverartarchive.org. Let's go!
            function requestFunction(id, title, options) {
                request(options, function(error, response, body) {
                    console.log(i);
                    console.log(url);
                    console.log(options);                
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
                            imagesArr.push(imagesObj);                                                
                        } catch(error) {
                            imagesObj = {
                                title: title, 
                                id: id, 
                                image_error: "404 not found" 
                            };
                            imagesArr.push(imagesObj);                                                

                        }
                    }                                
                });
            }
        }        

    }
}