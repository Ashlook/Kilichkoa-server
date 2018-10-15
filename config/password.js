const crypto = require('crypto');

module.exports = class Password {
    constructor(pwd) {
        this.salt = this.generateSalt(12);
        this.plain = pwd;
        this.hash = this.sha512(this.plain, this.salt);
    }
    
    sha512(pwd, salt) {
        return crypto.createHmac('sha512', salt).update(pwd).digest('hex');
    }

    generateSalt(length) {
        return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0,length);
    }

    static Check(hash, salt, plain){
        return crypto.createHmac('sha512', salt).update(plain).digest('hex') === hash;
    }
}