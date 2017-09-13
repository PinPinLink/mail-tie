'use strict';
var fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    nodemailer = require('nodemailer');

module.exports.web = function (project, file) {
    project = projectHandler(project);
    if (file === true) {
        file = project.path;
    }
    checkFile(file);
    if (fs.existsSync(file) && fs.lstatSync(file).isDirectory()) {
        file = file + '/' + project.name + '.html';
    }
    project.images.forEach(function (img) {
        project.html = project.html.replace(
            new RegExp(img.src, 'g'),
            'data:' + mime.getType(img.src) +  ';base64,' +
            fs.readFileSync(img.path, 'base64'));
    });
    fs.writeFileSync(file, project.html);
    console.log('[success] %s', file);

    function checkFile(file) {
        if (!fs.existsSync(file)) {
            checkFile(path.dirname(file));
            if (path.extname(file) !== '.html') {
                fs.mkdirSync(file);
            }
        }
    }
};

module.exports.send = function (project, smtp, mail, list) {
    project = projectHandler(project);

    var transporter = nodemailer.createTransport(smtp);
    transporter.verify(function (error, info) {
        if(error) {
            console.error('\x1b[31m[error]\x1b[0m %s', error);
            return;
        }
        console.log('\x1b[34m[success]\x1b[0m Mail server is ready');
        mail.html = project.html;
        mail.attachments = project.images;
        mail.attachments.forEach(function (img) {
            mail.html = mail.html.replace(new RegExp(img.src, 'g'), 'cid:' + img.cid);
        });
        list.forEach(function (to) {
            if (!(to = to.trim())) {
                return;
            }
            mail.to = to;
            transporter.sendMail(mail, function(error, info) {
                if(error){
                    console.error('\x1b[31mSend to:\x1b[0m %s, %s', mail.to, error);
                } else {
                    console.log('send to: %s, %s', to, info.response);
                }
            });
        });
    });
};

function projectHandler(project) {
    var html = project + '/index.html';
    if (!fs.existsSync(project)) {
        console.error('\x1b[31m[error]\x1b[0m Projcet: %s', project + ' not found!');
        process.exit(1);
    }
    if (!fs.existsSync(html)) {
        console.error('\x1b[31m[error]\x1b[0m Projcet HTML file: %s', html + ' not found!');
        process.exit(1);
    }
    html = fs.readFileSync(html, 'UTF-8');
    var images = html.match(/(img\/[\w\.]+)/g);
    for (var i = images.length - 1; i > -1; i--) {
        if (!fs.existsSync(project + '/' + images[i])) {
            console.warn('\x1b[33m[warn]\x1b[0m %s', project + images[i] + ' not found!');
            images.splice(i, 1);
            continue;
        }
        images[i] = {
            src: images[i],
            filename: path.basename(images[i]),
            path: project  + '/' + images[i],
            cid: images[i]
        };
    }
    return {
        path:  project,
        name:  path.basename(project),
        html: html,
        images: images
    };
}