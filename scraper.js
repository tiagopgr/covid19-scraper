require('dotenv').config();
const requireDir = require('require-dir');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');

const mongoOptions = {
    keepAlive: 1,
    useUnifiedTopology: true,
    useNewUrlParser: true,
};
mongoose.connect(process.env.MONGO_DATASOURCE, mongoOptions);

require('./models/Information');

const Information = mongoose.model('Information');
const target_url = process.env.SERVICE_URL_TARGET;
let data = [];

/**
 * @author: Tiago Andrade
 * @param min
 * @param max
 * @returns
 */
randomSeconds = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.floor(Math.random() * (max - min)) + min) * 1000;
}

const timeWait = randomSeconds(5, 15);

const elConfirmadosBrasil = 'body > app-root > ion-app > ion-router-outlet > app-home > ion-content > painel-geral-component > div > card-totalizadores-component > div.container-cards.ct-totalizadores.ct-geral > div:nth-child(1) > div > div.lb-total';
const elObitosBrasil = 'body > app-root > ion-app > ion-router-outlet > app-home > ion-content > painel-geral-component > div > card-totalizadores-component > div.container-cards.ct-totalizadores.ct-geral > div:nth-child(2) > div > div.lb-total';
const elConfirmadosCeara = 'body > app-root > ion-app > ion-router-outlet > app-home > ion-content > painel-geral-component > div > div.container-cards.line-3.display-flex.justify-around > div.card-total.no-padding.width-50.height-768px > lista-itens-component > div.list-itens.ct-itens-geral > div:nth-child(6) > div.teste > div:nth-child(1) > b';
const elObitosCeara = 'body > app-root > ion-app > ion-router-outlet > app-home > ion-content > painel-geral-component > div > div.container-cards.line-3.display-flex.justify-around > div.card-total.no-padding.width-50.height-768px > lista-itens-component > div.list-itens.ct-itens-geral > div:nth-child(6) > div.teste > div:nth-child(2) > b';

console.clear();
console.log("Scraping started...");
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {

        await page.goto(target_url);
        await page.waitFor(timeWait);

        const confirmadosbr = parseFloat((await page.$eval(elConfirmadosBrasil, divs => divs.innerText)).replace(/\./, ""));
        const obitosbr = parseFloat((await page.$eval(elObitosBrasil, divs => divs.innerText)).replace(/\./, ""));
        const confirmadosce = parseFloat((await page.$eval(elConfirmadosCeara, divs => divs.innerText)).replace(/\./, ""));
        const obitosce = parseFloat((await page.$eval(elObitosCeara, divs => divs.innerText)).replace(/\./, ""));

        data = { confirmadosbr, obitosbr, confirmadosce, obitosce };
        await browser.close();

        const search = await Information.find(data);
        let message = "No new data.";
        if (search.length === 0) {
            const created = await Information.create(data);
            message = "Registered information";
            console.table(created._doc);
        }

        console.warn(message);
        console.log(`Finished scraping...`);
        process.exit();

    } catch (err) {
        await browser.close();
        console.error("Error on execute scraper. ", err);
        process.exit();
    }

})();
