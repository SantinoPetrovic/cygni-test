// Get dependencies
const express = require('express');
const router = express.Router();

// Get API:s
const musicbrainz = require('../api/musicbrainz');
const wikidata = require('../api/wikidata');
const wikipediaen = require('../api/wikipediaen');
const coverart = require('../api/coverart');

router.get('/getUser', function(req, res) {
	let wikidataTitle = '';
	let wikipediaDescription = '';
	let coverartArr = [];
	if (req.query.mbid) {

		// Call musicbrainz
		musicbrainz.apiMusicbrainz(req.query.mbid, function(musicbrainzdata) {
			if (musicbrainzdata.success === false) {
				res.json( {success: musicbrainzdata.success, error: musicbrainzdata.error } );
			} else {
				if (musicbrainzdata.wikiurl !== false) {

					// Call extern apiWikidata function
					wikidata.apiWikidata(musicbrainzdata.wikiurl, function(wikidata) {												
						if (wikidata.success === false) {
							res.json( {success: wikidata.success, error: wikidata.error } );			
						} else if(wikidata.data.entities) {
							// Call handleWikidata function
							wikidataTitle = handleWikidata(wikidata);

							// Call extern apiWikipediaen function
							wikipediaen.apiWikipediaen(wikidataTitle, function(wikipediadata){
								// call handleWikipediaDescription function
								handleWikipediaDescription(wikipediadata, req.query.mbid);
							});

						}
					});

				} else {
					res.json( {success: false, error: "no wikiurl." } );	
				}

				if (musicbrainzdata.releaseobj) {
					// Having problems with looping data and get the callback after all requests are done. I'm commenting out the function call.
					// coverart.apiCoverart(musicbrainzdata.releaseobj, function(coverartdata) {
						
					// });
				}				
			}			
		});		

	} else {
		res.json( {success: false, msg: 'No defined mbid in url query.'});
	}


	// Question to Cygni: is it worth doing functions for handling requests and call imported module functions? Did not make it work properly, but here's my test:
	// function wikidataFunction(wikiurl) {
	// 	wikidata.apiWikidata(data.wikiurl, function(data) {
	// 		return data;
	// 	});
	// }

	function handleWikidata(data) {
		let dataTitle = '';	
		for (var i in data.data.entities) {
			if (data.data.entities[i].sitelinks.enwiki.title) {
				dataTitle = data.data.entities[i].sitelinks.enwiki.title;
			}			
		}	
		return dataTitle;	
	}

	function handleWikipediaDescription(data, mbid) {
		let dataDescription = '';
		for (var i in data.data) {
			if (data.data[i].extract) {
				dataDescription = data.data[i].extract;
			}	
		}
		returnRespone(dataDescription, mbid);
	}

	function returnRespone(description, mbid) {
		res.json( {mbid: req.query.mbid, data: description, albums: [] } );
	}

});

module.exports = router;