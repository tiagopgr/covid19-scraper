const puppeteer = require('puppeteer');
const db = require('./models');

// Url target from scapping
const target_url = "https://covid.saude.gov.br/";

//create data object from save informations
let data = [];

//Generate ramdom value with params min and max
randomSeconds = (min, max) => {
   min = Math.ceil(min);
   max = Math.floor(max);
   return (Math.floor(Math.random() * (max - min)) + min) * 1000;
}


//Time from wait load page, random value between min and max seconds
const timeWait = randomSeconds(1, 5);

const elConfirmadosBrasil = 'body > app-root > ion-app > ion-router-outlet > app-home > ion-content > painel-geral-component > div > card-totalizadores-component > div.container-cards.ct-totalizadores.ct-geral > div:nth-child(1) > div > div.lb-total';
const elObitosBrasil = 'body > app-root > ion-app > ion-router-outlet > app-home > ion-content > painel-geral-component > div > card-totalizadores-component > div.container-cards.ct-totalizadores.ct-geral > div:nth-child(2) > div > div.lb-total';
const elConfirmadosCeara = 'body > app-root > ion-app > ion-router-outlet > app-home > ion-content > painel-geral-component > div > div.container-cards.line-3.display-flex.justify-around > div.card-total.no-padding.width-50.height-768px > lista-itens-component > div.list-itens.ct-itens-geral > div:nth-child(6) > div.teste > div:nth-child(1) > b';
const elObitosCeara = 'body > app-root > ion-app > ion-router-outlet > app-home > ion-content > painel-geral-component > div > div.container-cards.line-3.display-flex.justify-around > div.card-total.no-padding.width-50.height-768px > lista-itens-component > div.list-itens.ct-itens-geral > div:nth-child(6) > div.teste > div:nth-child(2) > b';


(async () => {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto(target_url);
   await page.waitFor(timeWait);

   const confirmadosbr = parseFloat((await page.$eval(elConfirmadosBrasil, divs => divs.innerText)).replace(/\./, ""));
   const obitosbr = parseFloat((await page.$eval(elObitosBrasil, divs => divs.innerText)).replace(/\./, ""));
   const confirmadosce = parseFloat((await page.$eval(elConfirmadosCeara, divs => divs.innerText)).replace(/\./, ""));
   const obitosce = parseFloat((await page.$eval(elObitosCeara, divs => divs.innerText)).replace(/\./, ""));

   data = {
      confirmadosbr,
      obitosbr,
      confirmadosce,
      obitosce,
      "timestamp": new Date().getTime(),
   };

   await browser.close();

   db.Informations.create(data)
      .then((information) => console.log("Informações salvas com sucesso."))
      .catch((err) => {
         console.error("Nao foi possivel salvar a informação!");
         console.log(err);
      });

   console.clear();
   console.log(`Wait time: ${timeWait / 1000} seconds.`);
   console.log(data);
})();