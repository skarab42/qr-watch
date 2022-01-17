<script lang="ts">
  import WS from "./lib/ws";
  import Options from "./components/Options.svelte";
  import CreateForm from "./components/CreateForm.svelte";
  import CodePreview from "./components/CodePreview.svelte";

  import type { Message } from "@qr-watch/types";

  let code = "";
  let file = "";
  let isValid = false;

  const sounds = {
    ok: new Audio("sounds/ok.wav"),
    ko: new Audio("sounds/ko.wav"),
  };

  const store = localStorage.getItem("playOn");
  const playOn = store
    ? JSON.parse(store)
    : {
        ok: true,
        ko: true,
      };

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
    switch (message.type) {
      case "get-code":
      case "new-code":
        code = message.code;
        file = message.file;
        break;
      case "remove-code":
        code = "";
        break;
      case "check-code":
        isValid = message.isValid;
        let [filename] = file.split("?");
        file = `${filename}?${Date.now()}`;
        playSound(isValid);
        break;
    }
  });

  function onCreateFormUpdate({ detail }) {
    ws.emit({ type: "new-code", code: detail });
  }

  function onOpenFolder() {
    ws.emit({ type: "open-public-dir" });
  }

  function onRemoveButtonConfirm() {
    ws.emit({ type: "remove-code" });
  }

  function playSound(isValid: boolean) {
    if (isValid && playOn.ok) {
      sounds.ok.play();
    } else if (!isValid && playOn.ko) {
      sounds.ko.play();
    }
  }
</script>

<main>
  {#if code}
    <CodePreview
      {file}
      {code}
      {isValid}
      on:open-folder={onOpenFolder}
      on:remove-confirm={onRemoveButtonConfirm}
    />
    <Options {playOn} />
  {:else}
    <CreateForm value={code} on:update={onCreateFormUpdate} />
  {/if}
</main>

<style>
  @font-face {
    font-family: "Roboto";
    src: url("fonts/Roboto-Regular.ttf") format("truetype");
  }

  :root {
    color: #eee;
    font-size: 32px;
    background-color: #111;
    font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  :global(html, body, #app, main) {
    height: 100%;
    margin: 0;
  }

  main {
    padding: 8px;
  }
</style>
