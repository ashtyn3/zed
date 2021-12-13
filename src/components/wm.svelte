<script lang="ts">
    import winQueue from "../editor/wm/main";
</script>

{#each $winQueue as win}
    <div
        class="wm"
        id={win.name}
        style={win.floating ? "position:absolute;" : ""}
    >
        <svelte:component
            this={win.component}
        />
    </div>
{/each}

<style>
    .wm {
        z-index: 5000;
    }
</style>
