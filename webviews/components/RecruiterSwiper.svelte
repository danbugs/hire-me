<script lang="ts">
    import type { Question, Answer } from "../shared/types";
    import QuestionCard from "./QuestionCard.svelte";
    import ButtonIcon from "../ui/ButtonIcon.svelte";
    import { onMount } from "svelte";
    export let questions: Question[];
    let answers: Answer[];

    async function view() {
        const id = questions[0].id;
        questions = questions.slice(1);
    }
    onMount(async () => {
        const response = await fetch(`${apiBaseUrl}/answer`, {
            body: {
                questionId: questions[0].id,
            } as any,
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });
        const payload = await response.json();
        answers = payload.questions;
    });
</script>

<div class="center">
    <div style="position: relative;">
        <QuestionCard bind:question={questions[0]} />
    </div>
    <div style="display: flex;">
        <div style="width: 70px;" />
        <ButtonIcon
            disabled={true}
            on:click={() => {
                view();
            }}
            icon="arrow-left"
        />
        <ButtonIcon
            disabled={false}
            on:click={() => {
                view();
            }}
            icon="arrow-right"
        />
    </div>
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
