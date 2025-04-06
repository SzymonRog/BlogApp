import express from "express"
import bodyParser from "body-parser"
import { writeFile } from 'fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, unlink } from "node:fs";

    
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let titles = [];
let dates = [];
let currentBlogIndx;

function formatTime(number) {
    return number < 10 ? '0' + number : number;
}
function sanitizeTitle(title) {
    return title.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ \-_]/g, '').trim();
}
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res) =>{
    res.render("index.ejs",{
        titles: titles,
        dates: dates
    })
    currentBlogIndx = NaN;

});

app.get("/blog",(req,res) =>{
    let title = titles[req.query.id]
    currentBlogIndx = req.query.id;
    try{
        let content = readFileSync(`${__dirname}/public/blogs/${sanitizeTitle(title)}.txt`)
        res.render("blog.ejs", {
            title: title,
            content: content
        })
    } catch(err){
        titles.splice(req.query.id,1)
        dates.splice(req.query.id,1)
        res.render("blog.ejs", {
            title: 'Błąd',
            content:'nie udało się załadować pliku',
        })
        
    }
});

app.post("/create",(req,res) =>{
    let title = req.body.title
    let content = req.body.content
    let currentDate = new Date()
    let time = `${formatTime(currentDate.getHours())}:${formatTime(currentDate.getMinutes())}`
    
    if(!titles.includes(title)){
        try {
            dates.push(time)
            titles.push(title)
            writeFile(`public/blogs/${sanitizeTitle(title)}.txt`, content)
        } catch (err) {
            console.error(err);
        }
 
    }
    res.redirect('/')
    });  


app.post("/delete-blog", (req,res) =>{
    var title = titles[currentBlogIndx]
    if((typeof(title) === 'undefined')){
        res.redirect("/")
    } else{
        unlink(`${__dirname}/public/blogs/${sanitizeTitle(title)}.txt`, (err) => {
        if (err) {
            console.error("Błąd podczas usuwania pliku:", err);
        }

        titles.splice(req.query.id, 1);
        dates.splice(req.query.id, 1);

        res.redirect("/");
        });
    }
    
});

app.post('/edit', (req,res) =>{

    let title = req.body['title-edit']
    let content = req.body['content-edit']
    let currentDate = new Date()
    let time = `${formatTime(currentDate.getHours())}:${formatTime(currentDate.getMinutes())}`
    
    var titleToDel = titles[currentBlogIndx]

    unlink(`${__dirname}/public/blogs/${sanitizeTitle(titleToDel)}.txt`, (err) => {
        if (err) {
            return;
        }   
    });
    titles.splice(currentBlogIndx,1)
    dates.splice(currentBlogIndx,1)


    if(!titles.includes(title)){
        dates.push(time)
        titles.push(title) 
        writeFile(`public/blogs/${sanitizeTitle(title)}.txt`, content, err => {
        if (err) {
          console.error(err);
        } else {
            res.redirect('/')
        }
        }); 
    }
    res.redirect(`/blog?id=${currentBlogIndx}`)

});

app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
});


