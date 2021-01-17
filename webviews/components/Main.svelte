<script lang="ts">
    import { onMount } from "svelte";
    import { mutation } from "../shared/mutation";
    import type { User, Question, Answer } from "../shared/types";
    import InputField from "../ui/InputField.svelte";
    import LoadingButton from "../ui/LoadingButton.svelte";
    import RecruiterSwiper from "./RecruiterSwiper.svelte";
    import Swiper from "./Swiper.svelte";
    let accessToken = "";
    let loading = true;
    let user: User | null = null;
    let question: {
        text: string;
        creatorId: string;
    } = {
        text: "",
        creatorId: "",
    };
    let disabled = false;
    let form: HTMLFormElement;
    let questions: Question[] = [];
    let recruiter_questions: Question[] = [];
    let answers: Answer[] = [];
    let submitters: User[] = [];
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

                    const response2 = await fetch(`${apiBaseUrl}/question`, {
                        headers: {
                            authorization: `Bearer ${accessToken}`,
                        },
                    });
                    const payload2 = await response2.json();
                    questions = payload2.questions;

                    const response3 = await fetch(
                        `${apiBaseUrl}/recruiter_question`,
                        {
                            headers: {
                                authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    const payload3 = await response3.json();
                    recruiter_questions = payload3.questions;

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
        });
        tsvscode.postMessage({ type: "get-token", value: undefined });
    });
</script>

{#if user}
    {#if user.isRecruiter}
        <form
            bind:this={form}
            disabled
            on:submit={() => false}
            style="margin-top: 20px;"
        >
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
        </form>
        {#if questions && (submitters.length > 0) && answers}
            <div>
                <h1>Your questions:</h1>
                <RecruiterSwiper {questions} {answers} {accessToken} {submitters}/>
            </div>
        {/if}
    {/if}
{/if}

{#if user}
    {#if !user.isRecruiter}
        <Swiper {questions} {accessToken} />
    {/if}
{/if}
