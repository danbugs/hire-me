<script lang="ts">
    import { query } from "../shared/query";
    import type { Question } from "../shared/types";
    let loadingState: "init" | "more" | "ready" = "init";
    export let questions: Question[];
</script>

{#each questions as question (question.id)}
<li>
    {question.text}
</li>
{/each}

<style>
</style>
