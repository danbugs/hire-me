<script lang="ts">
    import type { Question, Answer } from "../shared/types";
    import QuestionCard from "./QuestionCard.svelte";
    import ButtonIcon from "../ui/ButtonIcon.svelte";
    export let questions: Question[];
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
            on:click={() => {
                view();
            }}
            icon="arrow-left"
        />
        <div style="width: 70px;" />
        <ButtonIcon
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
