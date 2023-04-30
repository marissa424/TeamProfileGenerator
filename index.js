// Packages need for app
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

// Asks about manager information
const inquirer = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Please enter your team managers name',
        },

        {
            type: 'input',
            name: 'id',
            message: 'Please enter your team managers ID',
        },

        {
            type: 'input',
            name: 'email',
            message: 'Please enter your team managers email',
        },

        {
            type: 'input',
            name: 'office',
            message: 'Please enter your team managers office number',
        },
    ])
    .then(answers => {
        makeProfile(answers, 'Manager')
    }).then(()=> {
        nextEmployee()
    })
}

// Promt asking what the next employee type is
const nextEmployee = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'position',
            message: 'Would you like to add another employee?',
            choices: ['engineer', 'intern', 'no more employees'],
        }
    ]).then(answers => {
        promptNextEmployee(answers)
    })
}

// depending on employee 
const promptNextEmployee = answers => {
    if (answers.position == 'engineer') {
        askEngineer()
    } else if (answers.position == 'intern') {
        askIntern()
    } else {
        finishHtml(html)
    }
}

// ask engineer follow up questions
const askEngineer = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Please input your engineers name',

            type: 'input',
            name: 'id',
            message: 'Please input your engineers ID',

            type: 'input',
            name: 'email',
            message: 'Please input your engineers email',

            type: 'input',
            name: 'github',
            message: 'Please input your engineers github username',
        }
    ]).then(answers => {
        makeProfile(answers, "engineer")
        nextEmployee()
    })
}

// ask intern follow up questions 

const askIntern = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Please input your interns name',

            type: 'input',
            name: 'id',
            message: 'Please input your interns ID',

            type: 'input',
            name: 'email',
            message: 'Please input your interns email',

            type: 'input',
            name: 'github',
            message: 'Please input your interns school',
        }
    ]).then(answers => {
        makeProfile(answers, "intern")
        nextEmployee()
    })
}

// Generate HTML

let html = `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
    <title>Team Profile</title>
</head>
<body>
    <h1 class="text-center header w-100 py-4 align-middle" style="background-color: rgba(0,0,255,.1)">My Team</h1>
    <sec class="d-flex flex-row flex-wrap justify-content-around align-items-center">`;
 
// end of html script
const endHtml = `
</sec>    
</body>
    </html>`;

// card formatting function
const createCard = (name, position, id, email, thirdItem) => {
    let card = `
    <div class="card my-2" style="width: 18rem;">
    <div class="card-body" style="background-color: rgba(0,0,255,.1)">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${position}</p>
    </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Id: ${id}</li>
        <li class="list-group-item">email: <a href = "mailto: ${email}">${email}</a></li>
        <li class="list-group-item">${thirdItem}</li>
      </ul>
    </div>`;
    return card

}

// choose card type by job title
const makeProfile = async (answers, position) => {
    let card;
    if (position == 'manager') {
         card = await makeManager(answers)
    } else if (position == 'engineer') {
        card = await makeEngineer(answers)
    } else if (position == 'intern') {
        card = await makeIntern(answers)
    } else {
        let err = new Error("Can't find employee position");
        console.error(err)
    }
    
    html = `${html}
    ${card}`;
}

// create manager card
const makeManager = (answers) => {
    let manager = new Manager(answers)
    let office = `Office Number: ${manager.getOffice()}`
    let card = createCard(manager.getName(), manager.getRole(), manager.getId(), manager.getEmail(), office);
    return new Promise ((resolve, reject) => {
        resolve(card)
    })
    

}

// create engineer card
const makeEngineer = async (answers) => {
    let github
    let card
    let engineer = new Engineer(answers);
    // make this into a promise
    let link = await engineer.getGithub();
    github = `Github: <a href='${link}' target=_blank>${engineer.getGithubName()}</a>`;
    card = createCard(engineer.getName(), engineer.getRole(), engineer.getId(), engineer.getEmail(), github);

    return new Promise((resolve, reject) => {
        resolve(card)
    })
    
}

// create intern card
const makeIntern = (answers) => {
    let intern = new Intern(answers);
    let school = `School: ${intern.getSchool()}`;
    let card = createCard(intern.getName(), intern.getRole(), intern.getId(), intern.getEmail(), school);
    return new Promise((resolve, reject) => {
        resolve(card)
    })
}

// write html to file
const finishHtml = (html) => {
    html = `${html}
    ${(endHtml)}`;
    fs.writeFile(path.join(__dirname, '/dist/index.html'), html, (err) =>
    err ? console.error(err) : console.log('Success!')
    );
}


// Run script

inquirer()

