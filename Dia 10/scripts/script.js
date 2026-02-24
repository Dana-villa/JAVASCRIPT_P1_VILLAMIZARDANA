// Web Component
// Permite crear etiquetas personalizadas con código fuente de HTML
// Entre sus componentes está lo siguiente
// 1. Custom Elements: Etiquetas personalizadas (ej: <x-counter>).
// 2. Shadow DOM : Encapsulamiento de DOM + estilos que conlleva.
//(Evitar que los estilos de "afuera" rompan el componente)

// REGLA DE ORO: Si quiero tener etiquetas personalizadas : WebComponent
// Si quiero tener estilos encapsulados : ShadowDOM

//Implementación de un CustomElement
//<hello-card name="Pedro"></hello-card>
class HelloCard extends HTMLElement{
  connectedCallback(){
      const name = this.getAttribute("name") ?? "mundo";
      this.innerHTML=`
      <div style="padding:12px;border:1px solid #ccc;border-radius:12px">
      <strong>Hola, ${name} 👋</strong>
      <p>Este es un Custom Element sin Shadow DOM......</p>
    </div>
      `;
  }
};
customElements.define("hello-card",HelloCard);

//ShadowDom + estilos encapsulados
//<x-counter> , que sería un contador con estilos aislados
const template = document.createElement("template");//<template></template>

template.innerHTML=`
<style>
  :host { display: inline-block; font-family: system-ui, sans-serif; }
  .wrap { border: 1px solid #ddd; border-radius: 14px; padding: 12px; }
  button { padding: 8px 10px; border-radius: 10px; border: 1px solid #ccc; cursor: pointer; }
  .value { font-size: 20px; margin: 0 10px; display: inline-block; min-width: 2ch; text-align: center; }
</style>

<div class="wrap">
  <button id="dec">-</button>
  <span class="value" id="value">0</span>
  <button id="inc">+</button>
</div>`;

class XCounter extends HTMLElement{
  #value=0; //Variable privada llamada value con valor de cero
  constructor(){
      super();
      this.attachShadow({mode:"open"});//Habilita ShadowDOM
      this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  #render(){//Esta creada para que cada vez que haya un cambio en el iterador, renderize.
      this.shadowRoot.getElementById("value").textContent=String(this.#value);
  }
  #emit(){
      //Al haber un evento con ShadowDOM, hay que emitirlo
      this.dispatchEvent(
          new CustomEvent("change",{
              detail:{value:this.#value},
              bubbles:true,
              composed:true,
          })
      )
  }
  connectedCallback(){
      //Diseñado para que cada vez que haya un cambio realice diferentes elementos
      this.shadowRoot.getElementById("inc").addEventListener("click",()=>{
          this.#value++;
          this.#render();
          this.#emit();
      });
      this.shadowRoot.getElementById("dec").addEventListener("click",()=>{
          this.#value--;
          this.#render();
          this.#emit();
      });
  }
}
customElements.define("x-counter",XCounter);