const fs = require("fs");
const inquirer = require("inquirer");
const pdfkit = require("pdfkit");
const axios = require("axios");

const newPDF = new pdfkit();
// const profInfo;

inquirer.prompt([{
    text: "What is your Github username?",
    name: "github"
},
{
    text: "What is your favourite color?",
    name: "color"
}]
).then((data) => {
    const queryURL = `https://api.github.com/users/${data.github}`
    axios.get(queryURL).then((res) => {
        createPage(res, data.color);
    })
});

function createPage(input, color) {
    const name = input.data.name;
    const user = input.data.html_url;
    const repos = input.data.public_repos;
    const location = input.data.location;
    const bio = input.data.bio;
    const followers = input.data.followers;
    const following = input.data.following;
    const blog = input.data.blog;
    const pic = input.data.avatar_url;
    newPDF.pipe(fs.createWriteStream(`./summary.pdf`));
    newPDF.rect(0, 0, 612, 792)
        .fill('teal');
    newPDF.polygon([0, 0], [150, 0], [612, 642], [612, 792], [462, 792], [0, 150])
        .fill('tan');
    // newPDF.image(pic, 100, 100, {fit: [72, 72]});
    newPDF.rect(50, 50, 500, 125)
        .fill(color);
    newPDF.fontSize(25).fillColor('white').text(`Hello, my name is ${name}`,60, 135);
    newPDF
        .fillColor('white')
        .fontSize(10)
        .text(`github`, 500, 70, {link: user, underline: false});
    newPDF.text(`blog`, 500, 90, {link: blog, underline: false});
    newPDF.text(`location`, 500, 110, {link: `https://www.google.com/maps/place/${location}`, underline: false});
    newPDF.fontSize(20).text(bio, 100, 200, {width: 400});
    newPDF.rect(50, 250, 225, 80)
        .fill(color);
    newPDF.rect(325, 250, 225, 80)
        .fill(color);
    newPDF.rect(50, 370, 225, 80)
        .fill(color);
    newPDF.rect(325, 370, 225, 80)
        .fill(color);
    newPDF.fillColor('white')
        .fontSize(17)
        .text(`Public Repositories: ${repos}`, 55, 280, {width: 200, align: 'center'});
        newPDF.text(`Followers: ${followers}`, 325, 280,{width: 200, align: 'center'});
        newPDF.text(`Starred: some number`, 55, 400,{width: 200, align: 'center'});
        newPDF.text(`Following: ${following}`, 325, 400,{width: 200, align: 'center'});
    newPDF.end();
}


