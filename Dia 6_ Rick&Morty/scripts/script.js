document.getElementById("searchBtn").addEventListener("click",function (){
    let nombre = document.getElementById("nameInput").value;
    let linksito="https://rickandmortyapi.com/api/character/?name="+nombre;
    console.log(linksito);
    fetch(linksito)
    .then(function (res){return res.json();})
    .then((data)=>{
        console.log(data["results"]);
        let contenedor = document.getElementById("results");
        contenedor.innerHTML="";
        if(data["results"]){
            for (let i=0;i<data["results"].length;i++){
            contenedor.innerHTML+=`
            <div class="card">
            <img src="${data["results"][i]["image"]}" alt="">
            <h3>${data["results"][i]["name"]}</h3>
            <p>Estado: ${data["results"][i]["status"]}</p>
        </div>
            `;
        }
        }else{
            contenedor.innerHTML="<p>No hay resultados</p>";
        }        
    })
})