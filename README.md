# Senior Software Engineer Assignment v2



## Table of Contents
1. [Setup](#setup)
    - [Git Congifuration](#git-configuration)
    - [Clone the Repository](#clone-the-repository)
    - [Project Configuration](#project-configuration)
​
2. [Running the Project](#running-the-project)
​
5. [Technologies](#technologies)
​
## Setup
### Git Configuration
​
Configure Git on your local machine (Make sure Git is installed)
​
```bash
$ git config --global user.name "your_username"
$ git config --global user.email "your_email_address@purplle.com"
```
​
### Clone the Repository
​
Start by cloning this project on your workstation.

Clone with SSH (when you want to authenticate only one time)
```bash
$ git clone git@gitlab.com:srinucnu467/senior-software-engineer-assignment-v2.git
```
​
Clone with HTTPS (when you want to authenticate each time you perform an operation between your computer and GitLab)
```bash
$ git clone https://gitlab.com/srinucnu467/senior-software-engineer-assignment-v2.git
```
​
### Project Configuration
​
To view the files,
```bash
$ cd {current directory}
```
​
The next thing will be to install all the dependencies of the project. Make sure Node LTS version 14 is installed on your system along with its compatible npm version.

To install required packages,
```bash
$ npm install
```
​
## Running the Project in watch mode
```bash
$ nodemon start
```

## Running the Project
```bash
$ npm start
```
## Technologies
1. Node.js [(Documentation)](https://nodejs.org/en/docs/ "Documentation | Node.js")
2. Express [(Documentation)](https://expressjs.com/en/5x/api.html "Documentation | Express")
2. Mysql [(Documentation)](https://dev.mysql.com/doc/ "Mysql")
3. Mocha [(Documentation)](https://mochajs.org// "Mocha")
