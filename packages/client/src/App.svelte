<script lang="ts">
  import Input from "./lib/Input.svelte";
  import type { Message } from "@qr-watch/types";

  const socket = new WebSocket(`ws://${location.host}/ws`);

  function sendJSON(message: Message) {
    socket.send(JSON.stringify(message));
  }

  socket.addEventListener("open", () => {
    sendJSON({ type: "init" });
  });

  socket.addEventListener("message", (event) => {
    const message: Message = JSON.parse(event.data);

    console.log(message);
    mainClass = "";

    if (message.type === "show-form") {
      showForm = true;
      showImage = false;
    } else if (message.type === "load-image") {
      showForm = false;
      showImage = true;
    } else if (message.type === "qr-status") {
      qrValid = message.data === "ok";
      mainClass = qrValid ? "green" : "red";
      console.log(qrValid);
    }
  });

  function create({ detail }) {
    sendJSON({ type: "create-qrcode", data: detail });
  }

  let showForm = false;
  let showImage = false;
  let qrValid = false;
  let value = "";
  let mainClass = "";
</script>

<main class={mainClass}>
  {#if showForm}
    <Input {value} on:create={create} />
  {/if}

  {#if showImage}
    <div class="image">image...</div>
  {/if}
</main>

<style>
  :root {
    color: #eee;
    font-size: 32px;
    background-color: #111;
  }

  :global(html, body, #app, main) {
    height: 100%;
    margin: 0;
  }

  .image {
    height: 100%;
  }

  .red {
    background-color: red;
  }

  .green {
    background-color: green;
  }
</style>
