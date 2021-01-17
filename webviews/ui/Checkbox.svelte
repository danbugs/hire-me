<script lang="ts">
    export let value: boolean;
    export let option: { value: string; label: string };
</script>

<style>
    div {
        display: flex;
    }
    label {
        margin-right: 6px;
        display: flex;
    }
    input {
        margin-left: 0px;
        width: unset;
    }
</style>

<div>
    <label>
        <input type="checkbox" bind:group={value} value={option.value} />            
        {option.label}
    </label>
</div>