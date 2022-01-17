<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Removebutton from "./Removebutton.svelte";
  import IoMdOpen from "svelte-icons/io/IoMdOpen.svelte";

  export let code: string;
  export let file: string;
  export let isValid: boolean;

  const dispatch = createEventDispatcher();

  function onOpenFolder() {
    dispatch("open-folder");
  }

  function onRemoveConfirm() {
    dispatch("remove-confirm");
  }

  $: console.log({ file });
</script>

{#if isValid}
  <div class="message success">Good, it's still valid</div>
{:else}
  <div class="message warning">You've gone too far</div>
{/if}

<div class="preview">
  <div class="code">
    <div class="open" on:click={onOpenFolder}>
      <IoMdOpen />
    </div>
    <div class="truncate">{code}</div>
  </div>
  <div>
    <img class="file" src={file} alt="Code: {code}" />
  </div>
  <div>
    <Removebutton on:confirm={onRemoveConfirm} />
  </div>
</div>

<style>
  .preview {
    width: 400px;
    border-radius: 4px;
    text-align: center;
    position: relative;
    background-color: rgb(155, 155, 175);
  }

  .open {
    right: 4px;
    width: 24px;
    cursor: pointer;
    position: absolute;
  }

  .truncate {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .open:hover {
    color: pink;
  }

  .message {
    width: 400px;
    text-align: center;
    margin-bottom: 8px;
  }

  .code {
    padding: 8px;
    font-size: 18px;
    padding-right: 32px;
    background-color: rgba(0, 0, 0, 0.178);
  }

  .file {
    width: 100%;
    height: auto;
    display: flex;
  }

  .success {
    color: rgb(12, 224, 12);
  }

  .warning {
    color: rgb(236, 119, 10);
  }
</style>
