<script lang="ts">
    import type { Question } from "../shared/types";
    export let question: Question;
    export let stamp: "nope" | "liked" | undefined = undefined;
  </script>
  
  <style>
    .img-container {
      width: 400px;
      position: relative;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    }
    div {
      color: #fff;
    }
    .nope {
      position: absolute;
      right: 30px;
      top: 40px;
      transform: rotate(20deg);
      padding: 4px 6px;
      font-size: 50px;
      color: var(--vscode-inputValidation-errorBorder);
      border-radius: 4px;
      border: solid 4px var(--vscode-inputValidation-errorBorder);
    }
    .liked {
      position: absolute;
      left: 30px;
      top: 40px;
      transform: rotate(-20deg);
      padding: 4px 6px;
      font-size: 50px;
      color: green;
      border-radius: 4px;
      border: solid 4px green;
    }
  </style>
  
  <div class="img-container">
    {#if stamp === 'nope'}
      <div class="nope">NOPE</div>
    {:else if stamp === 'liked'}
      <div class="liked">LIKED</div>
    {/if}
    {#if question}
        <div>{question.text}</div>
        {:else}
        <div>You've run out of questions!</div>
    {/if}
  </div>