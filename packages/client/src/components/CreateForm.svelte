<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let value: string;

  function onClick() {
    if (value.length) {
      dispatch("update", value);
    }
  }

  function onInput({ target }) {
    value = target.value;
  }
</script>

<div class="form">
  <input
    on:input={onInput}
    type="text"
    {value}
    placeholder="http://... or text"
  />

  <button on:click={onClick} disabled={!value.length}>create code</button>
</div>

<style>
  .form {
    display: flex;
  }

  input,
  button {
    border: 0;
    padding: 8px;
    font-size: inherit;
  }

  input {
    outline: none;
    color: rgb(48, 48, 48);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  button {
    color: #eee;
    cursor: pointer;
    text-transform: uppercase;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: rgb(100, 211, 27);
  }

  button:disabled {
    color: rgb(169, 169, 173);
    cursor: not-allowed;
    background-color: rgb(50, 88, 45);
  }
</style>
