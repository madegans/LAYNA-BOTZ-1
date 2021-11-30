const {
	WAConnection: _WAConnection,
	MessageType,
	Presence,
	mentionedJid
} = require('@adiwajshing/baileys')
const simple = require('./lib/simple')
const WAConnection = simple.WAConnection(_WAConnection)
const geps = new WAConnection()
const fs = require('fs-extra')
const ms = require('parse-ms')
const figlet = require('figlet')
const { color, bgcolor, LogZ } = require('./lib/color')
const setting = JSON.parse(fs.readFileSync('./settings.json'));
const welcome = require('./message/group')
baterai = '?'
charging = 'unknown'
blocked = []

const sleep = async (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms))
	}
	
require('./Layna.js')
nocache('./Layna.js', module => console.log(color(`${module} is now update!`,'greenyellow')))

async function starts(sesion) {
	geps.logger.level = 'warn'
	geps.version = [2, 2140, 12]
	console.log('Starting bot...')
	console.log(color(figlet.textSync('SELF BOT', {
font: 'Standard',
horizontalLayout: 'default',
vertivalLayout: 'default',
width: 60,
whitespaceBreak: false
}), 'red'))
geps.on('qr', () => {
console.log(color('[','white'), color('!','red'), color(']','white'), color('QR KODE SIAP UNTUK DI SCAN'))
})
fs.existsSync(sesion) && geps.loadAuthInfo(sesion)
geps.on('connecting', () => {
console.log(LogZ('wait....'))
})
geps.on('open', () => {
console.log(LogZ('Tersambung....'))
})
await geps.connect({timeoutMs: 30 * 1000})
fs.writeFileSync(sesion, JSON.stringify(geps.base64EncodedAuthInfo(), null, '\t'))

geps.on('ws-close', () => {
console.log(LogZ('Koneksi terputus, mencoba menghubungkan kembali..'))
})
geps.on('close', async ({ reason, isReconnecting }) => {
console.log(LogZ('Terputus, Alasan :' + reason + '\nMencoba mengkoneksi ulang :' + isReconnecting))
if (!isReconnecting) {
console.log(LogZ('Connect To Phone Rejected and Shutting Down.'))
}
})

//Baterai
geps.on('CB:action,,battery', json => {
	global.batteryLevelStr = json[2][0][1].value
global.batterylevel = parseInt(batteryLevelStr)
baterai = batterylevel
if (json[2][0][1].live == 'true') charging = true
if (json[2][0][1].live == 'false') charging = false
})
global.batrei = global.batrei ? global.batrei : []
geps.on('CB:action,,battery', json => {
const batteryLevelStr = json[2][0][1].value
const batterylevel = parseInt(batteryLevelStr)
global.batrei.push(batterylevel)
})

//Group Update
geps.on('group-participants-update', async (anu) => {
await welcome(geps, anu)
})

//Anti Delete
try {
geps.on('message-delete', async (m) => {
if (m.key.remoteJid == 'status@broadcast') return
function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
const from = m.key.remoteJid
const isGroup = m.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? m.participant : m.key.remoteJid
const dataRevoke = JSON.parse(fs.readFileSync('./database/group/antidelete.json'))
const dataCtRevoke = JSON.parse(fs.readFileSync('./database/ct-revoked.json'))
const dataBanCtRevoke = JSON.parse(fs.readFileSync('./database/ct-revoked-banlist.json'))
const isRevoke = !isGroup ? true : isGroup ? dataRevoke.includes(from) : false
const isCtRevoke = isGroup ? true : dataCtRevoke.data ? true : false
const isBanCtRevoke = isGroup ? true : !dataBanCtRevoke.includes(sender) ? true : false
if (!isRevoke) return
if (!isCtRevoke) return
if (!isBanCtRevoke) return
if (m.key.fromMe) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
let d = new Date
let locale = 'id'
let calender = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
const type = Object.keys(m.message)[0]
let teks = `── 「 *ANTI DELETE* 」 ──

⬡ *DARI  : @${m.participant.split("@")[0]}*
⬡ *NOMOR  : ${m.participant.split("@")[0]}*
⬡ *TANGGAL  : ${calender}*`
if (isGroup) buttons = [{buttonId: `.antidelete mati`, buttonText: {displayText: 'DISABLE ANTIDELETE'}, type: 1}]
if (!isGroup) buttons = [{buttonId: `.antidelete ctmati`, buttonText: {displayText: 'DISABLE ANTIDELETE'}, type: 1}]
const buttonMessage = {
headerType: "IMAGE",
contentText: teks,
footerText: 'Loh, Kok Di Hapus..?',
buttons: buttons,
headerType: 1
}
await geps.sendMessage(m.key.remoteJid, buttonMessage, MessageType.buttonsMessage, {quoted: m.message, contextInfo: {mentionedJid: parseMention(teks)}})
geps.copyNForward(m.key.remoteJid, m.message)
})
} catch (e) {
console.log('Error : %s', color(e, 'red'))
}

//Anti Call
geps.on('CB:action,,call', async json => {
	const callerId = json[2][0][1].from;
geps.sendMessage(callerId, `*「 CALL DETECTED 」*\n\nMaaf, Kamu Telah Melanggar Rules Bot\n\nAuto Block System ~`, MessageType.text)
geps.sendMessage(`${setting.nomerowner}@s.whatsapp.net`, `*◯ PANGGILAN ◯*\n\nCalling Detected From @${callerId.split("@")[0]} >_<`, MessageType.text, { contextInfo: {"mentionedJid": [callerId]}})
await sleep(4000)
await geps.blockUser(callerId, "add")
})
geps.on('CB:Blocklist', json => {
if (blocked.length > 2) return
for (let i of json[1].blocklist) {
blocked.push(i.replace('c.us','s.whatsapp.net'))
}
})       
}

//Chat Update
geps.on('chat-update', async (mek) => {
	require('./Layna.js')(geps, mek)
	})
	
function nocache(module, cb = () => { }) {
	console.log(color('MODULE','white'), color(`'${module}'`,'greenyellow'))
fs.watchFile(require.resolve(module), async () => {
await uncache(require.resolve(module))
cb(module)
})
}

function uncache(module = '.') {
	return new Promise((resolve, reject) => {
try {
delete require.cache[require.resolve(module)]
resolve()
} catch (e) {
reject(e)
}
})
}

starts('./session.json')
.catch(console.log)

module.exports = {
	geps
}