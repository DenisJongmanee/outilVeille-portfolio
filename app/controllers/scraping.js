const rp = require("request-promise");
const cheerio = require('cheerio');
const util = require('./util');
const utf8 = require('utf8');

exports.getData = (req, res, next) => {
    let search = req.params.search;
    const lang = req.params.lang;
    search = search.split(" ").join("+");
    console.log(search);
    console.log(lang);
    if (lang === 'en') {
        scrapingENURL(search).then(result => {
            
            console.log("Liste urls envoyé");
            const resultList = [...result[0], ...result[1]];
            
            resultList.sort((a,b) => {
                return  b.date - a.date;
            });
            index=0;
            resultList.forEach(article => {
                article.id = index;
                index++
                article.date = util.convertDate(article.date)
            })

            // console.log(resultList);
            res.status(200).json({ listUrls: resultList });

        })
    } else if (lang === 'fr') {
        scrapingFRURL(search).then(result => {
            console.log("Liste urls envoyé");
            const resultList = [...result[0], ...result[1], ...result[2]];
            
            resultList.sort((a,b) => {
                return  b.date - a.date;
            });
            index=0;
            resultList.forEach(article => {
                article.id = index;
                index++
                article.date = util.convertDate(article.date)
            })
            // console.log(resultList);
            res.status(200).json({ listUrls: resultList });

        })
    }
};

const scraping01net = (search) => {
    return new Promise(async (resolve, reject) => {
        const result = await rp({uri: `https://www.01net.com/search?q=${search}`, encoding: 'utf8'});

        const $ = cheerio.load(result);
        
        let listUrls = [];
        
        for (let i = 0; i<$('article.art-body').length; i++) {
            try {
                const date = new Date($('article.art-body')[i].children[3].children[3].children[7].attribs.datetime 
                    ? $('article.art-body')[i].children[3].children[3].children[7].attribs.datetime
                    : $('article.art-body')[i].children[3].children[5].children[7].attribs.datetime);
                const article = {
                    url: $('article.art-body')[i].children[1].children[1].attribs.href,
                    title: $('article.art-body')[i].children[3].children[1].attribs.title,
                    date: date,
                    site: "01Net"
                };
                listUrls.push(article);
            } catch(error) {
                console.log(error);
            }
        }
        resolve(listUrls);
    })
};

const scrapingLeMondeInformatique = (search) => {
    return new Promise(async (resolve, reject) => {
        let listUrls = []
        const result = await rp({uri: `https://www.lemondeinformatique.fr/recherche/index.html?type=chrono&search=${search}`, encoding: 'latin1'});
        const $ = cheerio.load(result);
        for (let i = 0; i<$('article.item').length; i++) {
            try {
                
                let date = $('article.item .col-xs-9')[i].children[0].children[0].children[0].data;
                date = date.split(" ");
                date[1] = util.convertMonth(date[1]);
                
                date.join(" ");
                const article = {
                    url: $('article.item .col-xs-9')[i].children[1].children[0].attribs.href,
                    title: $('article.item .col-xs-9')[i].children[1].children[0].children[0].data,
                    date: new Date(date),
                    site: "Le Monde informatique"
                };
                listUrls.push(article);
            } catch(error) {
                console.log(error);
            }
        }
        resolve(listUrls);
    });
};


