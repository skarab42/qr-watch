<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let value: string;

  let confirmString =
    "This action will permanently delete the qr-code from your disk. Please confirm your choice.";

  function onClick() {
    if (confirm(confirmString)) {
      dispatch("confirm", value);
    }
  }
</script>

<button on:click={onClick}>remove code</button>

<style>
  button {
    width: 100%;
    border: 0;
    color: #eee;
    padding: 8px;
    cursor: pointer;
    font-size: inherit;
    text-transform: uppercase;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: rgb(211, 27, 27);
  }
</style>
