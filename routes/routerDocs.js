const {Router}=require('express');
const path=require('path');
const router=Router();

router.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname,"../public/index.html"))
})


module.exports=router;