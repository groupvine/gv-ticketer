"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateUtil = require("moment/moment");
var crypto = require("crypto");
var TicketLifetimeDays = (365 * 5);
var Ticketer = /** @class */ (function () {
    function Ticketer(secret) {
        this._dateSeed = null;
        this._ticket = null;
        this._secret = secret;
    }
    // body is either the string ticket body, or an object
    // converted to a string
    Ticketer.prototype.ticket = function (body, dateSeed) {
        if (typeof body !== 'string') {
            body = this.tktBody(body);
        }
        if (!body) {
            if (this._ticket) {
                return this._ticket;
            }
            throw "Ticketer:ticket -- need to provide ticket body to compute ticket";
        }
        if (!dateSeed) {
            dateSeed = this.dateSeed();
        }
        var hash;
        var md5 = crypto.createHash('md5');
        hash = md5.update(dateSeed, 'utf-8');
        hash = md5.update(this._getKey(dateSeed), 'utf-8');
        hash = md5.update(body, 'utf-8');
        this._ticket = hash.digest('hex');
        return this._ticket;
    };
    // body is either the string ticket body, or an object
    // converted to a string
    Ticketer.prototype.validate = function (ticket, body, dateSeed) {
        if (typeof body !== 'string') {
            body = this.tktBody(body);
        }
        var i = dateSeed.lastIndexOf('-');
        var dateStr = dateSeed.substring(0, i);
        var dt = dateUtil(dateStr, "DDMMMYY-HH:mm:ss");
        dt.add(TicketLifetimeDays, 'days');
        if (dt < dateUtil()) {
            return "Ticket has expired";
        }
        if (ticket !== this.ticket(body, dateSeed)) {
            return "Invalid ticket";
        }
        return ''; // valid
    };
    Ticketer.prototype.dateSeed = function (dateSeed) {
        if (typeof dateSeed === 'string') {
            this._dateSeed = dateSeed;
        }
        else {
            this._dateSeed = this._computeDateSeed(dateSeed);
        }
        return this._dateSeed;
    };
    Ticketer.prototype.tktBody = function (tktArgs) {
        var names = Object.keys(tktArgs);
        names.sort(); // put into fixed order
        var body = '';
        for (var i = 0; i < names.length; i++) {
            if (tktArgs[names[i]] != null) {
                if (body) {
                    body += '|';
                }
                body += names[i] + "=" + tktArgs[names[i]];
            }
        }
        return body;
    };
    Ticketer.prototype._computeDateSeed = function (dt) {
        if (dt.getMonth || dt.month) {
            if (!dateUtil.isMoment(dt)) {
                dt = new dateUtil(dt);
            }
        }
        else {
            dt = new dateUtil();
        }
        this._dateSeed = dt.format("DDMMMYY-HH:mm:ss");
        this._dateSeed += '-' + Math.floor(Math.random() * 10000);
        return this._dateSeed;
    };
    // @ts-ignore: unused parameter
    Ticketer.prototype._getKey = function (dateSeed) {
        // Fetch from datebase based on date 
        // Datebase can store (date, key) pairs.  Search will
        // return the key corresponding to the date that's the 
        // closest one before the date of the next key.
        return this._secret;
    };
    return Ticketer;
}());
exports.Ticketer = Ticketer;
//# sourceMappingURL=index.js.map