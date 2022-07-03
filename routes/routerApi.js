const {Router}=require('express');
const router=Router();
const axios=require('axios');

let movies=[];
let reviews=[];

function * genreateMovieId(){
    let id=1;
    while(true){
        yield id;
        id++
    }
}

const getNewId=genreateMovieId();

function createMovies( {title, image, description, genre}){
    let movie={
        id:getNewId.next().value,
        title,
        image,
        description,
        rating:0,
        genre
    };

    movies.push(movie)
    return {msg_message: "Movie created!"}
}

function updateMovie(id,movie){
    const movieToUpdate=movies.find(m=>m.id==id);

    if(!movieToUpdate){
        return{
            msg_error: "Movie not found ❌"
        }
    }else{
        movieToUpdate.title=movie.title
        movieToUpdate.description=movie.description
        movieToUpdate.image=movie.image
        movieToUpdate.genre=movie.genre
        return{
            msg:"Movie update!"
        }
    }

}


function deleteMovie(id){
    if(!movies.find((m)=>m.id ===id)){
        return{
            msg_error:"ID Invalid"
        }
    }else{
        movies=movies.filter((m)=>m.id !==id)
        return{
            msg:"Movie Delete!"
        }
    }
    
}


function getMovieById(id){
    const movie=movies.find(m=>m.id==id);

    if(!movie){
        return{
            msg_error:"Movie not found"
        }
    }else{
        return movie
    }
}

function addReview(review){
    const {id, rating, description}=review
    if(!id || !rating || !description)return{msg_error:"Faltan valores para crear el review"}
    const movie= movies.find((m)=>m.id==id)
    if(!movie) return {msg_error:"Movie not found"}
    reviews.push(review)
    const allReview=reviews.filter((r)=>r.id===id)

    const sumReviews = allReview.reduce(
        (acc, current) =>{
            return acc + current.rating    
        },0
    )

    movie.rating=sumReviews/allReview.length
    return{msg: "review agregada con exito"}
}

function getReviewByMovieId(id){
    if(!movies.find((m)=>m.id===id)){
        return {msg_error: "ID invalid"}
    }
    const allReview=reviews.filter((r)=>r.id===id)
    return allReview
}

router.get("/", (req, res, next) => {
    if(!movies.length){
        return res.json({msg: 'Error no hay peliculas'})
    }else{
        return res.json(movies)
    }
    
})

router.post("/movie",(req,res,next) => {
    const {title, image, description, genre}=req.body;
    if(!title || !image || !description || !genre){
        return res.send({msg_error:"Faltan datos"})
    }

    res.send(createMovies({
        title,
        image,
        description,
        genre    
    }))
})

router.get("/reviews/:movieId",(req,res,next) => {
    const {movieId}=req.params
    if(!movieId){
        return res.send({msg_error:"ID is required!"})
    }else{
        res.send(getReviewByMovieId(parseInt(movieId)))
    }
})

router.post("/review",(req,res,next) => {
    const {movieId, rating, description}=req.body;
    res.send(addReview({ 
        id:movieId, 
        rating, 
        description
    }))
})

router.get("/movie/:movieId",(req,res,next) => {
    try{
    const {movieId}=req.params;
    if(!movieId){
        return res.send({msg_error:"ID is required"})
    }
    res.send(getMovieById(movieId))
    }catch(err){
        next(err)
    }

}) 

router.get("/getUsers",async (req,res,next)=>{
    try{
        const response= await axios.get("https://jsonplaceholder.typicode.com/users");
        res.json(response.data)  
    }catch(error){
        next(error)
    }

})

module.exports=router;