<script lang="ts">
    import { mutation } from "../shared/mutation";
    import type { User } from "../shared/types";
    import InputField from "../ui/InputField.svelte";
    import LoadingButton from "../ui/LoadingButton.svelte";
    export let data: User;
    export let buttonText: string;
    export let accessToken: string;
    let form: HTMLFormElement;
    let disabled = false;
</script>

<form
    bind:this={form}
    disabled
    on:submit={() => false}
    style="margin-top: 20px;"
>
    <div>
        <InputField
            required
            name="name"
            label="Name"
            bind:value={data.name}
        />
    </div>
    <div style="padding-top: 20px;">
        <LoadingButton
            on:click={async () => {
                if (!form.reportValidity()) {
                    return;
                }
                disabled = true;
                try {
                    const { user } = await mutation(
                        "/user",
                        {
                            ...data,
                        },
                        accessToken,
                        { method: "PUT" }
                    );
                } catch {}
                disabled = false;
            }}
            type="button"
            {disabled}
        >
            {#if disabled}loading{:else}{buttonText}{/if}
        </LoadingButton>
    </div>
</form>

<style>
    form > div {
        margin-bottom: 30px;
    }
</style>
