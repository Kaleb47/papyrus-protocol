<template>
  <div
    :class="[showAbout ? 'flex' : 'hidden']"
    class="h-screen fixed w-full"
    style="z-index: 10000; background-color: #ffffffdd"
  >
    <div class="px-4 md:px-12 m-auto bg-white">
      <div class="border-grey-500 border-2 px-4 md:px-12 relative">
        <div class="absolute top-6 right-6">
          <XIcon @click="$emit('toggleAbout')" class="icon icon-primary cursor-pointer" />
        </div>

        <div class="mt-8">
          <h1 class="font-medium"><span class="text-teal">d</span>Grants</h1>
        </div>

        <!-- ToDo. build version -->
        <div class="mt-2">build 0.0.0.0</div>

        <div class="mt-16">
          <span>Dezentralize Gitcoin – Workstream Team: </span>
          <span :key="contributor.login" v-for="(contributor, index) in contributors">
            <span>
              <a :href="contributor.html_url" class="link" target="_blank" rel="noreferrer noopener">
                {{ contributor.login }}
              </a>
            </span>
            <span v-if="index !== contributors.length - 1">, </span><span v-else>.</span>
          </span>
        </div>

        <div class="mt-16">
          <!-- ToDo. Link to the real dGrant grant -->
          <router-link
            to="/dgrants/0"
            @click="$emit('toggleAbout')"
            class="gap-2 whitespace-nowrap uppercase font-medium bg-grey-500 text-white px-8 py-4 hover:bg-grey-400"
          >
            <span>donate to <span class="text-teal">d</span>grants</span>
          </router-link>
        </div>

        <div class="mt-16 mb-8 block md:flex gap-x-8">
          <div>
            <a href="https://github.com/dcgtc/dgrants/blob/main/LICENSE" target="_blank" rel="noreferrer noopener"
              >Licensed under AGPL-3.0 License</a
            >
          </div>
          <div><a href="https://github.com/dcgtc/dgrants" target="_blank" rel="noreferrer noopener">Github</a></div>
          <div class="ml-auto">
            <a href="https://support.gitcoin.co" target="_blank" rel="noreferrer noopener">Help & Support</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CloseIcon as XIcon } from '@fusion-icons/vue/interface';

export default defineComponent({
  name: 'About',
  props: {
    showAbout: Boolean,
  },
  components: {
    XIcon,
  },
  data() {
    return {
      contributors: [],
    };
  },
  emits: ['toggleAbout'],
  async created() {
    const response = await fetch('https://api.github.com/repos/dcgtc/dgrants/contributors');
    this.contributors = await response.json();
  },
});
</script>