const scrapingZDnet = (search) => {
    
    return new Promise(async (resolve, reject) => {
        let listUrls = []
        
        const result = await rp({uri: `https://www.zdnet.fr/rechercher/${encodeURIComponent(search.toLowerCase())}.htm`, encoding: 'latin1'});
        const $ = cheerio.load(result);
        if ($('#main .navSupplement').length === 0) {
 
            console.log("ZDnet " . $('.river article.item').length);
            for (let i = 0; i<$('.river article.item').length; i++) {
                try {
                    let date = $('.river article.item')[i].children[1].children[5].children[3].children[0].data.trim().split("  ")[0];
                    date = date.split(" ");
                    
                    date[2] = util.convertMonth(utf8.decode(date[2]));
                    
                    const article = {
                        url: "https://www.zdnet.fr" + $('.river article.item')[i].children[1].children[1].children[1].attribs.href,
                        title: utf8.decode($('.river article.item')[i].children[1].children[1].children[1].children[0].data),
                        date: new Date(date),
                        site: "ZDNet"
                    };
                    listUrls.push(article);
                } catch(error) {
                    console.log(error);
                }
            }

        } else {
           
            for (let i=0; i<30; i++) {
                try {
                    const node = $('.river')[$('.river').length-1].children[i];
                    let date = node.children[1].children[5].children[3].children[0].data.trim().split("  ")[0]; 
                    date = date.split(" ");
                    date[2] = util.convertMonth(utf8.decode(date[2]));

                    const article = {
                        url: "https://www.zdnet.fr" + node.children[1].children[1].children[1].attribs.href,
                        title: utf8.decode(node.children[1].children[1].children[1].children[0].data),
                        date: new Date(date),
                        site:"ZDNet"
                    }
                    // i++
                    listUrls.push(article);
                } catch(error) {
                    if (i%2 !== 0) {

                        console.log(error);
                    }
                }
            } 
        }
        resolve(listUrls);
    });
};

const scrapingProgrammez = (search) => {
    return new Promise(async (resolve, reject) => {
        let listUrls = []
        
        const result = await rp({uri: `https://www.programmez.com/search/node/${encodeURIComponent(search.toLowerCase())}`, encoding: 'latin1'});
        const $ = cheerio.load(result);
       
        resolve(listUrls);
    });
};


const scrapingTheRegister = (search) => {
    return new Promise(async (resolve, reject) => {
        let listUrls = [];
        const result = await rp({uri: `https://search.theregister.com/?q=${encodeURIComponent(search.toLowerCase())}&site=&sort=rel`, encoding: 'latin1'});
        const $ = cheerio.load(result);
        for (let i = 0; i<$('.rt-osr article').length; i++) {
            try {
                const article = {
                    url: 'https://www.theregister.com' + $('.rt-osr article')[i].children[1].attribs.href,
                    title: $('.rt-osr article')[i].children[1].children[3].children[1].children[0].data,
                    date: new Date($('.rt-osr article')[i].children[1].children[3].children[5].children[0].attribs.title),
                    site: "The Register"
                }
                listUrls.push(article);
            } catch(error) {
                console.log(error);
            }
        }
        // console.log(listUrls);
        resolve(listUrls);
    });
};

const scrapingTechRadar = (search) => {
    return new Promise(async (resolve, reject) => {
        let listUrls = [];
        const result = await rp({uri: `https://www.techradar.com/search?articleType=news&searchTerm=${encodeURIComponent(search.toLowerCase())}`, encoding: 'latin1'});
        const $ = cheerio.load(result);  
        for (let i = 0; i<$('.listingResult .content').length; i++) {
            try {
                const article = {
                    url: $('.listingResult .content')[i].parent.parent.attribs.href,
                    title: $('.listingResult .content')[i].children[1].children[1].children[0].data,
                    date: new Date($('.listingResult .content')[0].children[1].children[3].children[3].attribs.datetime),
                    site: "TechRadar"
                }
                listUrls.push(article);
            } catch(error) {
                console.log(error);
            }
        }
        resolve(listUrls);
    });
};


const scrapingFRURL =  (search) => {
    return new Promise(async (resolve, reject) => {
        let listUrls = []
        const result = await scrapingLeMondeInformatique(search);
        listUrls.push(result);
        const result2 = await scraping01net(search);
        listUrls.push(result2);
        const result3 = await scrapingZDnet(search);
        listUrls.push(result3);
        resolve(listUrls);
    });        
};


const scrapingENURL =  (search) => {
    return new Promise(async (resolve, reject) => {
        let listUrls = []
        const result = await scrapingTheRegister(search);
        listUrls.push(result);
        const result2 = await scrapingTechRadar(search);
        listUrls.push(result2);
        resolve(listUrls);
    });        
};