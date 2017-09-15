MailTie  ~~ネクタイ~~
======

## About
Send HTML mail with embedded image files or tied up HTML images with base64.

## How To
Before use it, you need [node](https://nodejs.org).

### Get it
```
# Clone
git clone https://github.com/NSRare/NSGIF.git

# Install for use
npm install -g mail-tie

# Install for dependencies
npm install -save-dev mail-tie
```

### Commands
```
# Send mail with config files
mail-tie -project <project_path> -smtp <smtp_config_file> -mail <mail_config_file> -list <mail_list_file>

# Send mail with options
mail-tie -project path -host <smtp_host_or_ip> -port <smtp_port> [-secure] -user <smtp_account> -pass <smtp_password> -from <mail_sender> -subject <mail_subject> -to <mail_recipients(split with ',')>

# Make HTML with base64 URI
mail-tie -project path -web [<path>]

# Test demo
mail-tie -demo [<send mail> || <web>]
```

#### Options

-project Your project folder

-demo Use demo project

-smtp SMTP config JSON file

-mail Email config JSON file

-list Email address line by line text file

-service SMTP service name [service list](https://nodemailer.com/smtp/well-known)

-host SMTP host name or ip address

-port SMTP port number

-secure SMTP service with SLTR

-user SMTP account

-pass SMTP password

-from Mail sender

-subject Mail subject

-to Mail recipients(split with ',')
```
-to address@mail.com
-to 'Some Body <address@mail.com>'
-to 'Some Body <address@mail.com>, Some Body2 <address2@mail.com>'
```

-web Make HTML with base64 images, you can specify the path and file name
```
-web /your/path
-web /your/path/name.html
```

### API
```
var mailTie = require('../mail-tie');

var project = '/path/to/your/project';

var smtp = {
    service: 'gmail',
    auth: {
        user: 'username',
        pass: 'password'
    }
};

// var smtp = {
//    host: 'smtp.example.com',
//    port: 587,
//    secure: false, // with TLS
//    auth: {
//        user: 'username',
//        pass: 'password'
//    }
// }

var mail = {
    from: 'sender@email.com',
    subject: 'Email title',
}

// var mail = {
//     from: 'Your Name <sender@email.com>',
//     subject: 'Email title',
// }

var list = [
    'who@email.com',
    'Who Is <who.is@email.com>'
]

mailTie.send(project, smtp, mail, list);


var file = '/path/to/the/output/folder';

// var file = '/path/to/the/output/folder/name.html';

mailTie.web(project, file);
```

## Project
A project folder must be have a index.html file and "img" folder, you can check out the demo folder to be a example.

## Know issue
If you use gmail SMTP service, take look [this](https://support.google.com/accounts/answer/6010255) google help.
