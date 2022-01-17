<script lang="ts">
  export let playOn;

  $: if (playOn) {
    localStorage.setItem("playOn", JSON.stringify(playOn));
  }
</script>

<div class="options">
  Play sound on
  <label><input type="checkbox" bind:checked={playOn.ok} /> success</label>
  <label><input type="checkbox" bind:checked={playOn.ko} /> warning</label>
</div>

<style>
  .options {
    width: 400px;
    padding: 8px;
    font-size: 18px;
    text-align: center;
  }

  .options label {
    cursor: pointer;
  }
</style>
