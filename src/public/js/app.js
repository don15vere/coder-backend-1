console.log("App.js cargado correctamente");

const socket = io();

socket.on("updateProducts", data => {
  console.log("Lista actualizada de productos:", data);
});
