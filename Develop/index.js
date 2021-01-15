const inquirer = require("inquirer");
const axios = require("axios");
const fs = require('fs');
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
    {
        type:"input",
        name: "username",
        message: "What is your Github username?",
    },

    {
        type:"input",
        name: "project",
        message: "What is your project name?",
    },
    {
        type:"input",
        name:"description",
        message:"Please write a short description of your project?",
    },
    {

        type:"list",
        name:"license",
        message: "What kind of license should your project have? User can choose from list of items?",
        choices:[
            "MIT",
            "Mozilla",
            "Zlib",
        ]
    },
    {
        type:"input",
        name:"installation",
        message:"What command should be run to install dependencies?",
        default: 'npm i',

    },

    {
        type:"input",
        name:"test",
        message:"What command should be run to run tests?",
        default: 'npm test'

    },
    {
        type:"input",
        name:"additionalInfo",
        message:"What does the user need to know about using the repo?",
    },
    {
        type:"input",
        name:"contribute",
        message:"What does the user need to know about contributing to the repo?",

    },

]);
}

function generateReadMe (response,answers,link) {
 return `
 ##  ${answers.project}
 ![License](${link})
 ## Description
  ${answers.description}
 
 ## Table of Contents 
 
 
 * [Installation](#installation)
 
 * [Usage](#usage)
 
 * [License](#license)
 
 * [Contributing](#contributing)
 
 * [Tests](#tests)
 
 * [Questions](#questions)
 
 ## Installation
 ${answers.installation
}
 
 ## Usage
 ${answers.additionalInfo}
 
 
 ## License
 ${answers.license}
 ## Contributing
 ${answers.contribute}
 
 
 ## Tests
 ${answers.test}
 
 
 ## Questions
 
 <img src="${response.avatar_url}" alt="avatar" style="border-radius: 16px" width="30" />
 
 If you have any questions about the repo, open an issue or contact [${response.login}](${response.html_url}).
 `;



}

promptUser()
.then(function(answers){

    if (answers.license=== "MIT") {
        link = "https://img.shields.io/badge/License-MIT-yellow.svg"
    }

    if (answers.license === "Mozilla") {
        link = "[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)"
    }
    if (answers.license === "Zlib") {

        link = "[![License: Zlib](https://img.shields.io/badge/License-Zlib-lightgrey.svg)](https://opensource.org/licenses/Zlib)"
    }
    const queryUrl = `https://api.github.com/users/${answers.username}`;

    axios.get(queryUrl).then(function(res) {
        const response = res.data;
        const readMe = generateReadMe (response,answers,link);
    return writeFileAsync ("template.md", readMe);
      
          
    });
    
})
.then(function() {
    console.log("Successfully wrote to template.md");
  })
  .catch(function(err) {
    console.log(err);
  });