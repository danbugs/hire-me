<script lang="ts">
    import { mutation } from "../shared/mutation";
    import type { User } from "../shared/types";
    import InputField from "../ui/InputField.svelte";
    import LoadingButton from "../ui/LoadingButton.svelte";
    import Checkbox from "../ui/Checkbox.svelte";

    export let data: User;
    export let buttonText: string;
    export let accessToken: string;
    let form: HTMLFormElement;
    let disabled = false;
    let show = data.isRecruiter ? false : true;
</script>

<form
    bind:this={form}
    disabled
    on:submit={() => false}
    style="margin-top: 20px;"
>
    <div>
        <InputField required name="name" label="Name" bind:value={data.name} />
    </div>
    {#if show}
        <div>
            <div class="label">Are you a recruiter?</div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        bind:checked={data.isRecruiter}
                        value={"true"}
                    />
                    {"yes"}
                </label>
            </div>
        </div>
    {/if}
    <div style="padding-top: 20px;">
        <LoadingButton
            on:click={async () => {
                if (!form.reportValidity()) {
                    return;
                }
                disabled = true;
                try {
                    await mutation(
                        "/user",
                        {
                            ...data,
                        },
                        accessToken,
                        { method: "PUT" }
                    );
                } catch {}
                disabled = false;
                show = false;
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
    .label {
        margin-bottom: 4px;
        font-size: calc(var(--vscode-font-size) * 0.9);
    }
</style>
