<script lang="ts">
    import type { Question, Answer, User } from "../shared/types";
    import QuestionCard from "./QuestionCard.svelte";
    import ButtonIcon from "../ui/ButtonIcon.svelte";
    import { onMount } from "svelte";
    import { create_out_transition } from "svelte/internal";
    export let questions: Question[];
    export let answers: Answer[];
    export let accessToken: string;
    export let submitters: User[];
    let counter = 0;
    async function view() {
        const id = questions[0].id;
        counter = 0;
        questions = questions.slice(1);
        const response4 = await fetch(`${apiBaseUrl}/answer`, {
            method: "PUT",
            body: JSON.stringify({
                questionId: questions[0].id,
            }),
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
        const payload4 = await response4.json();
        answers = payload4.answers;
        answers.forEach(async function (value) {
            const response5 = await fetch(`${apiBaseUrl}/user`, {
                method: "PUT",
                body: JSON.stringify({
                    id: value.creatorId,
                }),
                headers: {
                    "content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
            });
            const payload5 = await response5.json();
            submitters = [payload5.user, ...submitters];
        });
    }
</script>

<div class="center">
    <div style="position: relative; margin: 20px;">
        <QuestionCard bind:question={questions[0]} />
    </div>
    <div style="display: flex;">
        <div style="width: 70px;  margin-top: 20px;" />
        <ButtonIcon
            disabled={true}
            on:click={() => {
                view();
            }}
            icon="arrow-left"
        />
        <div style="width: 70px;" />
        <ButtonIcon
            disabled={false}
            on:click={() => {
                view();
            }}
            icon="arrow-right"
        />
    </div>
</div>
<div>
    {#each answers as answer (answer.id)}
        <li style="margin:20px;">{answer.text} by {submitters[counter++].name}</li>
    {/each}
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
