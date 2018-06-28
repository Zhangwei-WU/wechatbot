"use strict";
/* tslint:disable:variable-name */
//import QrcodeTerminal from 'qrcode-terminal'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Change `import { ... } from '../'`
 * to     `import { ... } from 'wechaty'`
 * when you are runing with Docker or NPM instead of Git Source.
 */
const wechaty_1 = require("wechaty");
const welcome = `
=============== Powered by Wechaty ===============
-------- https://github.com/Chatie/wechaty --------
Hello,
I'm a Wechaty Botie with the following super powers:
1. List all your contacts with weixn id & name
__________________________________________________
Hope you like it, and you are very welcome to
upgrade me for more super powers!
Please wait... I'm trying to login in...
`;
console.log(welcome);
const bot = wechaty_1.Wechaty.instance();
bot
    .on('login', function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        wechaty_1.log.info('Bot', `${user.name()} logined`);
        yield this.say('wechaty contact-bot just logined');
        /**
         * Main Contact Bot start from here
         */
        yield main();
    });
})
    .on('logout', user => wechaty_1.log.info('Bot', `${user.name()} logouted`))
    .on('error', e => wechaty_1.log.info('Bot', 'error: %s', e))
    .on('scan', (qrcode, status) => {
    //QrcodeTerminal.generate(qrcode)
    console.log(`${qrcode}\n[${status}] Scan QR Code in above url to login: `);
});
bot.start()
    .catch((e) => __awaiter(this, void 0, void 0, function* () {
    wechaty_1.log.error('Bot', 'init() fail: %s', e);
    yield bot.stop();
    process.exit(-1);
}));
/**
 * Main Contact Bot
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const contactList = yield bot.Contact.findAll();
        wechaty_1.log.info('Bot', '#######################');
        wechaty_1.log.info('Bot', 'Contact number: %d\n', contactList.length);
        /**
         * official contacts list
         */
        for (let i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            if (contact.type() === wechaty_1.Contact.Type.Official) {
                wechaty_1.log.info('Bot', `official ${i}: ${contact}`);
            }
        }
        /**
         *  personal contact list
         */
        for (let i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            if (contact.type() === wechaty_1.Contact.Type.Personal) {
                wechaty_1.log.info('Bot', `personal ${i}: ${contact.name()} : ${contact.id}`);
            }
        }
        const MAX = 17;
        for (let i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            /**
             * Save avatar to file like: "1-name.jpg"
             */
            const file = yield contact.avatar();
            const name = file.name;
            yield file.toFile(name, true);
            wechaty_1.log.info('Bot', 'Contact: "%s" with avatar file: "%s"', contact.name(), name);
            if (i > MAX) {
                wechaty_1.log.info('Bot', 'Contacts too many, I only show you the first %d ... ', MAX);
                break;
            }
        }
        const SLEEP = 7;
        wechaty_1.log.info('Bot', 'I will re-dump contact weixin id & names after %d second... ', SLEEP);
        setTimeout(main, SLEEP * 1000);
    });
}
//# sourceMappingURL=mainbot.js.map