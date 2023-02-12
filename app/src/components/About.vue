<template>
  <div
    :class="[showAbout ? 'flex' : 'hidden']"
    class="h-screen fixed w-full z-50 bg-white bg-opacity-90"
    @click="emitEvent('toggleAbout')"
  >
    <div class="px-4 md:px-12 m-auto bg-white">
      <div class="border-500 border-2 px-4 md:px-12 relative" @click.stop>
        <!-- close icon-->
        <div class="absolute top-6 right-6">
          <XIcon @click="emitEvent('toggleAbout')" class="icon icon-primary cursor-pointer" />
        </div>

        <!-- dGrants -->
        <div class="mt-8">
          <h1 class="font-medium">Biblio Tech</h1>
        </div>

        <!-- ToDo. build version -->
        <div class="mt-2">build 0.0.1</div>

        <!-- Team -->
        <div class="mt-16">
          <span>Workstream Team: </span>
          <div  style="margin:3vw">
            Aamina, Fiona, Jeffery, Kaleb, Luciano, Mina Eskandar
          </div>
        </div>

        <!-- ToDo. Link to the real dGrant grant -->
        
        <!-- license & support link -->
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
// --- Icons ---
import { CloseIcon as XIcon } from '@fusion-icons/vue/interface';
import { TwitterIcon as TwitterIcon } from '@fusion-icons/vue/interface';
import { GithubIcon as GithubIcon } from '@fusion-icons/vue/interface';

// package.json is used to inform the displayed version
import packagejson from './../../package.json';

// allow for the dgrants ID to be set in .env
const dgrantsGrantID = import.meta.env.VITE_DGRANTS_GRANT_ID || false;

function useContributors() {
  type Contributor = {
    login: string;
    html_url: string;
  };

  const contributors = ref<Contributor[]>([]);

  onMounted(async () => {
    try {
      const url = 'https://api.github.com/repos/dcgtc/dgrants/contributors';
      const response = await fetch(url);
      contributors.value = await response.json();
    } catch {
      contributors.value = [
        {
          login: 'dGrants',
          html_url: 'https://github.com/dcgtc/dgrants/contributors',
        },
      ];
    }
  });

  return { contributors };
}

export default defineComponent({
  name: 'About',
  props: { showAbout: { type: Boolean, required: true, default: false } },
  components: { XIcon, TwitterIcon, GithubIcon },
  setup(_props, context) {
    const emitEvent = (eventName: string) => context.emit(eventName);
    return { dgrantsGrantID, emitEvent, packagejson, ...useContributors() };
  },
});
</script>
