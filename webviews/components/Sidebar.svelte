<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../shared/types";
    import EditProfile from "./EditProfile.svelte";
    let accessToken = "";
    let loading = true;
    let user: User | null = null;

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
                    loading = false;
            }
        });
        tsvscode.postMessage({ type: "get-token", value: undefined });
    });
</script>

<!-- svelte-ignore missing-declaration -->
{#if loading}
    <div>loading...</div>
{:else if user}
    <EditProfile
        bind:data={user} {accessToken}
        buttonText="save"
    />
    <button
        on:click={() => {
            accessToken = "";
            user = null;
            tsvscode.postMessage({ type: "logout", value: undefined });
        }}>logout</button>
{:else}
    <button
        on:click={() => {
            tsvscode.postMessage({ type: "authenticate", value: undefined });
        }}>login with GitHub</button
    >
{/if}
