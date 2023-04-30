//Packages need for app 
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

// Asks about manager information
const inquire = () => {
  inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Please enter your team manager's name",
      },

      {
        type: "input",
        name: "id",
        message: "Please enter your team manager's employee ID",
      },

      {
        type: "input",
        name: "email",
        message: "Please enter your team manager's email address",
      },

      {
        type: "input",
        name: "office",
        message: "Please enter your team manager's office number",
      },
    ])
    .then((answers) => {
      makeProfile(answers, "manager");
    }).then(() => {
      nextEmployee();
    });
};

// Ask what next employee type is or add no more employees
const nextEmployee = () => {
  inquirer.prompt([
      {
        type: "list",
        name: "position",
        message: "Would you like to add another employee?",
        choices: ["engineer", "intern", "no more employees"],
      },
    ]).then((answers) => {
      promptNextEmployee(answers);
    });
};

// given employee position, asks questions
const promptNextEmployee = (answers) => {
  if (answers.position == "engineer") {
    askEngineer();
  } else if (answers.position == "intern") {
    askIntern();
  } else {
    finishHtml(html);
  }
};

// asks engineer follow up questions, then asks for next employee
const askEngineer = () => {
  inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Please enter your engineer's name",
      },

      {
        type: "input",
        name: "id",
        message: "Please enter your engineer's employee ID",
      },

      {
        type: "input",
        name: "email",
        message: "Please enter your engineer's email address",
      },

      {
        type: "input",
        name: "github",
        message: "Please enter your engineer's Github username",
      },
    ]).then((answers) => {
      makeProfile(answers, "engineer");
      nextEmployee();
    });
};

// asks intern follow up questions, then asks for next employee
const askIntern = () => {
  inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Please enter your intern's name",
      },

      {
        type: "input",
        name: "id",
        message: "Please enter your intern's employee ID",
      },

      {
        type: "input",
        name: "email",
        message: "Please enter your intern's email address",
      },

      {
        type: "input",
        name: "school",
        message: "Please enter your intern's school",
      },
    ]).then((answers) => {
      makeProfile(answers, "intern");
      nextEmployee();
    });
};

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
<h1 class="text-center header w-100 py-4 align-middle" style="color: white; background-color: rgba(219, 68, 68, 0.823)">My Team</h1>
    <sec class="d-flex flex-row flex-wrap justify-content-around align-items-center">`;

// end of html script
const endHtml = `
</sec>    
</body>
    </html>`;

// adding formatting to cards
const createCard = (name, position, id, email, thirdItem) => {
  let card = `
    <div class="card my-2" style="width: 18rem; box-shadow: 5px 5px 8px #888888; margin: 5px; ">
    <div class="card-body" style="color: white; background-color: rgba(27, 113, 233, 0.936)">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${position}</p>
    </div>
      <ul class="list-group list-group-flush" style="margin: 40px 20px 40px 20px;">
        <li class="list-group-item" style="background-color:rgba(183, 179, 179, 0.398)">ID: ${id}</li>
        <li class="list-group-item" style="background-color:rgba(183, 179, 179, 0.398)">Email: <a href = "mailto: ${email}">${email}</a></li>
        <li class="list-group-item" style="background-color:rgba(183, 179, 179, 0.398)">${thirdItem}</li>
      </ul>
    </div>`;
  return card;
};

// make card by job title
const makeProfile = async (answers, position) => {
  let card;
  if (position == "manager") {
    card = await makeManager(answers);
  } else if (position == "engineer") {
    card = await makeEngineer(answers);
  } else if (position == "intern") {
    card = await makeIntern(answers);
  } else {
    let err = new Error("Can't find employee position");
    console.error(err);
  }

  html = `${html}
    ${card}`;
};

// create manager card
const makeManager = (answers) => {
  let manager = new Manager(answers);
  let office = `Office Number: ${manager.getOffice()}`;
  let card = createCard(
    manager.getName(),
    manager.getRole(),
    manager.getId(),
    manager.getEmail(),
    office
  );
  return new Promise((resolve, reject) => {
    resolve(card);
  });
};

// create intern card
const makeIntern = (answers) => {
    let intern = new Intern(answers);
    let school = `School: ${intern.getSchool()}`;
    let card = createCard(
      intern.getName(),
      intern.getRole(),
      intern.getId(),
      intern.getEmail(),
      school
    );
    return new Promise((resolve, reject) => {
      resolve(card);
    });
  };

// create engineer card
const makeEngineer = async (answers) => {
  let github;
  let card;
  let engineer = new Engineer(answers);
  let link = await engineer.getGithub();
  github = `Github: <a href='${link}' target=_blank>${engineer.getGithubName()}</a>`;
  card = createCard(
    engineer.getName(),
    engineer.getRole(),
    engineer.getId(),
    engineer.getEmail(),
    github
  );

  return new Promise((resolve, reject) => {
    resolve(card);
  });
};

// write html to file
const finishHtml = (html) => {
  html = `${html}
    ${endHtml}`;
  fs.writeFile(path.join(__dirname, "/dist/index.html"), html, (err) =>
    err ? console.error(err) : console.log("Success New Profile Made!")
  );
};

inquire();
