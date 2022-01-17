<script lang="ts">
  import WS from "./lib/ws";
  import CreateForm from "./components/CreateForm.svelte";
  import CodePreview from "./components/CodePreview.svelte";

  import type { Message } from "@qr-watch/types";

  let code = "";
  let file = "";

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
      case "new-code":
        code = message.code;
        file = message.file;
        break;
      case "remove-code":
        code = "";
        break;
    }
  });

  function onCreateFormUpdate({ detail }) {
    ws.emit({ type: "new-code", code: detail });
  }

  function onRemoveButtonConfirm() {
    console.log("Prout");

    ws.emit({ type: "remove-code" });
  }
</script>

<main>
  {#if code}
    <CodePreview {file} {code} on:confirm={onRemoveButtonConfirm} />
  {:else}
    <CreateForm value={code} on:update={onCreateFormUpdate} />
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

  main {
    padding: 8px;
  }
</style>
