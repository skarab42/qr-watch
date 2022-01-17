<script lang="ts">
  import WS from "./lib/ws";
  import CreateForm from "./components/CreateForm.svelte";
  import type { Message } from "@qr-watch/types";

  let code = null;
  let value = "";

  const ws = new WS(`ws://${location.host}/ws`);

  ws.on("open", () => {
    ws.emit({ type: "get-code" });
  });

  ws.on("close", () => {
    console.log("close");
  });

  ws.on("error", () => {
    console.log("error");
  });

  ws.on("message", (message: Message) => {
    console.log(message);

    switch (message.type) {
      case "get-code":
        if (message.data) {
          const { data } = JSON.parse(message.data);
          code = data;
        }
        break;
      case "new-code":
        break;
    }
  });

  function onCreateFormUpdate({ detail }) {
    console.log({ newValue: detail });
  }
</script>

<main>
  {#if code}
    {code}
  {:else}
    <div class="box">
      <CreateForm {value} on:update={onCreateFormUpdate} />
    </div>
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

  .box {
    padding: 8px;
  }
</style>
