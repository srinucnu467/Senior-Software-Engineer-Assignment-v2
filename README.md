# Senior Software Engineer Assignment v2



## Table of Contents
1. [Setup](#setup)
    - [Git Congifuration](#git-configuration)
    - [Clone the Repository](#clone-the-repository)
    - [Project Configuration](#project-configuration)
​
2. [Running the Project](#running-the-project)
    - [Dev](#dev)
​
3. [Development](#development)
​
4. [Components](#components)
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
## Running the Project
We are using different environment files for sandbox, test and master branches with different infrastructure and other configurations. To use a particular environment file, its path must be specified under dotenv config in main.ts file as follows:
```
dotenv.config({path: '.env'});
```
By default, .env file is used.
After running the project, you can open localhost on port 4001 to check if the app is running or not.
### Dev
Environmental File Name: dev.env
```bash
$ nodemon start
```
