const Employee = require('./Employee')

class Manager extends Employee {
    constructor(answers) {
        super(answers);
        this.officeNumber = answers.office;
    }

    getRole() {
        return "Manager"
    }

    getOffice() {
        return this.officeNumber;
    }
}



module.exports = Manager
