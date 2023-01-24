// post routerları buraya yazın
//https://www.yusufsezer.com.tr/node-js-express-route/
const postsModel=require("./posts-model.js");
const expressP = require("express");
const router = expressP.Router();
router.use(expressP.json());

router.get("/", async(req,res) =>
    {
        try
        {
            const posts = await postsModel.find();
            res.status(201).json(posts);
        }
        catch(err)
        {
            res.status(500).json(
                {
                    message: "Gönderiler alınamadı"
                }
            )
        }
    }
);

router.get("/:id", async(req,res) =>
    {
        try
        {
            const comePostId = req.params.id;
            const post = await postsModel.findById(comePostId);
            !post 
            ? 
            res.status(404).json({
                message: "Belirtilen ID'li gönderi bulunamadı"
            })
            : 
            res.status(201).json(post);   
        }
        catch(err)
        {
            res.status(500).json(
                {
                    message: "Gönderi bilgisi alınamadı"
                }
            );
        }
    }
);

router.post("/", async(req,res) =>
    {
        try
        {
            if(!req.body["title"] || !req.body["contents"]){
                res.status(400).json(
                    {
                        message: "Lütfen gönderi için bir title ve contents sağlayın"
                    }
                )
            }
            else{
                const createdPostID = (await postsModel.insert(req.body))["id"];
                const createdPost = await postsModel.findById(createdPostID);
                res.status(201).json(createdPost);
            }
        }
        catch(err)
        {
            res.status(500).json(
                {
                    message: "Veritabanına kaydedilirken bir hata oluştu"
                }
            );
        }
    }
);

router.put("/:id", async(req,res) =>
    {
        try
        {
            const comePostId = req.params.id;
            const possiblePost = await postsModel.findById(comePostId);
            if(!possiblePost){
                res.status(404).json({
                    message: "Belirtilen ID'li gönderi bulunamadı"
                })
            }
            else{
                if(!req.body["title"] || !req.body["contents"]){
                    res.status(400).json(
                        {
                            message: "Lütfen gönderi için title ve contents sağlayın"
                        }
                    )
                }
                else{
                    const updatedPostCode = await postsModel.update(comePostId,req.body);
                    if(updatedPostCode == 1){
                        const updatedPost = await postsModel.findById(comePostId)
                        res.status(200).json(updatedPost);
                    }
                }
            }
        }
        catch(err)
        {
            res.status(500).json(
                {
                    message: "Gönderi bilgileri güncellenemedi"
                }
            );
        }
    }
);

router.delete("/:id", async(req, res) => 
    {
        try
        {
            const comePostId = req.params.id;
            const possiblePost = await postsModel.findById(comePostId);
            if(!possiblePost){
                res.status(404).json(
                    {
                        message: "Belirtilen ID li gönderi bulunamadı"
                    }
                )
            }
            else{
                //removeda then ve temp kullandım olmadı böyle yedeğe alıp sildim
                const tempDeletedPost = await postsModel.findById(comePostId);
                const deletedPostCode = await postsModel.remove(comePostId);
                if(deletedPostCode==1){
                    res.status(201).json(tempDeletedPost);
                }
                else{
                    res.status(444).json(
                        {
                            message: "Sanslı Cıktı"
                        }
                    )
                }
                
            }
        }
        catch(err)
        {
            res.status(500).json(
                {
                    message: "Gönderi silinemedi"
                }
            );
        }
    }
);

router.get("/:id/comments", async(req, res) =>
    {
        try
        {
            const comePostId = req.params.id;
            const possiblePost = await postsModel.findById(comePostId);
            if(!possiblePost){
                res.status(404).json(
                    {
                        message:"Girilen ID'li gönderi bulunamadı."
                    }
                )
            }
            else{
                const postComments = await postsModel.findPostComments(comePostId);
                res.status(200).json(postComments);
            }
        }
        catch(err)
        {
            res.status(500).json(
                { 
                    message: "Yorumlar bilgisi getirilemedi" 
                }
            );
        }
    }
);

module.exports = router;