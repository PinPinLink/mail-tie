#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    path = require('path'),
    mailTie = require('../mail-tie'),
    smtpFields = ['service', 'host', 'port', 'secure'],
    authFields = ['user', 'pass'],
    mailFields = ['from', 'subject'];


for (var i = 0, j = process.argv.length; i < j; i++) {
    if (process.argv[i].startsWith('-')) {
        if (process.argv[i + 1] && !process.argv[i + 1].startsWith('-')) {
            this[process.argv[i].substring(1)] = process.argv[i + 1];
        } else {
            this[process.argv[i].substring(1)] = true;
        }
    }
}

if (!this.project && !this.demo) {
    console.error('\x1b[31m[error]\x1b[0m %s', '-project not set');
    return;
}

if (this.demo) {
    this.project = path.dirname(require.resolve('../mail-tie')) + '/demo'
}

if (this.web) {
    mailTie.web(this.project, this.web);
    return;
}

var smtp, mail, list;

if (this.smtp) {
    if (!fs.existsSync(this.smtp)) {
        console.error('\x1b[31m[error]\x1b[0m %s not found', this.smtp);
        return;
    }
    smtp = JSON.parse(fs.readFileSync(this.smtp, 'UTF-8'));
} else {
    smtp = {};
}

smtpFields.forEach(function (n) {
    if (this[n]) {
        smtp[n] = this[n];
    }
}.bind(this));

authFields.forEach(function (n) {
    if (this[n]) {
        if (!smtp.auth) {
            smtp.auth = {};
        }
        smtp.auth[n] = this[n];
    }
}.bind(this));

if (this.mail) {
    if (!fs.existsSync(this.mail)) {
        console.error('\x1b[31m[error]\x1b[0m %s not found', this.mail);
        return;
    }
    mail = JSON.parse(fs.readFileSync(this.mail, 'UTF-8'));
}

mailFields.forEach(function (n) {
    if (this[n]) {
        mail[n] = this[n];
    }
}.bind(this));

if (this.list) {
    if (!fs.existsSync(this.list)) {
        console.error('\x1b[31m[error]\x1b[0m %s not found', this.list);
        return;
    }
    list = fs.readFileSync(this.list, 'UTF-8').split('\n');
} else {
    list = [];
}

if (this.to) {
    list = list.concat(this.to.split(','));
}

mailTie.send(this.project, smtp, mail, list);