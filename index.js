const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const { response } = require('express');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log('app running on port', PORT);

app.get('/igihe', (req, res) => {
    request('https://igihe.com/', (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let igiheResults = [];
            $('.col-sm-5 .article-wrap .row .col-md-12 .homenews .row').each(
                (i, el) => {
                    let article = {
                        outlet: 'Igihe',
                        link: '',
                        title: '',
                        picture: '',
                    };
                    article.link =
                        'https://igihe.com/' + $(el).find('a').attr('href');
                    article.title = $(el).find('span').text();
                    article.picture =
                        'https://igihe.com/' +
                        $(el).find('.col-xs-3 div a img').attr('data-original');

                    igiheResults.push(article);
                }
            );
            igiheResults.pop();
            let results = JSON.stringify(igiheResults);
            return res.status(200).send(results);
        }
    });
});

app.get('/agakiza', (req, res) => {
    request('https://bibiliya.com/songs/guhimbaza', (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let link = '';
            let data = [];
            let number = 0;

            $('.home-ttle12 a').each(async (i, el) => {
                let song = {
                    id: 0,
                    name: '',
                    lyric: '',
                };
                link = $(el).attr('href');
                let songLyric = await returnSongLyricFromLink(link);
                song.id = number;
                song.lyric = songLyric;
                data.push(song);
                number++;
            });
            let results = JSON.stringify(data);
            return res.status(200).send(results);
        }
    });

    function returnSongLyricFromLink(link) {
        request(link, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                let lyric = '';
                $('.col-md-11').each((i, el) => {
                    lyric = lyric + '\n' + $(el).text();
                });
                console.log(lyric);
                return lyric;
            }
        });
    }
});

/*app.get('/igihe', (req, res) => {
        request('https://igihe.com/', (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                let igiheResults = [];
                $(
                    '.col-sm-5 .article-wrap .row .col-md-12 .homenews .row'
                ).each((i, el) => {
                    let article = {
                        outlet: 'Igihe',
                        link: '',
                        title: '',
                        picture: '',
                    };
                    article.link =
                        'https://igihe.com/' + $(el).find('a').attr('href');
                    article.title = $(el).find('span').text();
                    article.picture =
                        'https://igihe.com/' +
                        $(el).find('.col-xs-3 div a img').attr('data-original');

                    igiheResults.push(article);
                });
                igiheResults.pop();
                let results = JSON.stringify(igiheResults);
                return res.status(200).send(results);
            }
        });
    });*/
