<script lang="ts">
  import Removebutton from "./Removebutton.svelte";
  import IoMdOpen from "svelte-icons/io/IoMdOpen.svelte";
  import IoIosWarning from "svelte-icons/io/IoIosWarning.svelte";
  import IoMdCheckmark from "svelte-icons/io/IoMdCheckmark.svelte";
  import { createEventDispatcher } from "svelte";

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

<div class="preview">
  <div class="code">
    <div class="open" on:click={onOpenFolder}>
      <IoMdOpen />
    </div>
    <div class="truncate">{code}</div>
  </div>
  <div>
    {#if isValid}
      <div class="message success">
        <div class="icon"><IoMdCheckmark /></div>
        <div class="text">Good, it's still valid</div>
      </div>
    {:else}
      <div class="message warning">
        <div class="icon"><IoIosWarning /></div>
        <div class="text">You've gone too far</div>
      </div>
    {/if}
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .open:hover {
    color: pink;
  }

  .message {
    display: flex;
    align-items: center;
  }

  .message .text {
    flex: 1 1 auto;
    text-align: left;
  }

  .icon {
    height: 30px;
    padding: 0 8px;
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
    background-color: rgb(12, 224, 12);
  }

  .warning {
    background-color: rgb(236, 119, 10);
  }
</style>
