<script lang="ts">
    import { onMount } from "svelte";
import { mutation } from "../shared/mutation";
    import type { User, Question } from "../shared/types";
    import InputField from "../ui/InputField.svelte";
    import LoadingButton from "../ui/LoadingButton.svelte";
    let accessToken = "";
    let loading = true;
    let user: User | null = null;
    let question: Question = {
        text: "",
        creatorId: "",
    };
    let disabled = false;
    let form: HTMLFormElement;

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "token":
                    accessToken = message.value;
                    const response = await fetch(`${apiBaseUrl}/me`, {
                        headers: {
                            authorization: `Bearer ${accessToken}`,
                        },
                    });
                    const data = await response.json();
                    user = data.user;
                    question.creatorId = data.user.id;
                    loading = false;
            }
        });
        tsvscode.postMessage({ type: "get-token", value: undefined });
    });
</script>
<form
    bind:this={form}
    disabled
    on:submit={() => false}
    style="margin-top: 20px;"
>
{#if user}
    {#if user.isRecruiter}
        <h1>Add a Question!</h1>
        <InputField
            required
            name="text"
            label="Question"
            bind:value={question.text}
        />
        <div style="padding-top: 20px;">
            <LoadingButton
                on:click={async () => {
                    if (!form.reportValidity()) {
                        return;
                    }
                    disabled = true;
                    try {
                        await mutation(
                            "/question",
                            {
                                ...question,
                            },
                            accessToken,
                            { method: "POST" }
                        );
                    } catch {}
                    disabled = false;
                }}
                type="button"
                {disabled}
            >
                {#if disabled}loading{:else}submit{/if}
            </LoadingButton>
        </div>
    {/if}
{/if}
</form>
