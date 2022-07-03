const express=require("express");
const routerApi=require("./routes/routerApi.js")
const routerDocs=require("./routes/routerDocs.js")
const route=express();
route.use(express.json())

route.get("/",(req,res,next)=>{
    res.send("hola");
})

route.use("/api", routerApi)
route.use("/docs",routerDocs)

// endware : si las rutas anteriores no puedieron solucionar el error entonces debe caer en el endware

route.use((error, req, res, next)=>{
    console.log(error)
    res.status(500).send({msg_error: "ERROR 😵"})
})

route.listen(3000, ()=>{
    console.log("listening 3000")
})