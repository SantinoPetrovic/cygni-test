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
	let test = [];
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
								wikipediaDescription = handleWikipediaDescription(wikipediadata);
							});

						}
					});

				} else {
					res.json( {success: false, error: "no wikiurl." } );	
				}

				if (musicbrainzdata.releaseobj) {
				 	coverartCall(musicbrainzdata.releaseobj, function(coverartContent) {
				 		// Call response function when coverart is done
				 		returnRespone(req.query.mbid, wikipediaDescription, coverartContent);
				 	});				 	
				}				
			}			
		});		

	} else {
		res.json( {success: false, msg: 'No defined mbid in url query.'});
	}

	function handleWikidata(data) {
		let dataTitle = '';	
		for (let i in data.data.entities) {
			if (data.data.entities[i].sitelinks.enwiki.title) {
				dataTitle = data.data.entities[i].sitelinks.enwiki.title;
			}			
		}	
		return dataTitle;	
	}

	function handleWikipediaDescription(data) {
		let dataDescription = '';
		for (let i in data.data) {
			if (data.data[i].extract) {
				dataDescription = data.data[i].extract;
			}	
		}
		return dataDescription;
	}

	function coverartCall(musicbrainzcontent, callback) {
		let coverartContentArr = [];
		for (let i = 0; i < musicbrainzcontent.length; i++) {			
			coverart.apiCoverart(musicbrainzcontent[i], function(coverartdata) {
				coverartContentArr.push(coverartdata.album);
				// Compare array size between the passed parameter and the local variable
				if (coverartContentArr.length >= musicbrainzcontent.length) {
					callback(coverartContentArr);
				}				
			});
		}		
	}

	function returnRespone(mbid, wikipedia, coverart) {
		// Give json response to user
		res.json( {mbid: mbid, description: wikipedia, albums: coverart } );
	}

});

module.exports = router;