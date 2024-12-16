const data = new Date()
const hora = data.getHours()

const nome = prompt('Digite seu nome')

const secao = document.querySelector('.boas-vindas')
 if(hora >= 6 && hora < 12){
    secao.innerHTML = '<span> Olá, bom dia!!</span>'
    secao.style.color = '#fff'
 } else if(hora >= 12 && hora < 18){
    secao.innerHTML = '<span> Olá, ' + nome +' :) <br> boa tarde!!</span>'
    secao.style.color = '#fff'
 } else if(hora >= 18 && hora < 23){
    secao.innerHTML = '<span> Olá, boa noite!!</span>'
    secao.style.color = '#fff'
 } else{ 
    secao.innerHTML = '<span> Olá, boa madrugada!!</span>'
    secao.style.color = '#fff'
 }