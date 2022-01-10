<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let value: string;

  function create() {
    if (value.length) {
      dispatch("create", value);
    }
  }

  function update({ target }) {
    value = target.value;
  }
</script>

<input on:input={update} type="text" {value} />
<button on:click={create} disabled={!value.length}>create</button>

<style>
  input,
  button {
    padding: 8px;
  }
</style>
