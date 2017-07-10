const BigNumber = require('bignumber.js');
const html2canvas = require('html2canvas');
const saveAs = require('file-saver').saveAs;

export const tokenHoldersPercentage = (total , investors, percentages) =>{
    // todo: sorted investors should be computed in getStatistics
    let investorsArray = [];
    // todo: another misuse of map
    Object.keys(investors).map((key)=>{
        investorsArray.push({
            investor : key,
            tokens : investors[key].tokens
        })
    });
    investorsArray.sort((first , last)=> {
        return last.tokens - first.tokens;
    });

    let result = [];
    // todo: another misuse of map
    percentages.map((percentageElement)=>{

        const percentage = investorsArray.length*percentageElement;
        // todo: do not use BigNumber it is very slow
        let percentageAmount = new BigNumber(0);

        // todo: do it in one pass! no loop inside loop
        for (let i = 0 ; i < parseInt(percentage); i ++){
            percentageAmount = percentageAmount.plus(investorsArray[i].tokens.toFixed(3));
        }
        let internalResult = {};
        // todo: do not use BigNumber it is very slow
        // todo: why internalResult is here? each percentageElement is only set once and never used so why you store it??
        internalResult[percentageElement] =new BigNumber((percentageAmount*100).toFixed(3)).dividedBy(total.toFixed(3)).valueOf();
        // todo: amt and TokenHolders are the same values, why a duplicate?
        result.push({name : `${percentageElement*100}%` , amt:parseFloat(internalResult[percentageElement]) , TokenHolders: parseFloat(internalResult[percentageElement])});
    });
    return result;
};

const svgDataURL = (svg) => {
    const svgAsXML = (new XMLSerializer).serializeToString(svg);
    return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
};

export const downloadChartImage = (chartId) => {
    const div= document.getElementById(chartId);
    const rect = div.getBoundingClientRect();

    const canvas = document.createElement("canvas");

    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.font="30px Verdana";

    const gradient=ctx.createLinearGradient(0,0,canvas.width,0);
    gradient.addColorStop("0","#424344");
    gradient.addColorStop("0.5","#D9DBDC");
    gradient.addColorStop("1.0","#D4E20F");

    // Fill with gradient
    ctx.fillStyle=gradient;

    const svgTag = document.getElementById(chartId).getElementsByTagName('svg')[0];
    const url = svgDataURL(svgTag);
    const img = new Image;
    img.width = canvas.width;
    img.height = canvas.height;
    img.onload = function () {
        ctx.drawImage(img,0,0);
        ctx.fillText("Powered by Neufund",canvas.width/2 - 90,canvas.height/2-40);
        canvas.toBlob(function(blob) {
            saveAs(blob, "pretty image.png");
        });
    };
    img.src= url;
};