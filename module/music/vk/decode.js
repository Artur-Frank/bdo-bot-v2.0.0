module.exports = (e, id) => {
    let d = de(e, parseInt(id)),
            c = d;
    if (/\.m3u8\?/.test(c)) {
            var l = (c = c.replace("/index.m3u8", ".mp3")).split("/"),
                    u = -1 !== c.indexOf("audios") ? 1 : 0;
            l.splice(l.length - (2 + u), 1),
                    c = l.join("/")
    }
    return c;
}


const de = function (e, t) {
    function n(e) {
            if (!e || e.length % 4 == 1) return !1;
            for (var t, n, o = 0, a = 0, s = ""; n = e.charAt(a++);)~(n = r.indexOf(n)) && (t = o % 4 ? 64 * t + n : n, o++ % 4) && (s += String.fromCharCode(255 & t >> (-2 * o & 6)));
            return s
    }
    function o(e, t) {
            var n = e.length,
                    o = [];
            if (n) {
                    var r = n;
                    for (t = Math.abs(t); r--;) t = (n * (r + 1) ^ t + r) % n,
                            o[r] = t
            }
            return o
    }
    var r = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=",
            a = {
                    v: function (e) {
                            return e.split("").reverse().join("")
                    },
                    r: function (e, t) {
                            e = e.split("");
                            for (var n, o = r + r, a = e.length; a--;)~(n = o.indexOf(e[a])) && (e[a] = o.substr(n - t, 1));
                            return e.join("")
                    },
                    s: function (e, t) {
                            var n = e.length;
                            if (n) {
                                    var r = o(e, t),
                                            a = 0;
                                    for (e = e.split(""); ++a < n;) e[a] = e.splice(r[n - 1 - a], 1, e[a])[0];
                                    e = e.join("")
                            }
                            return e
                    },
                    i: function (e, n) {
                            return a.s(e, n ^ t)
                    },
                    x: function (e, t) {
                            var n = [];
                            return t = t.charCodeAt(0),
                                    each(e.split(""), function (e, o) {
                                            n.push(String.fromCharCode(o.charCodeAt(0) ^ t))
                                    }),
                                    n.join("")
                    }
            };
    return function (e) {
            if (e && ~e.indexOf("audio_api_unavailable")) {
                    var t = e.split("?extra=")[1].split("#"),
                            o = "" === t[1] ? "" : n(t[1]);
                    if (t = n(t[0]), "string" != typeof o || !t) return e;
                    for (var r, s, i = (o = o ? o.split(String.fromCharCode(9)) : []).length; i--;) {
                            if (r = (s = o[i].split(String.fromCharCode(11))).splice(0, 1, t)[0], !a[r]) return e;
                            t = a[r].apply(null, s)
                    }
                    if (t && "http" === t.substr(0, 4)) return t
            }
            return e
    }(e)
};