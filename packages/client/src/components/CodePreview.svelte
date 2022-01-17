<script lang="ts">
  import Removebutton from "./Removebutton.svelte";

  export let code: string;
  export let file: string;
</script>

<div class="preview">
  <div class="code">{code}</div>
  <div><img class="file" src={file} alt="Code: {code}" /></div>
  <Removebutton on:confirm />
</div>

<style>
  .preview {
    width: 400px;
    border-radius: 4px;
    text-align: center;
    background-color: rgb(155, 155, 175);
  }

  .code {
    padding: 4px;
    background-color: rgba(0, 0, 0, 0.178);
  }

  .file {
    width: 100%;
  }
</style>
