(()=>{var e={860:e=>{"use strict";e.exports=require("express")},13:e=>{"use strict";e.exports=require("mongodb")},738:e=>{"use strict";e.exports=require("multer")}},t={};function s(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n](a,a.exports,s),a.exports}(()=>{const{MongoClient:e}=s(13),t=s(860),n=s(738)();let o;const a=t();a.set("view engine","ejs"),a.set("views","./views"),a.use(t.static("public")),a.use(t.json()),a.use(t.urlencoded({extended:!1})),a.get("/",(async(e,t)=>{const s=await o.collection("Animals").find().toArray();t.render("home",{allAnimals:s})})),a.use((function(e,t,s){t.set("WWW-Authenticate","Basic realm ='Our NERN App"),"Basic YWRtaW46YWRtaW4="==e.headers.authorization?s():(console.log(e.headers.authorization),t.status(401).send("Try again"))})),a.get("/admin",((e,t)=>{t.render("admin")})),a.get("/api/animals",(async(e,t)=>{const s=await o.collection("Animals").find().toArray();t.json(s)})),postMessage("/create-animals",n.single("photo"),(async(e,t)=>{console.log(e.body),t.send("Thank you")})),async function(){const t=new e("mongodb://root:root@localhost:27017/AmazingMemApp?&authSource=admin");await t.connect(),o=t.db(),a.listen(3e3)}()})()})();