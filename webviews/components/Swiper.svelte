<script lang="ts">
    import type { Question, Answer } from "../shared/types";
    let loadingState: "init" | "more" | "ready" = "init";
    import QuestionCard from "./QuestionCard.svelte";
    import ButtonIcon from "../ui/ButtonIcon.svelte";
    import InputField from "../ui/InputField.svelte";
    import { mutation } from "../shared/mutation";
    import LoadingButton from "../ui/LoadingButton.svelte";
    export let questions: Question[];
    export let accessToken: string;
    let answer: {
        text: string;
        creatorId: string;
        questionId: string;
    } = {
        text: "",
        creatorId: "",
        questionId: "",
    };
    let liked: boolean;
    let form: HTMLFormElement;
    let disabled = false;
    async function view() {
        const id = questions[0].id;
        questions = questions.slice(1);
    }
</script>

<div class="center">
    <div style="position: relative;">
        <QuestionCard bind:question={questions[0]} />
    </div>
    <div style="display: flex; margin-top: 20px;">
        <ButtonIcon
            disabled={false}
            on:click={() => {
                liked = false;
                view();
            }}
            icon="x"
        />
        <div style="width: 70px;" />
        <ButtonIcon
            disabled={false}
            on:click={() => {
                liked = true;
            }}
            icon="heart"
        />
    </div>
    {#if liked}
        <form
            bind:this={form}
            disabled
            on:submit={() => false}
            style="margin-top: 20px;"
        >
            <h1>Let's answer this!</h1>
            <InputField
                required
                name="text"
                label="Answer"
                bind:value={answer.text}
            />
            <div style="padding-top: 20px;">
                <LoadingButton
                    on:click={async () => {
                        if (!form.reportValidity()) {
                            return;
                        }
                        disabled = true;
                        try {
                            answer.questionId = questions[0].id;
                            await mutation(
                                "/answer",
                                {
                                    ...answer,
                                },
                                accessToken,
                                { method: "POST" }
                            );
                            view();
                            liked = false;
                        } catch {}
                        disabled = false;
                    }}
                    type="button"
                    {disabled}
                >
                    {#if disabled}loading{:else}submit{/if}
                </LoadingButton>
            </div>
        </form>
    {/if}
</div>

<style>
    .center {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
