

/* tslint:disable:variable-name */
//import QrcodeTerminal from 'qrcode-terminal'

/**
 * Change `import { ... } from '../'`
 * to     `import { ... } from 'wechaty'`
 * when you are runing with Docker or NPM instead of Git Source.
 */
import {
  Wechaty,
  log,
  Contact,
}               from 'wechaty'

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
`

console.log(welcome)
const bot = Wechaty.instance()

bot
.on('login'	  , async function(this, user) {
  log.info('Bot', `${user.name()} logined`)
  await this.say('wechaty contact-bot just logined')

  /**
   * Main Contact Bot start from here
   */
  await main()

})
.on('logout'	, user => log.info('Bot', `${user.name()} logouted`))
.on('error'   , e => log.info('Bot', 'error: %s', e))
.on('scan', (qrcode, status) => {
  //QrcodeTerminal.generate(qrcode)
  console.log(`${qrcode}\n[${status}] Scan QR Code in above url to login: `)
})

bot.start()
.catch(async e => {
  log.error('Bot', 'init() fail: %s', e)
  await bot.stop()
  process.exit(-1)
})

/**
 * Main Contact Bot
 */
async function main() {
  const contactList = await bot.Contact.findAll()

  log.info('Bot', '#######################')
  log.info('Bot', 'Contact number: %d\n', contactList.length)

  /**
   * official contacts list
   */
  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i]
    if (contact.type() === Contact.Type.Official) {
      log.info('Bot', `official ${i}: ${contact}`)
    }
  }

  /**
   *  personal contact list
   */

  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i]
    if (contact.type() === Contact.Type.Personal) {
      log.info('Bot', `personal ${i}: ${contact.name()} : ${contact.id}`)
    }
  }

  const MAX = 17
  for (let i = 0; i < contactList.length; i++ ) {
    const contact = contactList[i]

    /**
     * Save avatar to file like: "1-name.jpg"
     */
    const file = await contact.avatar()
    const name = file.name
    await file.toFile(name, true)

    log.info('Bot', 'Contact: "%s" with avatar file: "%s"',
                    contact.name(),
                    name,
            )

    if (i > MAX) {
      log.info('Bot', 'Contacts too many, I only show you the first %d ... ', MAX)
      break
    }
  }

  const SLEEP = 7
  log.info('Bot', 'I will re-dump contact weixin id & names after %d second... ', SLEEP)
  setTimeout(main, SLEEP * 1000)

}